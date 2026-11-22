# Cadastro de Veículo — Sistema Norteador (React + TypeScript + Material UI)

Aplicação React que apresenta um formulário para cadastro de veículos no Sistema Norteador (Lavação Web).

## Requisitos atendidos

| Requisito | Onde |
|---|---|
| Validar as informações conforme são inseridas, com `useState` e `onChange` | `src/App.tsx` → `handleChange` + `src/validacao.ts` |
| Habilitar o botão **Salvar** quando os dados forem válidos, com `useEffect` | `src/App.tsx` → `useEffect(..., [form])` controla `formValido` |
| Construir e mostrar a requisição **POST** com o JSON dos dados | `src/App.tsx` → `handleSubmit` (o endpoint é fictício; nada é enviado) |

## Extras (ilustrativos)

- **Dashboard**: menu lateral, barra superior, cartões de estatísticas e tabela dos últimos veículos (dados fictícios em `src/dados.ts`)
- **Modal** (`src/components/RequisicaoDialog.tsx`): mostra a requisição nas abas HTTP, `fetch()` e JSON, com botão **Copiar**
- **Toasts** (Snackbar do MUI) para requisição montada, envio simulado, placa repetida, cópia e itens de menu ilustrativos
- **Enviar (simulado)**: adiciona o veículo na tabela como se o backend tivesse respondido com sucesso

## Campos e validações

- **Marca**: obrigatória, de 2 a 50 letras
- **Modelo**: obrigatório, até 50 caracteres
- **Placa**: formato antigo `ABC1234` ou Mercosul `ABC1D23` (em maiúsculas automaticamente)
- **Ano**: 4 dígitos, entre 1900 e o ano seguinte ao atual
- **Cor**: selecionada da lista
- **ID do cliente**: inteiro positivo

## Exemplo da requisição gerada

```http
POST /v1/veiculos HTTP/1.1
Host: api.sistemanorteador.com.br
Content-Type: application/json
Accept: application/json

{
  "marca": "Volkswagen",
  "modelo": "Gol",
  "placa": "ABC1D23",
  "ano": 2020,
  "cor": "Prata",
  "cliente_id": 1
}
```

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

## Tecnologias

React 19, TypeScript, Vite, Material UI 6.

## Desenvolvedora

Sabrina Miyamoto — IFSC
