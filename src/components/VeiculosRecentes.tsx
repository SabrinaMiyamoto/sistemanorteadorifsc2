import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { VeiculoCadastrado } from '../types';

const CORES_CHIP: Record<string, string> = {
  Branco: '#f5f5f5', Preto: '#222', Prata: '#c0c0c0', Cinza: '#808080', Vermelho: '#e53935',
  Azul: '#1e88e5', Verde: '#43a047', Amarelo: '#fdd835', Outra: '#9c27b0',
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function VeiculosRecentes({ veiculos, destaqueId }: { veiculos: VeiculoCadastrado[]; destaqueId: number | null }) {
  return (
    <Paper elevation={4} className="card-neon" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
      <Typography variant="h6" mb={2}>Últimos veículos</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Cliente</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Cadastro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {veiculos.slice(0, 6).map((v) => (
              <TableRow key={v.id} hover className={v.id === destaqueId ? 'linha-nova' : undefined}>
                <TableCell>
                  <Box component="span" sx={{ fontFamily: 'Consolas, monospace', fontWeight: 700, letterSpacing: 1.5, color: 'success.main' }}>
                    {v.placa}
                  </Box>
                </TableCell>
                <TableCell>
                  {v.marca} {v.modelo}
                  <Typography variant="caption" display="block" color="text.secondary">
                    <Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: CORES_CHIP[v.cor], mr: 0.5 }} />
                    {v.cor} · {v.ano}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Chip label={`#${v.cliente_id}`} size="small" variant="outlined" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, whiteSpace: 'nowrap' }}>{formatarData(v.criadoEm)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
