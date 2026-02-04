import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import Layout from '../components/Layout';

export default function Home() {
  const history = useHistory();

  return (
    <Layout>
      <Box>
        <Typography variant="h1" sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} gutterBottom>
          Bienvenido
        </Typography>
      </Box>
    </Layout>
  );
}
