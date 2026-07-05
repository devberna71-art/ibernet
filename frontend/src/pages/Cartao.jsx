import React, { useEffect, useState } from 'react';
import { CreditCard, Search, Check, RotateCw, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../api/axiosConfig';
import AppPage from '../components/ui/AppPage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Cartao() {
  const [membros, setMembros] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [fundo, setFundo] = useState(null);
  const [logo, setLogo] = useState(null);
  const [horizontal, setHorizontal] = useState(false);
  const [linha1, setLinha1] = useState('');
  const [linha2, setLinha2] = useState('');
  const [linha3, setLinha3] = useState('');
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [toast, setToast] = useState(null);
  const itensPorPagina = 6;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    async function fetchMembros() {
      try {
        setLoading(true);
        const res = await api.get('/membros');
        setMembros(res.data || []);
      } catch (err) {
        console.log('Erro (possível 401):', err);
        showToast('Erro ao carregar membros.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchMembros();
  }, []);

  const toggleSelecionado = (id) => {
    setSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleUploadFundo = (e) => {
    const file = e.target.files[0];
    if (file) setFundo(URL.createObjectURL(file));
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const buscarDadosCartao = async () => {
    const res = await api.post('/dados-cartao', {
      membrosIds: selecionados
    });
    return res.data;
  };

  const membrosFiltrados = membros.filter(m =>
    m.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(membrosFiltrados.length / itensPorPagina);

  const membrosPaginados = membrosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const renderCartao = (m, isPdf = false) => {
    const isHorizontal = horizontal;
    const isPdfHorizontal = isPdf && isHorizontal;
    const totalLinhas = [linha1, linha2, linha3].filter(Boolean).length;
    const offsetTopo = 120 + (totalLinhas * 20);

    return `
      <div style="
        width:${isHorizontal ? '900px' : '420px'};
        height:${isHorizontal ? '360px' : '650px'};
        position:relative;
        font-family:'Inter',sans-serif;
        background-image:url(${fundo || ''});
        background-size:cover;
        background-position:center;
        border-radius:14px;
        overflow:hidden;
      ">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.15));"></div>
        <div style="text-align:center; padding-top:10px; position:relative; color:white;">
          ${logo ? `<img src="${logo}" style="width:55px; margin-bottom:6px;" />` : ''}
          <div style="font-size:${isPdfHorizontal ? '14px' : '13px'}; line-height:1.4; white-space:normal;">
            ${linha1 ? `<div style="font-weight:600;">${linha1}</div>` : ''}
            ${linha2 ? `<div>${linha2}</div>` : ''}
            ${linha3 ? `<div>${linha3}</div>` : ''}
          </div>
          <div style="margin-top:8px; text-align:center; white-space:nowrap; font-size:0;">
            <span style="display:inline-block; font-size:${isPdfHorizontal ? '22px' : (isHorizontal ? '30px' : '20px')}; font-weight:800; margin-right:12px; vertical-align:middle; letter-spacing:1px; color:#ffffff; text-shadow:0 2px 4px rgba(0,0,0,0.4);">CARTÃO DE MEMBRO</span>
            <span style="display:inline-block; font-size:${isPdfHorizontal ? '26px' : (isHorizontal ? '34px' : '24px')}; font-weight:900; vertical-align:middle; letter-spacing:1px; color:#ffffff; text-shadow:0 2px 4px rgba(0,0,0,0.4);">Nº ${m.numero_membro || '----'}</span>
          </div>
        </div>
        ${m.foto ? `<img src="${m.foto}" style="position:absolute; ${isHorizontal ? 'top:15px; right:15px;' : `left:50%; transform:translateX(-50%); top:${offsetTopo}px;`} width:${isHorizontal ? '150px' : '200px'}; height:${isHorizontal ? '150px' : '200px'}; object-fit:cover; border-radius:8px; border:4px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.3);"/>` : ''}
        <div style="position:absolute; ${isHorizontal ? 'bottom:18px; left:18px; width:65%;' : `left:50%; transform:translateX(-50%); top:${offsetTopo + 220}px; width:85%;`} padding:18px; border-radius:14px; background:rgba(0,0,0,0.50); color:#ffffff; text-align:left; box-shadow:0 4px 12px rgba(0,0,0,0.3); line-height:1.4; word-break:normal; white-space:normal;">
          <div style="font-size:${isPdfHorizontal ? '18px' : '24px'}; font-weight:900; line-height:1.3; letter-spacing:0px;">${m.nome || '---'}</div>
          <div style="margin-top:10px; font-size:${isPdfHorizontal ? '13px' : '15px'};"><span style="color:#e2e8f0;">Função:</span> <span style="font-weight:700;"> ${m.cargos || '---'}</span></div>
          <div style="font-size:${isPdfHorizontal ? '13px' : '15px'};"><span style="color:#e2e8f0;">Departamento:</span> <span style="font-weight:700;"> ${m.departamentos || '---'}</span></div>
          <div style="margin-top:8px; font-size:${isPdfHorizontal ? '13px' : '14px'};"><span style="color:#e2e8f0;">Batismo:</span> <span style="font-weight:600;"> ${m.data_batismo || '---'}</span></div>
          <div style="font-size:${isPdfHorizontal ? '13px' : '14px'};"><span style="color:#e2e8f0;">Validade:</span> <span style="font-weight:600;"> ${m.data_validade || '---'}</span></div>
        </div>
        <div style="position:absolute; ${isHorizontal ? 'top:180px; right:18px; width:150px; text-align:center;' : 'bottom:25px; width:100%; display:flex; flex-direction:column; align-items:center;'} color:white; font-size:13px;">
          <div style="margin-bottom:20px; letter-spacing:1px;">Assinatura do Pastor</div>
          <div style="border-top:2px solid rgba(255,255,255,0.9); width:${isHorizontal ? '100%' : '180px'};"></div>
        </div>
      </div>
    `;
  };

  const gerarCartoes = async () => {
    if (selecionados.length === 0) {
      showToast('Selecione pelo menos um membro.', 'error');
      return;
    }

    try {
      setGerando(true);
      const dados = await buscarDadosCartao();

      const CARD_W = 85.6;
      const CARD_H = 53.98;
      const cardWidth = horizontal ? CARD_W : CARD_H;
      const cardHeight = horizontal ? CARD_H : CARD_W;

      const pdf = new jsPDF({
        orientation: horizontal ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [cardWidth, cardHeight]
      });

      for (let i = 0; i < dados.length; i++) {
        const divFront = document.createElement('div');
        divFront.innerHTML = renderCartao(dados[i], true);
        divFront.style.width = horizontal ? '900px' : '420px';
        divFront.style.height = horizontal ? '360px' : '650px';
        divFront.style.position = 'fixed';
        divFront.style.top = '-9999px';
        document.body.appendChild(divFront);

        const canvasFront = await html2canvas(divFront, {
          scale: 4,
          useCORS: true,
          backgroundColor: null
        });

        const imgFront = canvasFront.toDataURL('image/png');
        document.body.removeChild(divFront);

        if (i > 0) {
          pdf.addPage([cardWidth, cardHeight]);
        }

        pdf.addImage(imgFront, 'PNG', 0, 0, cardWidth, cardHeight);
      }

      pdf.save('cartoes.pdf');
      showToast('Cartões gerados com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao gerar cartões.', 'error');
    } finally {
      setGerando(false);
    }
  };

  return (
    <AppPage subtitle="Geração de cartões de membros para impressão.">
      {toast && (
        <div className={`fixed top-4 right-4 z-[3000] px-4 py-3 rounded-md border shadow-float text-body font-medium transition-all ${
          toast.type === "error" ? "bg-danger/5 border-danger/20 text-danger" : "bg-successSoft border-success/20 text-success"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card padding="p-4">
          <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
            <CreditCard size={16} />
            Preview do Cartão
          </h3>

          <div className="bg-bgSection/50 rounded-lg p-4 mb-4 overflow-hidden">
            <div
              dangerouslySetInnerHTML={{
                __html: renderCartao(membros[0] || {})
              }}
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Linha 1</label>
              <input
                type="text"
                value={linha1}
                onChange={e => setLinha1(e.target.value)}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Linha 2</label>
              <input
                type="text"
                value={linha2}
                onChange={e => setLinha2(e.target.value)}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Linha 3</label>
              <input
                type="text"
                value={linha3}
                onChange={e => setLinha3(e.target.value)}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setHorizontal(!horizontal)}
            >
              <RotateCw size={13} className="w-4 h-4 shrink-0 mr-2" />
              {horizontal ? 'Vertical' : 'Horizontal'}
            </Button>

            <label className="cursor-pointer">
              <Button variant="secondary" size="sm" as="span">
                <ImageIcon size={13} className="w-4 h-4 shrink-0 mr-2" />
                Fundo
              </Button>
              <input hidden type="file" onChange={handleUploadFundo} />
            </label>

            <label className="cursor-pointer">
              <Button variant="secondary" size="sm" as="span">
                <ImageIcon size={13} className="w-4 h-4 shrink-0 mr-2" />
                Logo
              </Button>
              <input hidden type="file" onChange={handleUploadLogo} />
            </label>
          </div>
        </Card>

        {/* Seleção de Membros */}
        <Card padding="p-4">
          <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
            <Check size={16} />
            Selecionar Membros ({selecionados.length})
          </h3>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar membro..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              className="w-full pl-8 pr-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-textMuted">
              <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
              <span className="text-body">Carregando membros...</span>
            </div>
          ) : membrosPaginados.length === 0 ? (
            <div className="text-center py-12 text-textMuted text-body">
              Nenhum membro encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {membrosPaginados.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleSelecionado(m.id)}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    selecionados.includes(m.id)
                      ? 'border-primary bg-primarySoft shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {selecionados.includes(m.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={m.foto}
                      alt={m.nome}
                      className="w-16 h-16 rounded-full object-cover border-2 border-bgSection"
                    />
                    <p className="text-xs font-semibold text-text text-center line-clamp-2">{m.nome}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-textMuted">
                {pagina} / {totalPaginas}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
              >
                Próximo
              </Button>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={gerarCartoes}
            disabled={selecionados.length === 0 || gerando}
          >
            {gerando ? (
              <>
                <Loader2 size={15} className="w-4 h-4 shrink-0 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download size={15} className="w-4 h-4 shrink-0 mr-2" />
                GERAR CARTÕES ({selecionados.length})
              </>
            )}
          </Button>
        </Card>
      </div>
    </AppPage>
  );
}
