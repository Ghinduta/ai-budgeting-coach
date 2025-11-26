import { Box, Container, Typography } from '@mui/material';

export default function BudgetsPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Budgets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming Soon - Budget tracking will be implemented in Epic 5
        </Typography>
      </Box>
    </Container>
  );
}
