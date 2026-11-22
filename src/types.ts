// Campos do formulário (tudo string, como vem dos inputs)
export interface VeiculoForm {
  marca: string;
  modelo: string;
  placa: string;
  ano: string;
  cor: string;
  clienteId: string;
}

// Mensagem de erro de cada campo ('' = campo válido)
export type ErrosVeiculo = Record<keyof VeiculoForm, string>;

// JSON enviado ao endpoint REST
export interface VeiculoPayload {
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  cliente_id: number;
}

// Veículo exibido na tabela do dashboard
export interface VeiculoCadastrado extends VeiculoPayload {
  id: number;
  criadoEm: string;
}

// Toast (Snackbar) exibido no canto da tela
export interface Toast {
  mensagem: string;
  tipo: 'success' | 'info' | 'warning' | 'error';
}

// Representação da requisição HTTP montada
export interface RequisicaoPost {
  method: 'POST';
  url: string;
  headers: Record<string, string>;
  body: VeiculoPayload;
}
