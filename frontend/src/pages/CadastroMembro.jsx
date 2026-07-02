import React, { useEffect, useState } from 'react';
import { Camera, Check, Info, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosConfig';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function MeuMembro() {
  const [formData, setFormData] = useState({
    nome: '',
    foto: null,
    genero: '',
    data_nascimento: '',
    estado_civil: '',
    bi: '',
    telefone: '',
    email: '',
    endereco_rua: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_provincia: '',
    batizado: false,
    data_batismo: '',
    ativo: true,
    CargosIds: [],
    DepartamentosIds: [],
    habilitacoes: '',
    especialidades: '',
    estudo_teologico: '',
    local_formacao: '',
    profissao: '',
    consagrado: false,
    data_consagracao: '',
    categoria_ministerial: '',
    trabalha: false,
    conta_outrem: false,
    conta_propria: false,
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);
  const [membroId, setMembroId] = useState(null);

  const habilitacoesOptions = [
    'Ensino Primário',
    'Ensino Secundário / Médio',
    'Técnico Profissional',
    'Licenciatura / Universitário',
    'Mestrado',
    'Doutorado',
    'Não sabe',
  ];

  const categoriaMinisterialOptions = [
    'Pastor',
    'Pastor Presidente',
    'Evangelista',
    'Diácono',
    'Diaconiza',
    'Presbítero',
    'Missionário',
    'Ancião',
    'Outro',
  ];

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await api.get('/cargos');
        setCargos(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDepartamentos = async () => {
      try {
        const res = await api.get('/departamentos');
        setDepartamentos(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCargos();
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const fetchMeuMembro = async () => {
      try {
        const res = await api.get('/meu-membro-detalhado');
        if (res.data.existe) {
          const { membro } = res.data;
          setMembroId(membro.id);
          const dadosAcademicos = membro.dadosAcademicos?.[0] || {};
          const dadosCristaos = membro.dadosCristaos?.[0] || {};
          const diversos = membro.diversos?.[0] || {};

          setFormData((prev) => ({
            ...prev,
            nome: membro.nome || '',
            genero: membro.genero || '',
            data_nascimento: membro.data_nascimento || '',
            estado_civil: membro.estado_civil || '',
            bi: membro.bi || '',
            telefone: membro.telefone || '',
            email: membro.email || '',
            endereco_rua: membro.endereco_rua || '',
            endereco_bairro: membro.endereco_bairro || '',
            endereco_cidade: membro.endereco_cidade || '',
            endereco_provincia: membro.endereco_provincia || '',
            ativo: membro.ativo ?? true,
            habilitacoes: dadosAcademicos.habilitacoes || '',
            especialidades: dadosAcademicos.especialidades || '',
            estudo_teologico: dadosAcademicos.estudo_teologico || '',
            local_formacao: dadosAcademicos.local_formacao || '',
            profissao: membro.profissao || '',
            batizado: membro.batizado || false,
            data_batismo: membro.data_batismo || '',
            consagrado: dadosCristaos.consagrado || false,
            data_consagracao: dadosCristaos.data_consagracao || '',
            categoria_ministerial: dadosCristaos.categoria_ministerial || '',
            trabalha: diversos.trabalha || false,
            conta_outrem: diversos.conta_outrem || false,
            conta_propria: diversos.conta_propria || false,
            CargosIds: membro.cargos?.map(c => c.id) || [],
            DepartamentosIds: membro.departamentos?.map(d => d.id) || [],
          }));

          if (membro.foto) setPreviewFoto(membro.foto);
        }
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar seus dados.' });
      }
    };
    fetchMeuMembro();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let finalValue;
    if (type === 'checkbox') finalValue = checked;
    else if (name === 'foto') {
      finalValue = files[0] || null;
      if (files[0]) setPreviewFoto(URL.createObjectURL(files[0]));
    } else finalValue = value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleMultiSelectToggle = (name, id) => {
    setFormData(prev => {
      const current = prev[name] || [];
      const updated = current.includes(id) 
        ? current.filter(x => x !== id) 
        : [...current, id];
      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'foto' && formData.foto) data.append('foto', formData.foto);
          else if (key === 'DepartamentosIds' || key === 'CargosIds')
            formData[key].forEach(id => data.append(`${key}[]`, id));
          else data.append(key, formData[key]);
        }
      });

      let res;
      if (membroId) {
        res = await api.put(`/membros/${membroId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await api.post('/membros2', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setMensagem({ tipo: 'success', texto: res.data.message || 'Dados salvos com sucesso!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setMensagem({ tipo: 'error', texto: err.response?.data?.message || 'Erro ao salvar dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {mensagem.texto && (
        <div className={`px-4 py-3 rounded-sm border text-body flex items-center gap-2 ${
          mensagem.tipo === 'error'
            ? 'bg-danger/5 border-danger/20 text-danger'
            : 'bg-successSoft border-success/20 text-success'
        }`}>
          {mensagem.tipo === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{mensagem.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto e Nome */}
        <Card padding="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={previewFoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                alt="Foto do Membro"
                className="w-24 h-24 rounded-full border border-border object-cover bg-bgSection"
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer border border-border hover:bg-primaryHover transition-colors">
                <Camera size={14} />
                <input type="file" name="foto" accept="image/*" hidden onChange={handleChange} />
              </label>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1">
                  Nome Completo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome completo do membro"
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Dados Pessoais */}
        <Card padding="p-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Gênero <span className="text-danger">*</span>
              </label>
              <select
                name="genero"
                required
                value={formData.genero}
                onChange={handleChange}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Estado Civil
              </label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viúvo">Viúvo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Nº do Bilhete de Identidade (BI)
              </label>
              <input
                type="text"
                name="bi"
                value={formData.bi}
                onChange={handleChange}
                placeholder="Nº do documento"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Telefone
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Ex: 923 000 000"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Rua / Morada
              </label>
              <input
                type="text"
                name="endereco_rua"
                value={formData.endereco_rua}
                onChange={handleChange}
                placeholder="Rua, Casa nº"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Bairro
              </label>
              <input
                type="text"
                name="endereco_bairro"
                value={formData.endereco_bairro}
                onChange={handleChange}
                placeholder="Nome do bairro"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                name="endereco_cidade"
                value={formData.endereco_cidade}
                onChange={handleChange}
                placeholder="Cidade"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Província
              </label>
              <input
                type="text"
                name="endereco_provincia"
                value={formData.endereco_provincia}
                onChange={handleChange}
                placeholder="Província"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="ativo" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Membro Ativo
              </label>
            </div>
          </div>
        </Card>

        {/* Dados Cristãos */}
        <Card padding="p-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
            Dados Cristãos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="batizado"
                name="batizado"
                checked={formData.batizado}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="batizado" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Batizado nas Águas
              </label>
            </div>

            {formData.batizado && (
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Data do Batismo
                </label>
                <input
                  type="date"
                  name="data_batismo"
                  value={formData.data_batismo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            )}

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="consagrado"
                name="consagrado"
                checked={formData.consagrado}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="consagrado" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Consagrado ao Ministério
              </label>
            </div>

            {formData.consagrado && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                    Data de Consagração
                  </label>
                  <input
                    type="date"
                    name="data_consagracao"
                    value={formData.data_consagracao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                    Categoria Ministerial
                  </label>
                  <select
                    name="categoria_ministerial"
                    value={formData.categoria_ministerial}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Selecione...</option>
                    {categoriaMinisterialOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Dados Acadêmicos e Profissionais */}
        <Card padding="p-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
            Dados Acadêmicos & Profissionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Habilitações Literárias
              </label>
              <select
                name="habilitacoes"
                value={formData.habilitacoes}
                onChange={handleChange}
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                {habilitacoesOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Área de Especialidade
              </label>
              <input
                type="text"
                name="especialidades"
                value={formData.especialidades}
                onChange={handleChange}
                placeholder="Ex: Contabilidade, Pedagogia..."
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Estudos Teológicos
              </label>
              <input
                type="text"
                name="estudo_teologico"
                value={formData.estudo_teologico}
                onChange={handleChange}
                placeholder="Ex: Médio em Teologia..."
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Local de Formação Teológica
              </label>
              <input
                type="text"
                name="local_formacao"
                value={formData.local_formacao}
                onChange={handleChange}
                placeholder="Ex: Instituto Bíblico..."
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                Profissão Atual
              </label>
              <input
                type="text"
                name="profissao"
                value={formData.profissao}
                onChange={handleChange}
                placeholder="Sua profissão"
                className="w-full px-3 py-2 text-body text-text bg-bg border border-border rounded-sm placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Cargos e Departamentos */}
        <Card padding="p-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
            Cargos & Departamentos
          </h3>
          
          <div className="space-y-4">
            {/* Selecionar Cargos */}
            <div>
              <span className="block text-xs font-semibold text-textSecondary mb-2">
                Selecione os Cargos associados
              </span>
              <div className="flex flex-wrap gap-2">
                {cargos.map((cargo) => {
                  const selected = formData.CargosIds.includes(cargo.id);
                  return (
                    <button
                      key={cargo.id}
                      type="button"
                      onClick={() => handleMultiSelectToggle('CargosIds', cargo.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1 ${
                        selected
                          ? 'bg-primarySoft border-primary text-primary'
                          : 'bg-bg border-border text-textSecondary hover:border-textMuted'
                      }`}
                    >
                      {selected && <Check size={12} />}
                      {cargo.nome}
                    </button>
                  );
                })}
                {cargos.length === 0 && (
                  <span className="text-xs text-textMuted italic">Carregando cargos...</span>
                )}
              </div>
            </div>

            {/* Selecionar Departamentos */}
            <div>
              <span className="block text-xs font-semibold text-textSecondary mb-2">
                Selecione os Departamentos associados
              </span>
              <div className="flex flex-wrap gap-2">
                {departamentos.map((depto) => {
                  const selected = formData.DepartamentosIds.includes(depto.id);
                  return (
                    <button
                      key={depto.id}
                      type="button"
                      onClick={() => handleMultiSelectToggle('DepartamentosIds', depto.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1 ${
                        selected
                          ? 'bg-primarySoft border-primary text-primary'
                          : 'bg-bg border-border text-textSecondary hover:border-textMuted'
                      }`}
                    >
                      {selected && <Check size={12} />}
                      {depto.nome}
                    </button>
                  );
                })}
                {departamentos.length === 0 && (
                  <span className="text-xs text-textMuted italic">Carregando departamentos...</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Diversos e Informações de Trabalho */}
        <Card padding="p-6">
          <h3 className="text-xs font-bold text-text uppercase tracking-wide border-b border-border pb-1.5 mb-4">
            Informações Laborais (Diversos)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="trabalha"
                name="trabalha"
                checked={formData.trabalha}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="trabalha" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Trabalha atualmente
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="conta_outrem"
                name="conta_outrem"
                checked={formData.conta_outrem}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="conta_outrem" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Trabalho por conta de outrem
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="conta_propria"
                name="conta_propria"
                checked={formData.conta_propria}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="conta_propria" className="text-xs font-semibold text-textSecondary cursor-pointer select-none">
                Trabalho por conta própria
              </label>
            </div>
          </div>
        </Card>

        {/* Botão de Enviar */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full justify-center py-3 text-sm font-bold"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin shrink-0" />
                Salvando Dados...
              </>
            ) : membroId ? (
              'Atualizar Dados do Membro'
            ) : (
              'Cadastrar Dados do Membro'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
