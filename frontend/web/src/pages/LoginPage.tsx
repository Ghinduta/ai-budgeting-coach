import { Box, Container, Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming Soon - Authentication will be implemented in Epic 2
        </Typography>
      </Box>
    </Container>
  );
}
