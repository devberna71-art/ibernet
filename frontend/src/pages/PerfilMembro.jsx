import React, { useEffect, useState } from 'react';
import { User, Phone, Calendar, Download, RefreshCw, AlertTriangle, FileSpreadsheet, Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axiosConfig';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function PerfilMembro() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/perfil/do/membro');
      setData(res.data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError(err.response?.data?.message || 'Erro ao carregar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarPerfil();
    setRefreshing(false);
  };

  const gerarDadosMeses = () => {
    const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, total: 0 }));
    if (data?.contribuicoes?.length) {
      data.contribuicoes.forEach((c) => {
        const m = new Date(c.data).getMonth();
        meses[m].total += Number(c.valor || 0);
      });
    }
    const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return meses.map(m => ({ name: labels[m.mes - 1], total: m.total }));
  };

  const exportCsv = () => {
    if (!data?.contribuicoes) return;
    const header = ['Data', 'Tipo', 'Valor'];
    const rows = data.contribuicoes.map(c => [
      new Date(c.data).toLocaleDateString(),
      c.TipoContribuicao?.nome || '—',
      c.valor
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contribuicoes_${data.perfil?.id || 'perfil'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] text-textMuted gap-2 bg-bg">
      <Loader2 className="animate-spin text-primary" size={20} />
      <span className="text-body">Carregando perfil...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto p-6 bg-surface border border-border rounded-sm mt-8 space-y-4">
      <div className="flex items-center gap-2 text-danger">
        <AlertTriangle size={18} />
        <span className="font-semibold text-body">Erro</span>
      </div>
      <p className="text-body text-textSecondary">{error}</p>
      <Button variant="primary" size="sm" onClick={carregarPerfil}>
        Tentar Novamente
      </Button>
    </div>
  );

  const mesesDados = gerarDadosMeses();
  const mesesLabels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  
  // Encontra o maior total para dimensionar as barras do gráfico CSS
  const maxTotal = Math.max(...mesesDados.map(d => d.total), 1);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Alertas */}
      {data?.alertas?.length > 0 && (
        <div className="space-y-2">
          {data.alertas.map((a, idx) => (
            <div
              key={idx}
              className="p-3 bg-warning/5 border border-warning/20 text-warning rounded-sm text-xs font-medium flex items-center gap-2"
            >
              <AlertTriangle size={14} />
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* Card Perfil principal */}
      <Card padding="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={data?.perfil?.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
            alt="Foto do Membro"
            className="w-20 h-20 rounded-full border border-border object-cover bg-bgSection shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h2 className="text-lg font-bold text-text">{data.perfil.nome}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-textMuted mt-1">
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {data.perfil.telefone || '—'}
                </span>
                <span>•</span>
                <span>Gênero: {data.perfil.genero || '—'}</span>
                <span>•</span>
                <span>Estado Civil: {data.perfil.estado_civil || '—'}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw size={13} />
                    Atualizar
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportCsv}
              >
                <FileSpreadsheet size={13} />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Métricas e Indicadores */}
        <div className="md:col-span-4 space-y-6">
          {/* Desempenho Anual */}
          <Card padding="p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
              Desempenho (Ano)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-textMuted">Total no Ano</span>
                <span className="font-bold text-text">
                  Kz {Number(data.desempenho.totalAno || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-textMuted">Nº de Contribuições</span>
                <span className="font-bold text-text">
                  {data.desempenho.totalContribuicoes || 0}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-textMuted">Maior Contribuição</span>
                <span className="font-bold text-text">
                  Kz {Number(data.desempenho.maiorContribuicao || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-textMuted">Média Mensal</span>
                <span className="font-bold text-text">
                  Kz {Number(data.desempenho.mediaMensal || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wide mt-6 mb-3">
              Indicadores de Frequência
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-textMuted">Tipo Frequente</span>
                <span className="font-bold text-text">{data.indicadores.tipoMaisFrequente || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-textMuted">Mês Mais Generoso</span>
                <span className="font-bold text-text">{data.indicadores.mesMaisGeneroso || '—'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-textMuted">Total de Contribuições</span>
                <span className="font-bold text-text">{data.indicadores.quantidadeAno || 0}</span>
              </div>
            </div>
          </Card>

          {/* Meses Sem Contribuição */}
          <Card padding="p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-3">
              Meses Sem Contribuição
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.mesesNaoContribuiu?.length ? (
                data.mesesNaoContribuiu.map(m => (
                  <Badge key={m} variant="danger">
                    {mesesLabels[m-1]}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-textMuted">Nenhum mês sem contribuição cadastrado.</span>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Gráfico e Histórico */}
        <div className="md:col-span-8 space-y-6">
          {/* Gráfico Mensal */}
          <Card padding="p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
              Gráfico de Contribuição Mensal
            </h3>
            
            {/* Gráfico de Barras em Tailwind CSS */}
            <div className="h-64 flex items-end justify-between gap-1 pt-6 px-2">
              {mesesDados.map((item, idx) => {
                // Altura percentual baseada no maior valor
                const heightPercent = (item.total / maxTotal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                    {/* Tooltip Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-16 bg-text text-bg text-[10px] px-2 py-1 rounded-sm shadow-md pointer-events-none whitespace-nowrap z-10">
                      Kz {Number(item.total).toLocaleString()}
                    </div>
                    {/* Barra */}
                    <div
                      style={{ height: `${Math.max(heightPercent, 2)}%` }}
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                        item.total > 0 ? 'bg-primary hover:bg-primaryHover' : 'bg-border'
                      }`}
                    />
                    {/* Rótulo */}
                    <span className="text-[10px] text-textMuted font-medium mt-2 select-none">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Lista de Contribuições */}
          <Card padding="p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
              Histórico de Contribuições
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-textMuted font-semibold">
                    <th className="pb-2 font-semibold">Data</th>
                    <th className="pb-2 font-semibold">Tipo</th>
                    <th className="pb-2 font-semibold text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.contribuicoes?.length ? (
                    data.contribuicoes.map(c => (
                      <tr key={c.id} className="hover:bg-bgSection/40 transition-colors">
                        <td className="py-2.5 text-textSecondary">
                          {new Date(c.data).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 font-medium text-text">
                          {c.TipoContribuicao?.nome || '—'}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-text">
                          Kz {Number(c.valor || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-textMuted">
                        Nenhuma contribuição registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
