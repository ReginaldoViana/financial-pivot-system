# 📊 Financial Pivot System

Sistema completo de análise financeira com tabela dinâmica (Pivot Table), gráficos interativos e exportação de dados em múltiplos formatos.

![Angular](https://img.shields.io/badge/Angular-20.2-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Material Design](https://img.shields.io/badge/Material_Design-20.2-blue?style=flat-square&logo=material-design)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 🎯 Sobre o Projeto

O **Financial Pivot System** é uma aplicação web moderna e robusta para análise de dados financeiros, desenvolvida com as mais recentes tecnologias Angular. O sistema permite análise visual e hierárquica de contas a pagar e receber, com recursos avançados de visualização, cálculo e exportação.

### ✨ Funcionalidades Principais

#### 📋 Tabela Dinâmica (Pivot Table)
- ✅ **Agrupamento Multi-nível**: Agrupe dados por múltiplas dimensões (Data, Cliente, Tipo, etc.)
- ✅ **Drill-Down Hierárquico**: Expanda e colapso níveis de hierarquia interativamente
- ✅ **Agregações Automáticas**: Cálculo automático de totais, médias, contagens
- ✅ **Ordenação Dinâmica**: Ordene colunas e linhas facilmente
- ✅ **Totalizadores**: Grand totals e subtotais automáticos

#### 📈 Visualização de Dados
- ✅ **8 Tipos de Gráficos**: Barra, Linha, Pizza, Área, Radar, Polar, Doughnut, Scatter
- ✅ **Gráficos Interativos**: Tooltips, zoom, pan e legendas interativas
- ✅ **Sincronização Automática**: Gráficos atualizados em tempo real com filtros
- ✅ **Multi-séries**: Suporte para visualização de múltiplas métricas

#### 🧮 Campos Calculados
- ✅ **Fórmulas Customizadas**: Crie cálculos personalizados usando fórmulas
- ✅ **Funções Agregadoras**: SUM, AVG, COUNT, MIN, MAX
- ✅ **Operações Matemáticas**: +, -, *, /, %, ^
- ✅ **Funções Especiais**: ABS, ROUND, IF, etc.
- ✅ **Referências a Campos**: Use campos existentes em suas fórmulas

#### 📤 Exportação de Dados
- ✅ **Excel (.xlsx)**: Exportação formatada com estilos e fórmulas
- ✅ **PDF**: Relatórios profissionais com layout customizado
- ✅ **CSV**: Formato compatível com qualquer planilha
- ✅ **HTML**: Relatórios interativos para web

#### 🎨 Interface Moderna
- ✅ **Material Design**: Interface limpa, moderna e intuitiva
- ✅ **Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **Tema Customizável**: Fácil personalização de cores e estilos
- ✅ **Modo Fullscreen**: Visualização em tela cheia

#### 🔍 Filtros e Pesquisa
- ✅ **Filtros Avançados**: Filtre por data, cliente, tipo, valores
- ✅ **Filtros Múltiplos**: Combine múltiplos critérios de filtro
- ✅ **Pesquisa Rápida**: Busca em tempo real nos dados
- ✅ **Salvamento de Filtros**: Salve combinações de filtros frequentes

## 🛠️ Tecnologias Utilizadas

### Core
- **[Angular 20.2](https://angular.io/)** - Framework principal
- **[TypeScript 5.0+](https://www.typescriptlang.org/)** - Linguagem de programação
- **[RxJS 7.8](https://rxjs.dev/)** - Programação reativa

### UI/UX
- **[Angular Material 20.2](https://material.angular.io/)** - Componentes UI
- **[Angular CDK](https://material.angular.io/cdk)** - Component Dev Kit
- **[SCSS](https://sass-lang.com/)** - Estilização avançada

### Visualização de Dados
- **[Chart.js 4.5](https://www.chartjs.org/)** - Biblioteca de gráficos
- **[ng2-charts 8.0](https://valor-software.com/ng2-charts/)** - Wrapper Angular para Chart.js

### Exportação
- **[ExcelJS 4.4](https://github.com/exceljs/exceljs)** - Geração de arquivos Excel
- **[jsPDF 4.1](https://github.com/parallax/jsPDF)** - Geração de PDFs
- **[html2canvas 1.4](https://html2canvas.hertzen.com/)** - Captura de tela para PDF
- **[PapaParse 5.5](https://www.papaparse.com/)** - Parser CSV
- **[FileSaver 2.0](https://github.com/eligrey/FileSaver.js)** - Download de arquivos

### Utilitários
- **[date-fns 4.1](https://date-fns.org/)** - Manipulação de datas
- **[lodash-es 4.17](https://lodash.com/)** - Utilitários JavaScript

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior
- **Angular CLI** 20.0.0 ou superior

### Verificar Instalações

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Instalar Angular CLI globalmente (se necessário)
npm install -g @angular/cli@latest

# Verificar Angular CLI
ng version
```

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd financial-pivot-system
```

### 2️⃣ Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install
```

Este comando instalará automaticamente:
- Angular e seus módulos
- Angular Material
- Chart.js e ng2-charts
- Bibliotecas de exportação (ExcelJS, jsPDF, etc.)
- Todas as demais dependências listadas no package.json

### 3️⃣ Configuração (Opcional)

O projeto já vem pré-configurado, mas você pode customizar:

#### Temas do Angular Material

Edite `src/styles.scss` para mudar o tema:

```scss
@use '@angular/material' as mat;
@include mat.core();

// Defina suas cores primárias e de destaque
$primary-palette: mat.define-palette(mat.$indigo-palette);
$accent-palette: mat.define-palette(mat.$pink-palette);
```

#### Configurações do Projeto

Edite `angular.json` para ajustar configurações de build, assets, etc.

## 💻 Executando o Projeto

### Servidor de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# Ou usando Angular CLI
ng serve
```

Abra seu navegador e navegue até `http://localhost:4200/`. A aplicação será recarregada automaticamente quando você modificar qualquer arquivo fonte.

### Servidor com Porta Customizada

```bash
# Executar em porta específica
ng serve --port 4300

# Executar e abrir navegador automaticamente
ng serve --open

# Executar com host específico
ng serve --host 0.0.0.0
```

## 🏗️ Build para Produção

### Build de Produção

```bash
# Build otimizado para produção
npm run build

# Ou
ng build --configuration production
```

Os arquivos gerados estarão na pasta `dist/`. O build de produção inclui:
- ✅ Minificação de código
- ✅ Tree-shaking
- ✅ Otimização de bundles
- ✅ Compilação AOT (Ahead-of-Time)

### Build com Watch Mode

```bash
# Build que recompila ao detectar mudanças
npm run watch

# Ou
ng build --watch --configuration development
```

## 📁 Estrutura do Projeto

```
financial-pivot-system/
├── src/
│   ├── app/
│   │   ├── core/                          # Módulos core da aplicação
│   │   │   ├── models/                    # Modelos de dados
│   │   │   │   ├── field.model.ts         # Modelo de campos e campos calculados
│   │   │   │   ├── financial-data.model.ts # Modelo de dados financeiros
│   │   │   │   └── pivot-config.model.ts  # Configurações da pivot table
│   │   │   └── services/                  # Serviços principais
│   │   │       ├── calculation.service.ts  # Serviço de cálculos e fórmulas
│   │   │       ├── export.service.ts       # Serviço de exportação
│   │   │       └── pivot-data.service.ts   # Serviço de dados da pivot table
│   │   │
│   │   ├── features/                      # Funcionalidades principais
│   │   │   └── financial/                 # Módulo financeiro
│   │   │       ├── calculated-field-modal/ # Modal de campos calculados
│   │   │       ├── chart-viewer/          # Visualizador de gráficos
│   │   │       ├── field-list-modal/      # Modal de lista de campos
│   │   │       ├── pivot-table/           # Componente principal da pivot table
│   │   │       └── toolbar/               # Barra de ferramentas
│   │   │
│   │   ├── shared/                        # Componentes compartilhados
│   │   ├── app.config.ts                  # Configuração da aplicação
│   │   ├── app.routes.ts                  # Rotas da aplicação
│   │   └── app.ts                         # Componente principal
│   │
│   ├── index.html                         # HTML principal
│   ├── main.ts                            # Bootstrap da aplicação
│   └── styles.scss                        # Estilos globais
│
├── public/                                # Assets públicos
├── angular.json                           # Configuração do Angular
├── package.json                           # Dependências e scripts
├── tsconfig.json                          # Configuração TypeScript
└── README.md                              # Este arquivo
```

## 🎮 Como Usar

### 1. Carregar Dados

O sistema pode trabalhar com dados de diferentes fontes:
- Dados mockados (padrão)
- Importação de arquivos CSV/Excel
- Integração com API backend

### 2. Configurar Pivot Table

1. **Selecione Campos**: Clique no botão de campos para abrir o seletor
2. **Arraste para Linhas**: Arraste dimensões (Data, Cliente, etc.) para a área de linhas
3. **Arraste para Valores**: Arraste métricas (Valor, A Pagar/Receber, etc.) para valores
4. **Configure Filtros**: Use os filtros na toolbar para refinar os dados

### 3. Criar Campos Calculados

1. Clique no botão **"+ Campo Calculado"**
2. Defina um nome para o campo
3. Digite a fórmula usando:
   - Campos existentes: `[Nome do Campo]`
   - Funções: `SUM()`, `AVG()`, `COUNT()`, etc.
   - Operadores: `+`, `-`, `*`, `/`, `^`, `%`
4. Salve e o campo aparecerá na lista

**Exemplos de Fórmulas:**
```javascript
// Margem percentual
([aPagarReceber] - [valorConta]) / [valorConta] * 100

// Total com juros
[valorConta] * (1 + [jurosPercentual] / 100)

// Média de valores
AVG([valorConta])

// Lucro líquido
SUM([aPagarReceber]) - SUM([valorConta])
```

### 4. Visualizar Gráficos

1. Clique no menu **"Gráficos"** na toolbar
2. Selecione o tipo de gráfico desejado:
   - **Barra**: Comparação entre categorias
   - **Linha**: Tendências ao longo do tempo
   - **Pizza**: Proporções do total
   - **Área**: Acumulação ao longo do tempo
   - **Radar**: Comparação multi-dimensional
   - E mais...

### 5. Exportar Dados

1. Clique no menu **"Exportar"** na toolbar
2. Escolha o formato desejado:
   - **Excel**: Planilha formatada com fórmulas
   - **PDF**: Relatório profissional
   - **CSV**: Dados tabulares simples
   - **HTML**: Página web interativa

## 🧪 Testes

### Testes Unitários

```bash
# Executar testes unitários
npm test

# Ou
ng test

# Executar testes com cobertura
ng test --code-coverage
```

Os testes são executados via [Karma](https://karma-runner.github.io) e gerará um relatório de cobertura na pasta `coverage/`.

### Testes End-to-End

```bash
# Executar testes e2e
ng e2e
```

**Nota**: Angular CLI não vem com um framework de testes e2e por padrão. Você pode escolher um que atenda suas necessidades (Cypress, Playwright, Protractor, etc.).

## 🔧 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start` | `npm start` | Inicia servidor de desenvolvimento |
| `build` | `npm run build` | Build de produção |
| `watch` | `npm run watch` | Build com watch mode |
| `test` | `npm test` | Executa testes unitários |

## 🎨 Customização

### Adicionar Novos Tipos de Gráficos

Edite `chart-viewer.ts` e adicione novos tipos no método de configuração de gráficos.

### Criar Novos Campos Calculados

Use o `CalculationService` para adicionar novas funções personalizadas.

### Adicionar Novos Formatos de Exportação

Estenda o `ExportService` com novos métodos de exportação.

### Modificar Tema Visual

Edite `src/styles.scss` e os arquivos `.scss` dos componentes individuais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Integração com backend RESTful
- [ ] Autenticação e autorização
- [ ] Salvamento de configurações personalizadas
- [ ] Compartilhamento de relatórios
- [ ] Temas dark/light mode
- [ ] PWA (Progressive Web App)
- [ ] Mais tipos de gráficos
- [ ] Exportação para Google Sheets
- [ ] Dashboards personalizáveis

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Angular

## 📞 Suporte

Para dúvidas e suporte:
- Abra uma [Issue](../../issues)
- Consulte a [Documentação do Angular](https://angular.dev)
- Consulte o [GUIA-PIVOT-TABLE-ANGULAR.md](../GUIA-PIVOT-TABLE-ANGULAR.md) para guia completo de implementação

## 🙏 Agradecimentos

- [Angular Team](https://angular.io/team) pela incrível framework
- [Material Design Team](https://material.io) pelos componentes UI
- [Chart.js Team](https://www.chartjs.org/) pela biblioteca de gráficos
- Comunidade open-source por todas as bibliotecas utilizadas

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
