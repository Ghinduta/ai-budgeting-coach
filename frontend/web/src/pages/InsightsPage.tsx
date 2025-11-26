import { Box, Container, Typography } from '@mui/material';

export default function InsightsPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming Soon - AI-powered insights will be implemented in Epic 4
        </Typography>
      </Box>
    </Container>
  );
}
