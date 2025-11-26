import { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { apiService } from '../services/api';

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

interface Filters {
  startDate: Date | null;
  endDate: Date | null;
  account: string;
  category: string;
  merchant: string;
  type: string;
}

export default function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>();
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    account: '',
    category: '',
    merchant: '',
    type: '',
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.delete(`/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTransaction(undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Transactions</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Transaction
          </Button>
        </Box>

        <TransactionFilters onApply={setFilters} />

        <TransactionList
          filters={filters}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <TransactionForm
          open={formOpen}
          onClose={handleCloseForm}
          transaction={editTransaction}
        />
      </Box>
    </Container>
  );
}
