import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Grid2 as Grid, LinearProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import type { ErrosVeiculo, RequisicaoPost, VeiculoForm as Form } from '../types';
import { CORES, normalizarCampo, validarCampo, validarFormulario } from '../validacao';

// Endpoint fictício: não precisa existir
const ENDPOINT = 'https://api.sistemanorteador.com.br/v1/veiculos';

const CAMPOS: (keyof Form)[] = ['marca', 'modelo', 'placa', 'ano', 'cor', 'clienteId'];
const FORM_INICIAL: Form = { marca: '', modelo: '', placa: '', ano: '', cor: '', clienteId: '' };
const ERROS_INICIAIS: ErrosVeiculo = { marca: '', modelo: '', placa: '', ano: '', cor: '', clienteId: '' };
const TOCADOS_INICIAIS: Record<keyof Form, boolean> = {
  marca: false, modelo: false, placa: false, ano: false, cor: false, clienteId: false,
};

interface VeiculoFormProps {
  onSalvar: (requisicao: RequisicaoPost) => void;
  onLimpar: () => void;
}

export default function VeiculoForm({ onSalvar, onLimpar }: VeiculoFormProps) {
  // useState: valores, erros, campos já editados e validade geral
  const [form, setForm] = useState<Form>(FORM_INICIAL);
  const [erros, setErros] = useState<ErrosVeiculo>(ERROS_INICIAIS);
  const [tocados, setTocados] = useState(TOCADOS_INICIAIS);
  const [formValido, setFormValido] = useState(false);

  // onChange: normaliza e valida o campo conforme o usuário digita
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const campo = e.target.name as keyof Form;
    const valor = normalizarCampo(campo, e.target.value);

    setForm((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: validarCampo(campo, valor) }));
    setTocados((anterior) => ({ ...anterior, [campo]: true }));
  }

  // useEffect: sempre que os dados mudam, habilita/desabilita o botão Salvar
  useEffect(() => {
    const todosErros = validarFormulario(form);
    setFormValido(Object.values(todosErros).every((msg) => msg === ''));
  }, [form]);

  function limpar() {
    setForm(FORM_INICIAL);
    setErros(ERROS_INICIAIS);
    setTocados(TOCADOS_INICIAIS);
  }

  // Salvar: monta a requisição POST e entrega ao pai, que mostra no modal
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValido) return;

    onSalvar({
      method: 'POST',
      url: ENDPOINT,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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

  const validos = CAMPOS.filter((c) => validarCampo(c, form[c]) === '').length;
  const progresso = Math.round((validos / CAMPOS.length) * 100);

  // Props comuns aos campos
  const props = (campo: keyof Form) => ({
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

  return (
    <Paper component="form" onSubmit={handleSubmit} noValidate elevation={4} className="card-neon" sx={{ p: { xs: 2.5, sm: 3.5 }, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={0.5}>
        <Typography variant="h6">Cadastrar veículo</Typography>
        <Typography variant="body2" color={progresso === 100 ? 'success.main' : 'text.secondary'}>
          {validos}/{CAMPOS.length} campos válidos
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progresso}
        color={progresso === 100 ? 'success' : 'primary'}
        sx={{ mb: 3, height: 6, borderRadius: 3 }}
      />

      <Grid container spacing={2}>
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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
        <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={!formValido} fullWidth>
          Salvar
        </Button>
        <Button
          variant="outlined"
          size="large"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={() => { limpar(); onLimpar(); }}
          fullWidth
        >
          Limpar
        </Button>
      </Stack>
    </Paper>
  );
}
