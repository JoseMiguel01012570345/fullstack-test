import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export default function ErrorPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <WarningIcon
          sx={{
            fontSize: 80,
            color: '#1976d2',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
            fontWeight: 'bold',
            color: '#1976d2',
            lineHeight: 1,
          }}
        >
          404
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#424242',
          fontWeight: 400,
          mt: 2,
        }}
      >
        Oops... Page Not Found!
      </Typography>
    </Box>
  );
}
