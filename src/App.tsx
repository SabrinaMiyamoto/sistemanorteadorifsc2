import { useState } from 'react';
import { Alert, Grid2 as Grid, Slide, Snackbar, Typography } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';

import Layout from './components/Layout';
import StatCard from './components/StatCard';
import VeiculoForm from './components/VeiculoForm';
import RequisicaoDialog from './components/RequisicaoDialog';
import VeiculosRecentes from './components/VeiculosRecentes';
import { ESTATISTICAS, VEICULOS_INICIAIS } from './dados';
import type { RequisicaoPost, Toast, VeiculoCadastrado } from './types';

export default function App() {
  const [veiculos, setVeiculos] = useState<VeiculoCadastrado[]>(VEICULOS_INICIAIS);
  const [requisicao, setRequisicao] = useState<RequisicaoPost | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [toastAberto, setToastAberto] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [destaqueId, setDestaqueId] = useState<number | null>(null);
  const [notificacoes, setNotificacoes] = useState(3);

  function mostrarToast(mensagem: string, tipo: Toast['tipo'] = 'info') {
    setToast({ mensagem, tipo });
    setToastAberto(true);
  }

  // Botão Salvar do formulário: abre o modal com a requisição
  function handleSalvar(r: RequisicaoPost) {
    if (veiculos.some((v) => v.placa === r.body.placa)) {
      mostrarToast(`A placa ${r.body.placa} já está cadastrada.`, 'warning');
      return;
    }
    setRequisicao(r);
    mostrarToast('Requisição POST montada com sucesso!', 'info');
  }

  // "Enviar (simulado)": adiciona na tabela como se o backend tivesse respondido 201
  function handleConfirmar(r: RequisicaoPost) {
    const novo: VeiculoCadastrado = {
      ...r.body,
      id: Math.max(0, ...veiculos.map((v) => v.id)) + 1,
      criadoEm: new Date().toISOString(),
    };
    setVeiculos((lista) => [novo, ...lista]);
    setDestaqueId(novo.id);
    setNotificacoes((n) => n + 1);
    setRequisicao(null);
    setResetKey((k) => k + 1);
    mostrarToast(`Veículo ${novo.marca} ${novo.modelo} (${novo.placa}) cadastrado! (simulado)`, 'success');
  }

  return (
    <Layout notificacoes={notificacoes} onMenuIlustrativo={(item) => mostrarToast(`"${item}" é apenas ilustrativo neste protótipo.`, 'info')}>
      <Typography variant="h4" fontWeight={600} className="titulo-gradiente" gutterBottom>
        Cadastro de Veículos
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Sistema Norteador — Lavação Web · painel ilustrativo
      </Typography>

      <Grid container spacing={2.5} mb={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard titulo="Veículos cadastrados" valor={veiculos.length} icone={<DirectionsCarIcon />} cor="#00f5ff"
            detalhe={veiculos.length > VEICULOS_INICIAIS.length ? `+${veiculos.length - VEICULOS_INICIAIS.length} nesta sessão` : 'total'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard titulo="Clientes" valor={ESTATISTICAS.clientes} icone={<PeopleIcon />} cor="#ff00ff" detalhe="ativos" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard titulo="Agendamentos hoje" valor={ESTATISTICAS.agendamentosHoje} icone={<EventIcon />} cor="#00ff88" detalhe="2 em andamento" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard titulo="Lavações no mês" valor={ESTATISTICAS.lavacoesMes} icone={<LocalCarWashIcon />} cor="#ffb300" detalhe="+12% vs. mês anterior" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          {/* a key muda após o envio, recriando o formulário vazio */}
          <VeiculoForm key={resetKey} onSalvar={handleSalvar} onLimpar={() => mostrarToast('Formulário limpo.', 'info')} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <VeiculosRecentes veiculos={veiculos} destaqueId={destaqueId} />
        </Grid>
      </Grid>

      {/* Modal com a requisição POST */}
      <RequisicaoDialog
        requisicao={requisicao}
        onFechar={() => setRequisicao(null)}
        onConfirmar={handleConfirmar}
        onCopiado={(ok) => mostrarToast(ok ? 'Copiado para a área de transferência.' : 'Não foi possível copiar.', ok ? 'success' : 'error')}
      />

      {/* Toast */}
      <Snackbar
        open={toastAberto}
        autoHideDuration={4000}
        onClose={(_, motivo) => { if (motivo !== 'clickaway') setToastAberto(false); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slots={{ transition: Slide }}
      >
        <Alert onClose={() => setToastAberto(false)} severity={toast?.tipo ?? 'info'} variant="filled" sx={{ width: '100%' }}>
          {toast?.mensagem}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
