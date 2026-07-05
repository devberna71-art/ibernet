import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

export default function FormMembros({ onSuccess, membroData }) {
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

  // Carregar usuários para o dropdown
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

  // Carregar dados do membro (edição)
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

  // Carregar cargos e departamentos
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
        console.log(`📝 [FRONT] Enviando requisição PUT para atualizar membro ID: ${membroData.id}`);
        res = await api.put(`/membros/${membroData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        console.log("🆕 [FRONT] Enviando requisição POST para cadastrar novo membro");
        res = await api.post('/membros', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setMensagem({
        tipo: 'success',
        texto: res.data.message || (
          membroData
            ? 'Membro atualizado com sucesso!'
            : 'Membro cadastrado com sucesso!'
        ),
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
      console.error("❌ Erro ao salvar dados do membro:", err);
      setMensagem({ tipo: 'error', texto: err.response?.data?.message || 'Erro ao salvar membro.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="mx-auto max-w-2xl text-text">
      {mensagem.texto && (
        <div
          className={`mb-2 rounded-sm px-4 py-3 font-semibold ${
            mensagem.tipo === 'success'
              ? 'bg-successSoft text-success'
              : 'bg-dangerSoft text-danger'
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Dados Pessoais */}
      <h3 className="mt-2 mb-1 text-lg font-semibold text-text">Dados Pessoais</h3>
      <hr className="mb-2 border-border" />

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Nome *</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Usuário Vinculado</label>
        <select
          name="MembroIdUsuario"
          value={formData.MembroIdUsuario || ''}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          <option value="">Nenhum</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome} ({usuario.funcao})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex items-center">
        <label className="mr-2 cursor-pointer rounded-sm bg-primary px-4 py-2 text-white transition hover:bg-primaryHover">
          {formData.foto || previewFoto ? 'Alterar Foto' : 'Selecionar Foto'}
          <input type="file" name="foto" accept="image/*" hidden onChange={handleChange} />
        </label>
        {previewFoto && (
          <img
            src={previewFoto}
            alt="Preview da foto"
            className="h-20 w-20 rounded-full border-2 border-border object-cover"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Gênero *</label>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          <option value="">Selecione</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Data de Nascimento</label>
        <input
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Estado Civil</label>
        <select
          name="estado_civil"
          value={formData.estado_civil}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          <option value="">Selecione</option>
          <option value="Solteiro">Solteiro</option>
          <option value="Casado">Casado</option>
          <option value="Divorciado">Divorciado</option>
          <option value="Viúvo">Viúvo</option>
        </select>
      </div>

      {['bi', 'telefone', 'email', 'endereco_rua', 'endereco_bairro', 'endereco_cidade', 'endereco_provincia'].map((campo) => (
        <div key={campo} className="mb-4">
          <label className="mb-1 block text-sm font-medium text-text">
            {campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
          </label>
          <input
            type={campo === 'email' ? 'email' : 'text'}
            name={campo}
            value={formData[campo]}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
          />
        </div>
      ))}

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="ativo"
          checked={formData.ativo}
          onChange={handleChange}
          className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#263238] text-text focus:ring-[#b3e5fc]"
        />
        <label className="text-text">Ativo</label>
      </div>

      {/* Cargos */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Cargos</label>
        <select
          name="CargosIds"
          value={formData.CargosIds}
          onChange={handleChange}
          multiple
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          {cargos.map(cargo => (
            <option key={cargo.id} value={cargo.id}>
              {cargo.nome}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">Segure Ctrl/Cmd para selecionar múltiplos</p>
      </div>

      {/* Departamentos */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Departamentos</label>
        <select
          name="DepartamentosIds"
          value={formData.DepartamentosIds}
          onChange={handleChange}
          multiple
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          {departamentos.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.nome}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">Segure Ctrl/Cmd para selecionar múltiplos</p>
      </div>

      {/* Dados Cristãos */}
      <h3 className="mt-4 mb-1 text-lg font-semibold text-text">Dados Cristãos</h3>
      <hr className="mb-2 border-border" />

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="batizado"
          checked={formData.batizado}
          onChange={handleChange}
          className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#263238] text-text focus:ring-[#b3e5fc]"
        />
        <label className="text-text">Batizado</label>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Data do Batismo</label>
        <input
          type="date"
          name="data_batismo"
          value={formData.data_batismo}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="consagrado"
          checked={formData.consagrado}
          onChange={handleChange}
          className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#263238] text-text focus:ring-[#b3e5fc]"
        />
        <label className="text-text">Consagrado</label>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Data de Consagração</label>
        <input
          type="date"
          name="data_consagracao"
          value={formData.data_consagracao}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Categoria Ministerial</label>
        <select
          name="categoria_ministerial"
          value={formData.categoria_ministerial}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          <option value="">Selecione</option>
          {categoriaMinisterialOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Dados Acadêmicos */}
      <h3 className="mt-4 mb-1 text-lg font-semibold text-text">Dados Acadêmicos</h3>
      <hr className="mb-2 border-border" />

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-text">Habilitação</label>
        <select
          name="habilitacoes"
          value={formData.habilitacoes}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
        >
          <option value="">Selecione</option>
          {habilitacoesOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {['especialidades', 'estudo_teologico', 'local_formacao', 'profissao'].map(campo => (
        <div key={campo} className="mb-4">
          <label className="mb-1 block text-sm font-medium text-text">
            {campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
          </label>
          <input
            type="text"
            name={campo}
            value={formData[campo]}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-600 bg-[#263238] px-4 py-2.5 text-white focus:border-border focus:outline-none focus:ring-2 focus:ring-[#b3e5fc]/20"
          />
        </div>
      ))}

      {/* Diversos */}
      <h3 className="mt-4 mb-1 text-lg font-semibold text-text">Diversos</h3>
      <hr className="mb-2 border-border" />

      {['trabalha', 'conta_outrem', 'conta_propria'].map(campo => (
        <div key={campo} className="mb-4 flex items-center">
          <input
            type="checkbox"
            name={campo}
            checked={formData[campo]}
            onChange={handleChange}
            className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#263238] text-text focus:ring-[#b3e5fc]"
          />
          <label className="text-text">
            {campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}
          </label>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </span>
        ) : (
          membroData ? 'Atualizar Membro' : 'Cadastrar Membro'
        )}
      </button>
    </form>
  );
}
