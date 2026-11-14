# Menu CMS — Painel Administrativo do Cardápio Digital

## Sobre o projeto

O **Menu CMS** é um painel administrativo desenvolvido para facilitar o gerenciamento de um cardápio digital. A ideia é permitir que a equipe de um restaurante consiga organizar categorias, produtos, mesas, comandas e pedidos em um único sistema, de forma prática e organizada.

O sistema também permite acompanhar os pedidos e atualizar seus status conforme o andamento do atendimento. Para facilitar essa visualização, foi desenvolvido um quadro Kanban, no qual os pedidos podem ser movimentados entre as etapas por meio do recurso de arrastar e soltar.

O projeto foi desenvolvido com React e TypeScript e utiliza a API construída em NestJS no projeto `menu-backend` para realizar as operações e manter os dados atualizados.

## Funcionalidades

O painel conta com as seguintes funcionalidades:

### Gerenciamento de categorias
- Listagem das categorias cadastradas.
- Cadastro, edição e exclusão de categorias.
- Definição de nome, ícone, ordem de exibição e situação.
- Confirmação antes de realizar exclusões.

### Gerenciamento de produtos
- Listagem dos produtos com imagem, categoria e preço em reais.
- Identificação de produtos vegetarianos e novidades.
- Filtro de produtos por categoria.
- Cadastro, edição e exclusão de produtos.
- Seleção da categoria a partir dos dados fornecidos pela API.

### Gerenciamento de mesas
- Consulta das mesas cadastradas.
- Cadastro de novas mesas.
- Edição e exclusão, com confirmação.

### Comandas e pedidos
- Visualização das comandas que estão abertas, com status `OPENED`.
- Identificação da mesa e da data de abertura.
- Exibição do valor acumulado de cada comanda.
- Consulta dos pedidos vinculados a cada comanda.
- Detalhamento dos itens, quantidades, preços unitários e subtotais.
- Atualização do status dos pedidos entre Novo, Em preparo, Pronto e Entregue.

### Quadro Kanban

Como funcionalidade adicional, foi implementado um quadro Kanban para melhorar a organização e o acompanhamento dos pedidos.

Cada coluna representa uma etapa do atendimento. Ao arrastar um pedido para outra coluna, o sistema atualiza seu status por meio da API.

### Tratamento de erros e validações

Também foram considerados alguns cuidados para melhorar a utilização do sistema:

- Indicação de carregamento durante as consultas.
- Mensagens em situações de erro.
- Avisos quando não existem dados para apresentar.
- Confirmação antes de excluir registros.
- Mensagens de sucesso ou erro após operações.
- Validação dos campos obrigatórios e de preços maiores que zero.

## Tecnologias utilizadas

Para o desenvolvimento, foram utilizadas as seguintes tecnologias:

| Tecnologia | Utilização |
|---|---|
| React | Construção da interface e dos componentes |
| TypeScript | Tipagem e organização do código |
| Vite | Configuração e execução do projeto |
| Tailwind CSS | Estilização da interface |
| shadcn/ui | Componentes visuais |
| Axios | Comunicação com a API |
| TanStack Query | Consultas, alterações e atualização dos dados |

### Comunicação com a API

Para centralizar as requisições HTTP, foi criada uma única instância do Axios no arquivo `src/lib/axios.ts`.

O endereço da API é configurado por meio da variável de ambiente `VITE_API_URL`, evitando que URLs precisem ser repetidas diretamente nos componentes.

O TanStack Query é utilizado para gerenciar as consultas e alterações dos dados.

As operações de leitura utilizam `useQuery`, enquanto cadastros, edições, exclusões e alterações de status utilizam `useMutation`.

Após as alterações, o `invalidateQueries` permite atualizar as consultas relacionadas, mantendo as informações da interface sincronizadas com o backend.

## Organização do projeto

A estrutura foi organizada de forma que cada parte do sistema tenha uma responsabilidade específica, facilitando tanto o desenvolvimento quanto a manutenção.

```text
src/
├── cases/
│   └── <entidade>/
│       ├── dtos/
│       ├── services/
│       ├── hooks/
│       └── components/
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
├── pages/
└── lib/
```

Dentro de cada entidade, a organização segue o fluxo:

**DTO → Service → Hook → Componente/Página**

- **DTO:** define o formato dos dados utilizados.
- **Service:** concentra as requisições realizadas à API.
- **Hook:** gerencia as consultas e operações.
- **Componente/Página:** apresenta as informações e permite a interação do usuário.

Essa divisão evita concentrar muitas responsabilidades em um único arquivo e facilita a reutilização do código.

## Decisões tomadas durante o desenvolvimento

Algumas escolhas foram feitas pensando na organização do projeto e na utilização das ferramentas que já faziam parte da aplicação.

### Cálculo do total das comandas

Como a API não retorna diretamente o valor acumulado de cada comanda, esse cálculo é realizado no frontend.

Para isso, são somados os valores dos pedidos vinculados à comanda, permitindo apresentar o total na interface.

### Implementação do Kanban

Para a movimentação dos pedidos entre as colunas, foi utilizado o recurso nativo de arrastar e soltar do HTML5.

Essa escolha permitiu implementar a funcionalidade sem adicionar uma biblioteca específica para isso.

Quando um pedido é movimentado, uma mutation envia a alteração para a API, atualizando seu status.

### Mensagens de feedback

Para informar ao usuário o resultado das operações, foi criado um `FeedbackProvider`, utilizando o componente Alert do shadcn/ui.

Com isso, o sistema consegue apresentar mensagens de sucesso e erro sem precisar adicionar uma biblioteca de notificações.

## Dependências complementares

Além das tecnologias principais, foram utilizadas algumas dependências relacionadas à interface e à estilização, seguindo a mesma estrutura adotada no `menu-frontend`.

| Dependência | Finalidade |
|---|---|
| `@base-ui/react` | Componentes base da interface |
| `class-variance-authority` | Organização de variantes de estilos |
| `cn` | Utilitário para composição de classes |
| `lucide-react` | Ícones utilizados no sistema |
| `tw-animate-css` | Animações da interface |
| `@fontsource-variable/inter` | Fonte utilizada no projeto |
| `shadcn` | Ferramentas relacionadas aos componentes visuais |

Não foram adicionadas bibliotecas extras para implementar o Kanban ou as mensagens de feedback.

## Como executar o projeto

Antes de iniciar o CMS, é necessário que o projeto `menu-backend` esteja configurado e em execução.

**1. Instale as dependências:**

```bash
npm install
```

**2. Crie o arquivo de configuração:**

```bash
cp .env.example .env
```

**3. Configure o endereço da API no `.env`:**

```env
VITE_API_URL=http://localhost:3000
```

**4. Inicie a aplicação:**

```bash
npm run dev
```

Por padrão, o painel ficará disponível em:

`http://localhost:5173`

## Integração com o backend

Para que todas as funcionalidades sejam executadas corretamente, o backend precisa permitir requisições do frontend por meio da configuração de CORS.

Também são necessários os seguintes recursos da API:

- `GET /guest-checks?status=OPENED`: consulta das comandas abertas.
- `GET /orders`: consulta dos pedidos com seus itens e relacionamentos.
- `PATCH /orders/:id/status`: atualização do status dos pedidos.

Além disso, as categorias devem disponibilizar os campos `icon` e `displayOrder`, enquanto os produtos devem possuir `vegetarian` e `isNew`.

Essas informações são necessárias para a exibição e o funcionamento dos recursos administrativos.

## Considerações finais

O desenvolvimento do Menu CMS teve como objetivo reunir as principais operações administrativas de um cardápio digital em uma interface simples e funcional.

Durante a implementação, procurei manter uma organização que facilitasse a comunicação com o backend, a reutilização dos componentes e a manutenção do código.

A utilização de React, TypeScript, Axios e TanStack Query contribuiu para separar as responsabilidades da aplicação e tornar o gerenciamento das informações mais organizado.

Além das funcionalidades básicas de cadastro e consulta, o Kanban foi uma maneira de tornar o acompanhamento dos pedidos mais visual e prático, aproximando o sistema das necessidades do dia a dia de um restaurante.