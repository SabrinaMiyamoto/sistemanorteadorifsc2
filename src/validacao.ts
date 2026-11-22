import type { ErrosVeiculo, VeiculoForm } from './types';

export const CORES = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Outra'];

const ANO_MINIMO = 1900;
const ANO_MAXIMO = new Date().getFullYear() + 1; // aceita modelo do ano seguinte

// Placa antiga (ABC1234) ou padrão Mercosul (ABC1D23)
const REGEX_PLACA = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const REGEX_TEXTO = /^[A-Za-zÀ-ÿ0-9 .-]+$/;

// Valida um único campo e devolve a mensagem de erro ('' quando válido)
export function validarCampo(campo: keyof VeiculoForm, valor: string): string {
  const v = valor.trim();

  switch (campo) {
    case 'marca':
      if (!v) return 'Informe a marca.';
      if (v.length < 2) return 'A marca deve ter ao menos 2 caracteres.';
      if (v.length > 50) return 'Máximo de 50 caracteres.';
      if (!/^[A-Za-zÀ-ÿ .-]+$/.test(v)) return 'Use apenas letras.';
      return '';

    case 'modelo':
      if (!v) return 'Informe o modelo.';
      if (v.length > 50) return 'Máximo de 50 caracteres.';
      if (!REGEX_TEXTO.test(v)) return 'Caracteres inválidos.';
      return '';

    case 'placa':
      if (!v) return 'Informe a placa.';
      if (v.length < 7) return `Faltam ${7 - v.length} caractere(s).`;
      if (!REGEX_PLACA.test(v)) return 'Formato inválido. Use ABC1234 ou ABC1D23.';
      return '';

    case 'ano': {
      if (!v) return 'Informe o ano.';
      if (!/^\d{4}$/.test(v)) return 'O ano deve ter 4 dígitos.';
      const ano = Number(v);
      if (ano < ANO_MINIMO || ano > ANO_MAXIMO) return `Ano entre ${ANO_MINIMO} e ${ANO_MAXIMO}.`;
      return '';
    }

    case 'cor':
      if (!v) return 'Selecione a cor.';
      if (!CORES.includes(v)) return 'Cor inválida.';
      return '';

    case 'clienteId':
      if (!v) return 'Informe o ID do cliente.';
      if (!/^[1-9]\d*$/.test(v)) return 'O ID deve ser um número inteiro positivo.';
      return '';
  }
}

export function validarFormulario(form: VeiculoForm): ErrosVeiculo {
  return {
    marca: validarCampo('marca', form.marca),
    modelo: validarCampo('modelo', form.modelo),
    placa: validarCampo('placa', form.placa),
    ano: validarCampo('ano', form.ano),
    cor: validarCampo('cor', form.cor),
    clienteId: validarCampo('clienteId', form.clienteId),
  };
}

// Ajusta o valor enquanto o usuário digita (máscaras simples)
export function normalizarCampo(campo: keyof VeiculoForm, valor: string): string {
  if (campo === 'placa') return valor.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (campo === 'ano') return valor.replace(/\D/g, '').slice(0, 4);
  if (campo === 'clienteId') return valor.replace(/\D/g, '');
  return valor;
}
