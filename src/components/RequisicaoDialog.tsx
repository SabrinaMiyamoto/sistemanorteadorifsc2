import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';

import type { RequisicaoPost } from '../types';

interface RequisicaoDialogProps {
  requisicao: RequisicaoPost | null;
  onFechar: () => void;
  onConfirmar: (requisicao: RequisicaoPost) => void;
  onCopiado: (ok: boolean) => void;
}

function gerarHttp(r: RequisicaoPost): string {
  const url = new URL(r.url);
  return (
    `POST ${url.pathname} HTTP/1.1\n` +
    `Host: ${url.host}\n` +
    Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\n${JSON.stringify(r.body, null, 2)}`
  );
}

function gerarFetch(r: RequisicaoPost): string {
  const indentar = (texto: string) => texto.replace(/\n/g, '\n  ');
  return (
    `fetch('${r.url}', {\n` +
    `  method: 'POST',\n` +
    `  headers: ${indentar(JSON.stringify(r.headers, null, 2))},\n` +
    `  body: JSON.stringify(${indentar(JSON.stringify(r.body, null, 2))})\n` +
    `});`
  );
}

export default function RequisicaoDialog({ requisicao, onFechar, onConfirmar, onCopiado }: RequisicaoDialogProps) {
  const [aba, setAba] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const theme = useTheme();
  const telaPequena = useMediaQuery(theme.breakpoints.down('sm'));

  if (!requisicao) return null;

  const textos = [gerarHttp(requisicao), gerarFetch(requisicao), JSON.stringify(requisicao.body, null, 2)];

  async function copiar() {
    try {
      await navigator.clipboard.writeText(textos[aba]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
      onCopiado(true);
    } catch {
      onCopiado(false);
    }
  }

  return (
    <Dialog open onClose={onFechar} fullWidth maxWidth="md" fullScreen={telaPequena} slotProps={{ paper: { className: 'card-neon' } }}>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label="POST" color="success" size="small" sx={{ fontWeight: 700 }} />
          <Box component="span" sx={{ fontFamily: 'Consolas, monospace', fontSize: '0.95rem', wordBreak: 'break-all' }}>
            {requisicao.url}
          </Box>
        </Stack>
        <IconButton onClick={onFechar} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Fechar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Esta é a requisição que seria enviada ao endpoint REST. O endpoint é ilustrativo, então nada sai do navegador.
        </Alert>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Tabs value={aba} onChange={(_, v: number) => setAba(v)} variant="scrollable">
            <Tab label="HTTP" />
            <Tab label="fetch()" />
            <Tab label="JSON" />
          </Tabs>
          <Button
            variant={copiado ? 'contained' : 'outlined'}
            color={copiado ? 'success' : 'primary'}
            size="small"
            startIcon={copiado ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={copiar}
            sx={{ flexShrink: 0, ml: 1 }}
          >
            {copiado ? 'Copiado!' : 'Copiar'}
          </Button>
        </Stack>

        <Box sx={{ position: 'relative', mt: 2 }}>
          <Tooltip title={copiado ? 'Copiado!' : 'Copiar'}>
            <IconButton onClick={copiar} size="small" aria-label="Copiar código" sx={{ position: 'absolute', top: 8, right: 8, color: 'primary.main', bgcolor: 'rgba(0,0,0,0.5)' }}>
              {copiado ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Box component="pre" className="codigo">{textos[aba]}</Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onFechar} color="inherit">Voltar e editar</Button>
        <Button variant="contained" startIcon={<SendIcon />} onClick={() => onConfirmar(requisicao)}>
          Enviar (simulado)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
