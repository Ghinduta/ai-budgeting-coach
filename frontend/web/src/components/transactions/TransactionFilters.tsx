import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FilterList, Clear } from '@mui/icons-material';

interface Filters {
  startDate: Date | null;
  endDate: Date | null;
  account: string;
  category: string;
  merchant: string;
  type: string;
}

interface Props {
  onApply: (filters: Filters) => void;
}

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

export function TransactionFilters({ onApply }: Props) {
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    account: '',
    category: '',
    merchant: '',
    type: '',
  });

  const handleChange = (field: keyof Filters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    const cleared: Filters = {
      startDate: null,
      endDate: null,
      account: '',
      category: '',
      merchant: '',
      type: '',
    };
    setFilters(cleared);
    onApply(cleared);
  };

  const getActiveFilters = () => {
    const active: string[] = [];
    if (filters.startDate) active.push(`From: ${filters.startDate.toLocaleDateString()}`);
    if (filters.endDate) active.push(`To: ${filters.endDate.toLocaleDateString()}`);
    if (filters.account) active.push(`Account: ${filters.account}`);
    if (filters.category) active.push(`Category: ${filters.category}`);
    if (filters.merchant) active.push(`Merchant: ${filters.merchant}`);
    if (filters.type) active.push(`Type: ${filters.type}`);
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <DatePicker
          label="Start Date"
          value={filters.startDate}
          onChange={(date) => handleChange('startDate', date)}
          slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
        />

        <DatePicker
          label="End Date"
          value={filters.endDate}
          onChange={(date) => handleChange('endDate', date)}
          slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={filters.account}
            label="Account"
            onChange={(e) => handleChange('account', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {ACCOUNTS.map((account) => (
              <MenuItem key={account} value={account}>
                {account}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            label="Type"
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Merchant"
          size="small"
          value={filters.merchant}
          onChange={(e) => handleChange('merchant', e.target.value)}
          sx={{ width: 150 }}
        />

        <Button
          variant="contained"
          startIcon={<FilterList />}
          onClick={handleApply}
          size="small"
        >
          Apply
        </Button>

        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClear}
          size="small"
        >
          Clear
        </Button>
      </Box>

      {activeFilters.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {activeFilters.map((filter, index) => (
            <Chip key={index} label={filter} size="small" variant="outlined" />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
