import type { ReactNode } from 'react';
import { Avatar, Paper, Stack, Typography } from '@mui/material';

interface StatCardProps {
  titulo: string;
  valor: number | string;
  icone: ReactNode;
  cor: string;
  detalhe?: string;
}

export default function StatCard({ titulo, valor, icone, cor, detalhe }: StatCardProps) {
  return (
    <Paper className="card-neon" elevation={4} sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: `${cor}22`, color: cor, width: 52, height: 52, boxShadow: `0 0 12px ${cor}55` }}>
          {icone}
        </Avatar>
        <div>
          <Typography variant="body2" color="text.secondary">{titulo}</Typography>
          <Typography variant="h5" fontWeight={700}>{valor}</Typography>
          {detalhe && <Typography variant="caption" sx={{ color: cor }}>{detalhe}</Typography>}
        </div>
      </Stack>
    </Paper>
  );
}
