import { Box, List, ListItem, ListItemText, Typography, Skeleton, Divider } from '@mui/material';

interface Props {
  data?: Record<string, number>;
  isLoading: boolean;
}

export function AccountBreakdown({ data, isLoading }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <List>
        {[1, 2, 3].map((i) => (
          <ListItem key={i}>
            <Skeleton variant="text" width="100%" />
          </ListItem>
        ))}
      </List>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="text.secondary">No accounts found</Typography>
      </Box>
    );
  }

  return (
    <List>
      {Object.entries(data).map(([account, balance], index) => (
        <Box key={account}>
          <ListItem>
            <ListItemText
              primary={account}
              secondary={
                <Typography
                  variant="body2"
                  sx={{ color: balance >= 0 ? 'success.main' : 'error.main' }}
                >
                  {formatCurrency(balance)}
                </Typography>
              }
            />
          </ListItem>
          {index < Object.keys(data).length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
}
