import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/api';

const transactionSchema = z.object({
  date: z.date().refine((date) => date <= new Date(), 'Date cannot be in the future'),
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['Income', 'Expense']),
  merchant: z.string().min(1, 'Merchant is required').max(200),
  account: z.string().min(1, 'Account is required').max(100),
  category: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Income',
  'Transfer',
  'Other',
];

const ACCOUNTS = ['Checking', 'Savings', 'Credit Card', 'Cash'];

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  merchant: string;
  account: string;
  category: string | null;
  notes?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export function TransactionForm({ open, onClose, transaction }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!transaction;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      type: 'Expense',
      merchant: '',
      account: 'Checking',
      category: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        date: new Date(transaction.date),
        amount: transaction.amount,
        type: transaction.type as 'Income' | 'Expense',
        merchant: transaction.merchant,
        account: transaction.account,
        category: transaction.category || '',
        notes: transaction.notes || '',
      });
    } else {
      reset({
        date: new Date(),
        amount: 0,
        type: 'Expense',
        merchant: '',
        account: 'Checking',
        category: '',
        notes: '',
      });
    }
  }, [transaction, reset, open]);

  const mutation = useMutation({
    mutationFn: (data: TransactionFormData) => {
      const payload = {
        date: data.date.toISOString().split('T')[0],
        amount: data.amount,
        type: data.type === 'Income' ? 1 : 2,
        merchant: data.merchant,
        account: data.account,
        category: data.category || null,
        notes: data.notes || null,
      };

      if (isEdit) {
        return apiService.put(`/api/transactions/${transaction.id}`, payload);
      }
      return apiService.post('/api/transactions', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      onClose();
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>

        <DialogContent>
          {mutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(mutation.error as Error)?.message || 'Failed to save transaction'}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  slotProps={{
                    textField: {
                      error: !!errors.date,
                      helperText: errors.date?.message,
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select {...register('type')} label="Type" defaultValue="Expense">
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
            </FormControl>

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ step: '0.01', min: '0.01' }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  fullWidth
                />
              )}
            />

            <TextField
              {...register('merchant')}
              label="Merchant"
              error={!!errors.merchant}
              helperText={errors.merchant?.message}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Account</InputLabel>
              <Select {...register('account')} label="Account" defaultValue="Checking">
                {ACCOUNTS.map((account) => (
                  <MenuItem key={account} value={account}>
                    {account}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select {...register('category')} label="Category" defaultValue="">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              {...register('notes')}
              label="Notes"
              multiline
              rows={2}
              error={!!errors.notes}
              helperText={errors.notes?.message}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
