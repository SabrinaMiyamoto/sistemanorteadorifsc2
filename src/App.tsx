import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid2 as Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import type { ErrosVeiculo, RequisicaoPost, VeiculoForm } from './types';
import { CORES, normalizarCampo, validarCampo, validarFormulario } from './validacao';

// Endpoint fictício: não precisa existir
const ENDPOINT = 'https://api.sistemanorteador.com.br/v1/veiculos';

const FORM_INICIAL: VeiculoForm = { marca: '', modelo: '', placa: '', ano: '', cor: '', clienteId: '' };
const ERROS_INICIAIS: ErrosVeiculo = { marca: '', modelo: '', placa: '', ano: '', cor: '', clienteId: '' };
const TOCADOS_INICIAIS: Record<keyof VeiculoForm, boolean> = {
  marca: false, modelo: false, placa: false, ano: false, cor: false, clienteId: false,
};

export default function App() {
  // useState: valores, erros, campos já editados, validade do formulário e requisição montada
  const [form, setForm] = useState<VeiculoForm>(FORM_INICIAL);
  const [erros, setErros] = useState<ErrosVeiculo>(ERROS_INICIAIS);
  const [tocados, setTocados] = useState(TOCADOS_INICIAIS);
  const [formValido, setFormValido] = useState(false);
  const [requisicao, setRequisicao] = useState<RequisicaoPost | null>(null);

  // onChange: normaliza e valida o campo conforme o usuário digita
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const campo = e.target.name as keyof VeiculoForm;
    const valor = normalizarCampo(campo, e.target.value);

    setForm((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: validarCampo(campo, valor) }));
    setTocados((anterior) => ({ ...anterior, [campo]: true }));
    setRequisicao(null); // dados mudaram: a requisição mostrada fica desatualizada
  }

  // useEffect: sempre que os dados mudam, verifica se TODOS os campos são válidos
  // e habilita/desabilita o botão Salvar
  useEffect(() => {
    const todosErros = validarFormulario(form);
    setFormValido(Object.values(todosErros).every((msg) => msg === ''));
  }, [form]);

  // Salvar: monta a requisição POST (não envia, só mostra)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValido) return;

    setRequisicao({
      method: 'POST',
      url: ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: {
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        placa: form.placa,
        ano: Number(form.ano),
        cor: form.cor,
        cliente_id: Number(form.clienteId),
      },
    });
  }

  function limpar() {
    setForm(FORM_INICIAL);
    setErros(ERROS_INICIAIS);
    setTocados(TOCADOS_INICIAIS);
    setRequisicao(null);
  }

  // Props comuns aos campos de texto
  const props = (campo: keyof VeiculoForm) => ({
    name: campo,
    value: form[campo],
    onChange: handleChange,
    error: tocados[campo] && erros[campo] !== '',
    helperText: tocados[campo] ? erros[campo] || 'OK' : ' ',
    color: (tocados[campo] && !erros[campo] ? 'success' : 'primary') as 'success' | 'primary',
    focused: tocados[campo] && !erros[campo] ? true : undefined,
    fullWidth: true,
    required: true,
  });

  const textoHttp = requisicao
    ? `POST ${new URL(requisicao.url).pathname} HTTP/1.1\n` +
      `Host: ${new URL(requisicao.url).host}\n` +
      Object.entries(requisicao.headers).map(([k, v]) => `${k}: ${v}`).join('\n') +
      `\n\n${JSON.stringify(requisicao.body, null, 2)}`
    : '';

  const textoFetch = requisicao
    ? `fetch('${requisicao.url}', {\n` +
      `  method: 'POST',\n` +
      `  headers: ${JSON.stringify(requisicao.headers, null, 2).replace(/\n/g, '\n  ')},\n` +
      `  body: JSON.stringify(${JSON.stringify(requisicao.body, null, 2).replace(/\n/g, '\n  ')})\n` +
      `});`
    : '';

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" mb={1}>
        <DirectionsCarIcon color="primary" fontSize="large" />
        <Typography variant="h4" component="h1" fontWeight={600} className="titulo-gradiente">
          Cadastro de Veículo
        </Typography>
      </Stack>
      <Typography align="center" color="text.secondary" mb={4}>
        Sistema Norteador — Lavação Web
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} noValidate elevation={6} className="card-neon" sx={{ p: { xs: 3, sm: 5 } }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Marca" placeholder="Ex: Volkswagen" {...props('marca')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Modelo" placeholder="Ex: Gol" {...props('modelo')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Placa"
              placeholder="ABC1D23"
              {...props('placa')}
              slotProps={{ htmlInput: { style: { letterSpacing: 3, fontWeight: 700 } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Ano" placeholder="2024" {...props('ano')} slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="Cor" {...props('cor')}>
              {CORES.map((cor) => (
                <MenuItem key={cor} value={cor}>{cor}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="ID do cliente" placeholder="1" {...props('clienteId')} slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3}>
          <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={!formValido} fullWidth>
            Salvar
          </Button>
          <Button variant="outlined" size="large" color="secondary" startIcon={<RestartAltIcon />} onClick={limpar} fullWidth>
            Limpar
          </Button>
        </Stack>

        {!formValido && (
          <Typography variant="body2" color="text.secondary" align="center" mt={2}>
            O botão Salvar será habilitado quando todos os campos forem válidos.
          </Typography>
        )}
      </Paper>

      {requisicao && (
        <Paper elevation={6} className="card-neon" sx={{ p: { xs: 3, sm: 4 }, mt: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Requisição montada (não enviada — o endpoint é apenas ilustrativo).
          </Alert>

          <Typography variant="h6" gutterBottom>Requisição HTTP</Typography>
          <Box component="pre" className="codigo">{textoHttp}</Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>Equivalente com fetch()</Typography>
          <Box component="pre" className="codigo">{textoFetch}</Box>
        </Paper>
      )}
    </Container>
  );
}
