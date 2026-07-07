// src/components/FormMembros.jsx
import React, { useEffect, useState } from 'react';
import { Loader2, User, BookOpen, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import api from '../api/axiosConfig';
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function FormMembros({ onSuccess, membroData, onCancel }) {
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
    MembroIdUsuario: '',
  });

  const [previewFoto, setPreviewFoto] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/usuarios');
        setUsuarios(res.data.usuarios || []);
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar usuários.' });
      }
    };
    fetchUsuarios();
  }, []);

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
    if (membroData) {
      const { dadosAcademicos, dadosCristaos, diversos, cargos, departamentos } = membroData;

      setFormData((prev) => ({
        ...prev,
        nome: membroData.nome || '',
        genero: membroData.genero || '',
        data_nascimento: membroData.data_nascimento || '',
        estado_civil: membroData.estado_civil || '',
        bi: membroData.bi || '',
        telefone: membroData.telefone || '',
        email: membroData.email || '',
        endereco_rua: membroData.endereco_rua || '',
        endereco_bairro: membroData.endereco_bairro || '',
        endereco_cidade: membroData.endereco_cidade || '',
        endereco_provincia: membroData.endereco_provincia || '',
        ativo: membroData.ativo ?? true,

        habilitacoes: dadosAcademicos?.habilitacoes || '',
        especialidades: dadosAcademicos?.especialidades || '',
        estudo_teologico: dadosAcademicos?.estudo_teologico || '',
        local_formacao: dadosAcademicos?.local_formacao || '',
        profissao: membroData?.profissao || '',

        batizado: membroData?.batizado || false,
        data_batismo: membroData?.data_batismo || '',
        consagrado: dadosCristaos?.consagrado || false,
        data_consagracao: dadosCristaos?.data_consagracao || '',
        categoria_ministerial: dadosCristaos?.categoria_ministerial || '',

        trabalha: diversos?.trabalha || false,
        conta_outrem: diversos?.conta_outrem || false,
        conta_propria: diversos?.conta_propria || false,

        CargosIds: cargos?.map((c) => c.id) || [],
        DepartamentosIds: departamentos?.map((d) => d.id) || [],
      }));

      if (membroData.foto) setPreviewFoto(membroData.foto);
    }
  }, [membroData]);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const res = await api.get('/cargos');
        setCargos(res.data);
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar os cargos.' });
      }
    };

    const fetchDepartamentos = async () => {
      try {
        const res = await api.get('/departamentos');
        setDepartamentos(res.data);
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: 'error', texto: 'Erro ao carregar os departamentos.' });
      }
    };

    fetchCargos();
    fetchDepartamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (name === 'foto') {
      finalValue = files[0] || null;
      if (files[0]) setPreviewFoto(URL.createObjectURL(files[0]));
    } else if (name === 'CargosIds' || name === 'DepartamentosIds') {
      finalValue = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.genero) {
      setMensagem({ tipo: 'error', texto: 'Preencha os campos obrigatórios: nome e gênero.' });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'foto' && formData.foto) data.append('foto', formData.foto);
          else if (key === 'DepartamentosIds' || key === 'CargosIds')
            formData[key].forEach((id) => data.append(`${key}[]`, id));
          else data.append(key, formData[key]);
        }
      });

      let res;

      if (membroData?.id) {
        res = await api.put(`/membros/${membroData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/membros', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setMensagem({
        tipo: 'success',
        texto: res.data.message || (membroData ? 'Membro atualizado com sucesso!' : 'Membro cadastrado com sucesso!'),
      });

      if (onSuccess) {
        onSuccess(res.data?.credenciais);
      }

      if (!membroData) {
        setFormData({
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
          MembroIdUsuario: '',
        });
        setPreviewFoto(null);
      }

    } catch (err) {
      console.error(err);
      setMensagem({ tipo: 'error', texto: err.response?.data?.message || 'Erro ao salvar membro.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

        {/* Banner de Mensagem */}
        {mensagem.texto && (
          <div
            className={`rounded-lg px-4 py-2.5 font-semibold text-xs border ${mensagem.tipo === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Secção 1: Dados Pessoais */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dados Pessoais</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-slate-400">Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-slate-400">Usuário do Sistema Vinculado</label>
              <select
                name="MembroIdUsuario"
                value={formData.MembroIdUsuario || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Nenhum usuário correspondente</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome} ({usuario.funcao})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2 flex items-center gap-4 py-1">
              {previewFoto && (
                <img
                  src={previewFoto}
                  alt="Perfil"
                  className="h-14 w-14 rounded-full border border-slate-200 object-cover shrink-0"
                />
              )}
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                {formData.foto || previewFoto ? 'Substituir Foto' : 'Carregar Imagem'}
                <input type="file" name="foto" accept="image/*" hidden onChange={handleChange} />
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Gênero *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Data de Nascimento</label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Estado Civil</label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viúvo">Viúvo</option>
              </select>
            </div>

            {['bi', 'telefone', 'email', 'endereco_rua', 'endereco_bairro', 'endereco_cidade', 'endereco_provincia'].map((campo) => (
              <div key={campo} className="space-y-1">
                <label className="text-xs font-medium text-slate-400 capitalize">
                  {campo.replace('_', ' ')}
                </label>
                <input
                  type={campo === 'email' ? 'email' : 'text'}
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            ))}

            <div className="sm:col-span-2 flex items-center pt-2">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <label htmlFor="ativo" className="ml-2 text-xs font-semibold text-slate-700 cursor-pointer">
                Membro com Cadastro Ativo
              </label>
            </div>
          </div>
        </Card>

        {/* Secção 2: Estrutura Eclesiástica */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Estrutura Eclesiástica</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Cargos Designados</label>
              <select
                name="CargosIds"
                value={formData.CargosIds}
                onChange={handleChange}
                multiple
                className="w-full h-28 px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {cargos.map(cargo => (
                  <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 font-medium">Segure Ctrl/Cmd para múltipla escolha</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Departamentos Integrados</label>
              <select
                name="DepartamentosIds"
                value={formData.DepartamentosIds}
                onChange={handleChange}
                multiple
                className="w-full h-28 px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.nome}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 font-medium">Segure Ctrl/Cmd para múltipla escolha</p>
            </div>
          </div>
        </Card>

        {/* Secção 3: Histórico Litúrgico */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Histórico Litúrgico</h3>
          </div>

          <div className="space-y-4">
            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center sm:col-span-2">
                <input
                  type="checkbox"
                  id="batizado"
                  name="batizado"
                  checked={formData.batizado}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <label htmlFor="batizado" className="ml-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  É Batizado nas Águas
                </label>
              </div>
              {formData.batizado && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-400">Data do Batismo</label>
                  <input
                    type="date"
                    name="data_batismo"
                    value={formData.data_batismo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>

            <div className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center sm:col-span-2">
                <input
                  type="checkbox"
                  id="consagrado"
                  name="consagrado"
                  checked={formData.consagrado}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <label htmlFor="consagrado" className="ml-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  Membro Consagrado
                </label>
              </div>

              {formData.consagrado && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Categoria Ministerial</label>
                    <select
                      name="categoria_ministerial"
                      value={formData.categoria_ministerial}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecione...</option>
                      {categoriaMinisterialOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Data de Consagração</label>
                    <input
                      type="date"
                      name="data_consagracao"
                      value={formData.data_consagracao}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Secção 4: Perfil Académico e Profissional */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Perfil Académico & Profissional</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Nível de Habilitações</label>
              <select
                name="habilitacoes"
                value={formData.habilitacoes}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Selecione...</option>
                {habilitacoesOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {['especialidades', 'estudo_teologico', 'local_formacao', 'profissao'].map(campo => (
              <div key={campo} className="space-y-1">
                <label className="text-xs font-medium text-slate-400 capitalize">
                  {campo.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Secção 5: Informações Diversas */}
        <Card padding="p-5" className="border border-slate-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dados Sociais & Diversos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {['trabalha', 'conta_outrem', 'conta_propria'].map(campo => (
              <div key={campo} className="flex items-center p-2 border border-slate-100 rounded-lg bg-slate-50/40">
                <input
                  type="checkbox"
                  id={campo}
                  name={campo}
                  checked={formData[campo]}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <label htmlFor={campo} className="ml-2 text-xs font-semibold text-slate-700 cursor-pointer capitalize">
                  {campo.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Ações do Formulário */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin shrink-0" />
                Processando Lançamento...
              </span>
            ) : (
              membroData ? 'Atualizar Membro' : 'Cadastrar Novo Membro'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}