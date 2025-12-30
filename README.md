# Automação de Testes E2E – ParaBank

Este repositório contém a automação de testes End-to-End (E2E) do sistema **ParaBank**, desenvolvida com **Playwright** e **TypeScript**, como parte do **teste técnico de Qualidade de Software (QA)**.
O objetivo é validar os principais fluxos funcionais do sistema, garantindo qualidade, cobertura e rastreabilidade dos testes.

## Escopo dos Testes

Os testes automatizados cobrem principalmente:

- Autenticação
- Cadastro de usuários
- Visualização de contas
- Transferências entre contas

## Tecnologias e Ferramentas Utilizadas

- Playwright - ferramenta de automação de testes E2E
- TypeScript - linguagem utilizada nos testes
- Node.js - runtime para execução do projeto
- Faker.js - geração de dados dinâmicos para testes
- Git / GitHub - versionamento e controle do código
- Yarn - gerenciador de dependências

## Padrões e Boas Práticas

- Arquitetura baseada em **Page Object Model (POM)**  
- Separação clara entre:
  - Pages
  - Tests
  - Factories
  - Support
- Uso de **locators estáveis**
- Uso de **asserções explícitas**
- Testes independentes e reexecutáveis

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js (versão 18 ou superior)
- Yarn
- Git

## Instalação

Clone o repositório e instale as dependências:

```bash
yarn install
```

## Execução dos Testes

Para executar todos os testes automatizados, apenas um teste específico ou em modo debug, utilize os respectivos comandos:

```bash
yarn playwright test
yarn playwright test tests/login.spec.ts
yarn playwright test tests/login.spec.ts --debug
```

## Geração de Relatórios

Para gerar o relatório após execução dos testes, utilize o comando

```bash
yarn playwright show-report
```

### Observações sobre o sistema ParaBank

#### Navegação ('/')
- O uso de page.goto('/') depende da configuração de baseURL no playwright.config.ts.
- Dessa forma, '/' representa a URL base da aplicação, facilitando a manutenção caso o endereço mude.

### Observações sobre comportamentos do sistema

CT-005 - Zip Code inválido
- Durante os testes foi identificado que o campo *Zip Code* não possui validação de formato.
- O sistema valida apenas a obrigatoriedade do campo, aceitando qualquer valor informado.
- O teste automatizado registra o comportamento real do sistema, esperando a mensagem de campo obrigatório quando vazio.

CT-014 – Valor vazio
- Transferência sem valor:
  - Comportamento observado: o sistema exibe erro técnico genérico.
  - Observação: o campo **Amount** não possui validação funcional.

CT-015 – Valor inválido
- Transferência com valor inválido:
  - Comportamento observado: o sistema retorna erro ao tentar realizar a transferência com valor inválido.

## Decisões Técnicas

- Uso de TypeScript para maior legibilidade, tipagem e manutenção do código.
- Adoção do padrão Page Object Model para melhor organização e reutilização dos fluxos de teste.

## Suposições

- O ambiente do ParaBank está acessível durante a execução dos testes.
- Existem dados válidos disponíveis para execução dos cenários de autenticação e transferências.
- Todos os testes descritos neste documento foram executados com sucesso no momento da validação.
- Por se tratar de um ambiente de demonstração/testes, o comportamento do sistema pode sofrer alterações ao longo do tempo, o que pode impactar resultados e falhas em execuções futuras.
