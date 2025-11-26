import { Grid, Paper, Typography, Skeleton, Box } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Receipt } from '@mui/icons-material';

interface Props {
  data?: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    transactionCount: number;
  };
  isLoading: boolean;
}

export function SummaryCards({ data, isLoading }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Income',
      value: data?.totalIncome || 0,
      icon: <TrendingUp />,
      color: 'success.main',
      isCurrency: true,
    },
    {
      title: 'Expenses',
      value: data?.totalExpenses || 0,
      icon: <TrendingDown />,
      color: 'error.main',
      isCurrency: true,
    },
    {
      title: 'Net Cash Flow',
      value: data?.netCashFlow || 0,
      icon: <AccountBalance />,
      color: (data?.netCashFlow || 0) >= 0 ? 'success.main' : 'error.main',
      isCurrency: true,
    },
    {
      title: 'Transactions',
      value: data?.transactionCount || 0,
      icon: <Receipt />,
      color: 'primary.main',
      isCurrency: false,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: card.color, mr: 1 }}>{card.icon}</Box>
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
            </Box>
            {isLoading ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h5" sx={{ color: card.color }}>
                {card.isCurrency ? formatCurrency(card.value) : card.value}
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
