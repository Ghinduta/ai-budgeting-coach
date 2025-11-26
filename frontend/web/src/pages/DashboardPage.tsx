import { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { AccountBreakdown } from '../components/dashboard/AccountBreakdown';

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
  accountBreakdown: Record<string, number>;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState('month');

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };
  };

  const { startDate, endDate } = getDateRange();

  const { data, isLoading } = useQuery({
    queryKey: ['summary', period],
    queryFn: () =>
      apiService.get<SummaryData>(
        `/api/transactions/summary?startDate=${startDate}&endDate=${endDate}`
      ),
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Dashboard</Typography>

          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, value) => value && setPeriod(value)}
            size="small"
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="quarter">Quarter</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <SummaryCards data={data} isLoading={isLoading} />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Spending by Category
              </Typography>
              <CategoryChart data={data?.categoryBreakdown} isLoading={isLoading} />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Account Balances
              </Typography>
              <AccountBreakdown data={data?.accountBreakdown} isLoading={isLoading} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
