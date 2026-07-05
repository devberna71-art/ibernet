import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Eye,
  Loader2,
  X,
  DollarSign,
} from 'lucide-react';
import dayjs from 'dayjs';
import api from '../../api/axiosConfig';
import ListaDespesasCategorias from '../../components/ListaDespesasCategorias';
import AppPage from '../../components/ui/AppPage';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

/** Modal genérico leve */
function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`relative bg-surface rounded-lg border border-border w-full ${maxWidth} max-h-[90vh] overflow-auto shadow-float`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-textMuted hover:text-text hover:bg-bgSection transition-colors"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function RelatorioDespesas() {
  const [periodo, setPeriodo] = useState('todos');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [total, setTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [dataInicial, setDataInicial] = useState(
    dayjs().startOf('month').format('YYYY-MM-DD')
  );
  const [dataFinal, setDataFinal] = useState(
    dayjs().format('YYYY-MM-DD')
  );

  const calcularPeriodo = (p) => {
    const agora = dayjs();
    let inicio;

    if (p === 'todos') return { start: undefined, end: undefined };

    if (p === 'personalizado') {
      return { start: dataInicial, end: dataFinal };
    }

    switch (p) {
      case 'hoje': inicio = agora.startOf('day'); break;
      case 'semana': inicio = agora.startOf('week'); break;
      case 'mes': inicio = agora.startOf('month'); break;
      case 'trimestre': inicio = agora.subtract(3, 'month'); break;
      case 'semestre': inicio = agora.subtract(6, 'month'); break;
      case 'ano': inicio = agora.startOf('year'); break;
      default: inicio = agora.startOf('month');
    }

    return {
      start: inicio.format('YYYY-MM-DD'),
      end: agora.format('YYYY-MM-DD'),
    };
  };

  const buscarRelatorio = async () => {
    setLoading(true);
    try {
      const { start, end } = calcularPeriodo(periodo);

      const params =
        periodo === 'todos'
          ? { tipo: tipo || undefined }
          : { startDate: start, endDate: end, tipo: tipo || undefined };

      const res = await api.get('/relatorio/despesas', { params });

      const data = res.data || [];

      const filtradas = data.filter(
        (c) => parseFloat(c.totalDespesas || 0) > 0
      );

      setCategorias(filtradas);

      const soma = filtradas.reduce(
        (acc, c) => acc + parseFloat(c.totalDespesas || 0),
        0
      );

      setTotal(soma);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarRelatorio();
  }, []);

  const temDados = useMemo(() => categorias.length > 0, [categorias]);

  const formatKz = (valor) => {
    return `${Number(valor || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
  };

  return (
    <AppPage subtitle="Relatório detalhado de despesas por categoria e período.">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-sm bg-dangerSoft flex items-center justify-center text-danger">
            <DollarSign size={18} />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-text">Relatório de Despesas</h2>
            <p className="text-muted text-textMuted mt-0.5">Análise financeira de saídas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card padding="p-4" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="todos">Todos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="trimestre">Trimestre</option>
              <option value="semestre">Semestre</option>
              <option value="ano">Ano</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          {periodo === 'personalizado' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Data Inicial</label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">Data Final</label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Todas</option>
              <option value="Fixa">Fixa</option>
              <option value="Variável">Variável</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              size="md"
              onClick={buscarRelatorio}
              className="w-full"
            >
              <Filter size={15} className="w-4 h-4 shrink-0 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Card>

      {/* Total Geral */}
      <div className="mb-6">
        <Card className="bg-danger text-white max-w-sm">
          <div className="text-[10px] font-semibold opacity-90 mb-1">TOTAL GERAL</div>
          <div className="text-2xl font-bold">{formatKz(total)}</div>
        </Card>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-textMuted">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
          <span className="text-body">Carregando relatório...</span>
        </div>
      ) : !temDados ? (
        <Card className="text-center py-12">
          <p className="text-body text-textMuted">Nenhuma despesa encontrada</p>
        </Card>
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-bgSection text-[10px] font-bold text-textMuted uppercase tracking-wide">
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Descrição</th>
                  <th className="px-5 py-3 text-center">Qtd</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body">
                {categorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-bgSection/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-text">{cat.nome}</td>
                    <td className="px-5 py-3 text-textMuted">{cat.descricao}</td>
                    <td className="px-5 py-3 text-center">{cat.quantidadeDespesas || 0}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge variant="danger">{formatKz(parseFloat(cat.totalDespesas || 0))}</Badge>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCategoriaSelecionada(cat);
                          setOpenModal(true);
                        }}
                      >
                        <Eye size={13} className="mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={categoriaSelecionada?.nome}
        maxWidth="max-w-2xl"
      >
        <ListaDespesasCategorias
          categoria={categoriaSelecionada}
          onClose={() => setOpenModal(false)}
        />
      </Modal>
    </AppPage>
  );
}
