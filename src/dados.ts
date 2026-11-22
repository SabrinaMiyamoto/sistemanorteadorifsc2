import type { VeiculoCadastrado } from './types';

// Dados ilustrativos para o dashboard (não vêm de um backend)
export const VEICULOS_INICIAIS: VeiculoCadastrado[] = [
  { id: 3, marca: 'Volkswagen', modelo: 'Gol', placa: 'ABC1234', ano: 2018, cor: 'Prata', cliente_id: 2, criadoEm: '2026-07-07T20:29:03' },
  { id: 2, marca: 'Fiat', modelo: 'Uno', placa: 'BRA2E19', ano: 2015, cor: 'Branco', cliente_id: 1, criadoEm: '2026-07-07T20:29:03' },
  { id: 1, marca: 'Chevrolet', modelo: 'Onix', placa: 'IFS2C26', ano: 2022, cor: 'Preto', cliente_id: 1, criadoEm: '2026-07-07T20:29:03' },
];

export const ESTATISTICAS = {
  clientes: 2,
  agendamentosHoje: 5,
  lavacoesMes: 128,
};
