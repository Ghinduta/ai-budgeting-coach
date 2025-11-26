import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  merchant: string;
  account: string;
  category: string | null;
}

interface PagedResponse {
  data: Transaction[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface TransactionListProps {
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  filters?: {
    startDate: Date | null;
    endDate: Date | null;
    account: string;
    category: string;
    merchant: string;
    type: string;
  };
}

export function TransactionList({ onEdit, onDelete, filters }: TransactionListProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append('page', String(page + 1));
    params.append('pageSize', String(pageSize));

    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString().split('T')[0]);
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString().split('T')[0]);
    }
    if (filters?.account) params.append('account', filters.account);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.merchant) params.append('merchant', filters.merchant);
    if (filters?.type) {
      params.append('type', filters.type === 'Income' ? '1' : '2');
    }

    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page, pageSize, filters],
    queryFn: () =>
      apiService.get<PagedResponse>(`/api/transactions?${buildQueryString()}`),
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">Failed to load transactions</Typography>
      </Box>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No transactions found</Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first transaction to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.merchant}</TableCell>
                <TableCell>{transaction.account}</TableCell>
                <TableCell>
                  {transaction.category ? (
                    <Chip label={transaction.category} size="small" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Uncategorized
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: transaction.type === 'Income' ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {transaction.type === 'Income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit?.(transaction)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete?.(transaction.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Paper>
  );
}
