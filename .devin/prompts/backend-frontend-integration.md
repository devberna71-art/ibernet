# Prompt: Integração Backend-Frontend para Produção

## Objetivo
Conectar o backend ao frontend garantindo que todas as rotas da API sejam consumidas corretamente pelo frontend e que a aplicação esteja pronta para produção.

## Contexto
- **Backend**: API RESTful construída com (verificar framework usado - Express, FastAPI, etc.)
- **Frontend**: Aplicação React localizada em `/frontend/src`
- **Configuração API**: Axios configurado em `/frontend/src/api/axiosConfig.js`
- **Rotas Frontend**: Definidas em `/frontend/src/routes/index.jsx`

## Tarefas Específicas

### 1. Análise Completa do Backend
- Identificar todas as rotas/endpoints disponíveis no backend
- Documentar métodos HTTP (GET, POST, PUT, DELETE, PATCH)
- Mapear parâmetros de rota, query params e body requests
- Identificar respostas esperadas e códigos de status
- Verificar autenticação/autorização necessária (tokens, roles)

### 2. Análise do Frontend Existente
- Revisar todas as chamadas de API existentes no frontend
- Identificar componentes que fazem requisições HTTP
- Verificar configuração do axios (baseURL, interceptors, headers)
- Mapear rotas do frontend que devem consumir endpoints do backend

### 3. Mapeamento e Integração
- Criar mapeamento completo: Endpoint Backend → Componente Frontend
- Garantir que TODOS os endpoints do backend tenham consumo no frontend
- Implementar chamadas de API faltantes nos componentes apropriados
- Padronizar estrutura das requisições (headers, error handling)
- Implementar loading states e tratamento de erros consistentes

### 4. Verificação de Rotas Específicas
Garantir integração correta para:
- **Autenticação**: Login, logout, refresh token
- **Membros**: CRUD completo, perfil, histórico, cartões
- **Cultos**: Agenda, registro, tipos de culto
- **Finanças**: Dízimos, ofertas, despesas, salários
- **Departamentos**: CRUD completo
- **Cargos**: CRUD completo
- **Igrejas**: CRUD completo (se aplicável)
- **Relatórios**: Todos os relatórios disponíveis
- **Notificações**: Sistema de notificações
- **Chat**: Funcionalidades de chat/mensagens

### 5. Configuração para Produção
- **Variáveis de Ambiente**: 
  - Verificar `.env` files (development e production)
  - Configurar `API_BASE_URL` para produção
  - Remover/endurecer configurações de debug
- **Segurança**:
  - Implementar HTTPS em produção
  - Configurar CORS corretamente
  - Validar autenticação em todas as rotas protegidas
  - Remover dados sensíveis do frontend
- **Performance**:
  - Implementar cache onde apropriado
  - Otimizar bundle size
  - Configurar lazy loading de componentes
- **Error Handling**:
  - Implementar tratamento global de erros
  - Logging de erros em produção
  - Mensagens de erro amigáveis para usuário

### 6. Testes e Validação
- Testar cada endpoint manualmente ou com testes automatizados
- Verificar fluxos completos (ex: cadastro → login → uso)
- Validar permissões por role (admin, moderador, usuário, super_admin)
- Testar cenários de erro (network timeout, 500, 401, 403, 404)
- Verificar consistência de dados entre frontend e backend

### 7. Documentação
- Atualizar/criar documentação de API
- Documentar novos endpoints integrados
- Criar guia de deploy para produção
- Documentar variáveis de ambiente necessárias

## Checklist de Produção

### Backend
- [ ] Todas as rotas estão documentadas
- [ ] CORS configurado corretamente para domínio de produção
- [ ] Rate limiting implementado
- [ ] Logging configurado
- [ ] Variáveis de ambiente seguras
- [ ] Database connections otimizadas
- [ ] HTTPS/TLS configurado
- [ ] Health check endpoint implementado

### Frontend
- [ ] API_BASE_URL aponta para produção
- [ ] Todas as chamadas de API usam axios configurado
- [ ] Error handling implementado globalmente
- [ ] Loading states em todas as operações assíncronas
- [ ] Tokens de autenticação gerenciados corretamente
- [ ] Refresh token implementado se necessário
- [ ] Build otimizado para produção
- [ ] Environment variables configuradas

### Integração
- [ ] Todos os endpoints do backend são consumidos
- [ ] Tipos de dados consistentes (frontend ↔ backend)
- [ ] Formatação de datas/horas consistente
- [ ] Tratamento de null/undefined consistente
- [ ] Validação de dados no frontend antes de enviar
- [ ] Paginação implementada onde necessário

## Deliverables Esperados

1. **Relatório de Integração**: Documento detalhando:
   - Lista completa de endpoints mapeados
   - Endpoints sem consumo no frontend (se houver)
   - Problemas encontrados e soluções aplicadas

2. **Código Atualizado**:
   - Frontend com todas as integrações implementadas
   - Configurações de produção
   - Error handling padronizado

3. **Scripts de Deploy**:
   - Scripts/configurações para deploy em produção
   - Instruções de setup de ambiente

4. **Documentação**:
   - API documentation atualizada
   - Guia de integração
   - Troubleshooting guide

## Notas Importantes
- **Não remover funcionalidades existentes** do frontend
- **Manter consistência** com o padrão de código atual
- **Testar exaustivamente** antes de considerar pronto para produção
- **Documentar mudanças** significativas
- **Considerar rollback plan** caso problemas ocorram em produção

## Comandos Úteis
```bash
# Verificar rotas do backend (ajustar conforme framework)
find backend -name "*.js" -o -name "*.py" | xargs grep -r "route\|endpoint\|@app\|router"

# Verificar chamadas de API no frontend
grep -r "api\." frontend/src --include="*.jsx" --include="*.js"

# Testar build de produção
cd frontend && npm run build

# Verificar variáveis de ambiente
cat frontend/.env.production
```

## Prioridades
1. **CRÍTICO**: Autenticação e autorização funcionando
2. **CRÍTICO**: Todos os endpoints principais sendo consumidos
3. **ALTA**: Error handling e loading states
4. **ALTA**: Configuração de produção
5. **MÉDIA**: Otimizações de performance
6. **BAIXA**: Documentação (mas necessária para produção)
