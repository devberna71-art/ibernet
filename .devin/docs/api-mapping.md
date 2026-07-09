# Mapeamento de API Backend ↔ Frontend

## Endpoints do Backend Identificados

### Autenticação & Usuários
- ✅ `POST /login` - Usado em `/pages/login.jsx`
- ✅ `GET /usuario/me` - Usado em `/pages/Chat/MembersChat.jsx`
- ✅ `GET /usuario/status` - Usado em vários componentes
- ✅ `POST /usuarios` - Usado em `/pages/criarUsuario.jsx`
- ✅ `GET /usuarios` - Usado em vários componentes
- ❌ `GET /gestao-usuarios` - **NÃO implementado no frontend**
- ✅ `GET /meu-perfil` - Usado em `/pages/Perfil.jsx`
- ✅ `PUT /meu-perfil` - Usado em `/pages/Perfil.jsx`

### Membros
- ✅ `GET /membros` - Usado em vários componentes
- ✅ `GET /perfil-membros/:id` - Usado em `/pages/GestaoMembros.jsx` e `/pages/Cartao.jsx`
- ✅ `GET /membros/:id/historico` - Usado em `/pages/GestaoMembros.jsx` e `/pages/Cartao.jsx`
- ✅ `GET /completos-membros/:id` - Usado em `/pages/GestaoMembros.jsx`
- ✅ `GET /dashboard/top-contribuidores` - Implementado em `dashboardService.js`
- ✅ `GET /dashboard/novos-membros` - Implementado em `dashboardService.js`
- ❌ `POST /lista/membros` - **NÃO implementado no frontend**
- ❌ `GET /lista/filtros-membros` - **NÃO implementado no frontend**

### Cultos
- ✅ `GET /cultos` - Usado em `/pages/Cultos/ListaCultos.jsx` via `cultosService.js`
- ✅ `GET /cultos/:id/presencas` - Implementado em `cultosService.js`
- ✅ `POST /cultos/:id/presencas` - Implementado em `cultosService.js`
- ✅ `PUT /cultos/:id/status` - Implementado em `cultosService.js`
- ✅ `GET /lista/tipos-culto` - Usado em `/components/FormCultos.jsx`
- ✅ `POST /tipocultos` - Usado em `/components/FormTipoCulto.jsx`
- ✅ `PUT /tipocultos/:id` - Usado em `/components/FormTipoCulto.jsx`
- ✅ `DELETE /tipocultos/:id` - Usado em `/pages/Cultos/GestaoCulto.jsx`

### Chat
- ✅ `POST /conversas` - Usado em `/pages/Chat/MembersChat.jsx`
- ✅ `GET /conversa/:id` - Usado em `/pages/Chat/ChatPage.jsx`
- ✅ `POST /mensagens` - Usado em `/pages/Chat/ChatPage.jsx`
- ✅ `POST /conversas/ler` - Usado em `/pages/Chat/ChatPage.jsx`
- ✅ `POST /conversa/:id/marcar-lidas` - Usado em `/pages/Chat/ChatPage.jsx`

### Departamentos
- ✅ `GET /departamentos` - Usado em `/components/FormMembros.jsx`
- ✅ `GET /departamentos-membros` - Usado em `/pages/GestaoDepartamentos.jsx`
- ✅ `DELETE /departamentos/:id` - Usado em `/pages/GestaoDepartamentos.jsx`

### Cargos
- ✅ `GET /cargos` - Usado em `/components/FormMembros.jsx`
- ✅ `GET /lista/cargos` - Usado em `/pages/GestaoCargos.jsx`
- ✅ `DELETE /cargos/:id` - Usado em `/pages/GestaoCargos.jsx`

### Despesas
- ✅ `GET /lista/despesas` - Usado em `/services/despesasService.js`
- ✅ `POST /despesas` - Usado em `/services/despesasService.js` e `/components/FormDespesas.jsx`
- ✅ `GET /categorias/:id/despesas` - Usado em `/services/despesasService.js`
- ✅ `PUT /categorias/:id` - Usado em `/routes/DespesaController.js`
- ✅ `GET /categorias/despesas` - Usado em `/pages/GestaoDespesas.jsx`
- ✅ `DELETE /categorias/:id` - Usado em `/pages/GestaoDespesas.jsx`
- ✅ `POST /categorias` - Usado em `/routes/DespesaController.js`
- ✅ `GET /lista/tipos-despesa` - Implementado em `despesasService.js`
- ✅ `GET /relatorio/despesas` - Usado em `/services/despesasService.js` e `/pages/Relatrios/RelatorioDespesa.jsx`
- ✅ `PUT /despesas/:id` - Usado em `/services/despesasService.js` e `/components/FormDespesas.jsx`
- ✅ `DELETE /despesas/:id` - Usado em `/services/despesasService.js`
- ✅ `GET /despesas/totais` - Integrado em `/pages/GestaoDespesas.jsx`
- ✅ `POST /cadastro/despesas` - Integrado via `POST /despesas` em `/components/FormDespesas.jsx`

### Contribuições
- ✅ `GET /lista/tipos-contribuicao` - Usado em vários componentes
- ✅ `DELETE /tipos-contribuicao/:id` - Usado em `/pages/GestaoContribuicoes.jsx`
- ✅ `GET /contribuicoes` - Usado em `/pages/Relatrios/RelatorioContribuicoes.jsx`

### Funcionários & Salários
- ✅ `GET /lista-funcionarios` - Usado em `/components/ListaFuncionarios.jsx`
- ✅ `DELETE /funcionarios/:id` - Usado em `/components/ListaFuncionarios.jsx`
- ✅ `POST /funcionarios` - Usado em `/components/FormFuncionarios.jsx`
- ✅ `PUT /funcionarios/:id` - Usado em `/components/FormFuncionarios.jsx`
- ✅ `GET /salarios/lista` - Usado em `/components/ListaSalarios.jsx`
- ✅ `DELETE /salarios/:id` - Usado em `/components/ListaSalarios.jsx`
- ✅ `POST /salarios` - Usado em `/components/FormSalarios.jsx`
- ✅ `PUT /salarios/:id` - Usado em `/components/FormSalarios.jsx`
- ✅ `GET /subsidios` - Usado em vários componentes
- ✅ `DELETE /subsidios/:id` - Usado em `/components/ListaSubsidios.jsx`
- ✅ `POST /subsidios` - Usado em `/components/FormSubsidios.jsx`
- ✅ `PUT /subsidios/:id` - Usado em `/components/FormSubsidios.jsx`
- ✅ `GET /descontos` - Usado em vários componentes
- ✅ `DELETE /descontos/:id` - Usado em `/components/ListaDescontos.jsx`
- ✅ `POST /descontos` - Usado em `/components/FormDescontos.jsx`
- ✅ `PUT /descontos/:id` - Usado em `/components/FormDescontos.jsx`

### Relatórios
- ✅ `GET /presencas` - Usado em `/pages/Relatrios/ReltorioPresencas.jsx`
- ✅ `GET /relatorio/financeiro-geral` - Usado em `/pages/Relatrios/RelatorioFinanceiroGeral.jsx`

### Outros
- ✅ `GET /aniversarios` - Usado em `/pages/Notificacoes.jsx`
- ✅ `GET /contador` - Usado em `/components/Contador.jsx`

## Endpoints Faltantes no Frontend (Prioridade Alta)

1. **`GET /gestao-usuarios`** - Gestão avançada de usuários com métricas
2. **`POST /lista/membros`** - Busca avançada de membros
3. **`GET /lista/filtros-membros`** - Filtros disponíveis para relatórios

## Endpoints Faltantes (Prioridade Média)

1. **`GET /categorias/:id/despesas`** - Despesas por categoria
2. **`PUT /cultos/:id/status`** - Atualizar status de culto

## Configuração de Produção

### Variáveis de Ambiente Necessárias
- `API_BASE_URL` para produção (https://api.ibernet.online)
- `NODE_ENV=production` 

### CORS Configurado
Origens permitidas:
- https://ibernet.online
- http://localhost:3000
- https://www.ibernet.online
- https://api.ibernet.online

## Próximos Passos

1. Implementar endpoints faltantes de prioridade alta
2. Configurar variáveis de ambiente de produção
3. Implementar error handling global
4. Testar todas as integrações
5. Otimizar performance
