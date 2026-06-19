import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Grid,
  IconButton
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import BusinessIcon from '@mui/icons-material/BusinessOutlined';
import ContactIcon from '@mui/icons-material/ContactPageOutlined';
import api from '../api/axiosConfig';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formUsuario, setFormUsuario] = useState({ nome: '' });

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/meu-perfil');
      setUsuario(res.data.usuario);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPerfil(); }, []);

  const handleOpen = () => {
    setFormUsuario({ nome: usuario.nome });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      await api.put('/meu-perfil', { nome: formUsuario.nome });
      setSnackbar({ open: true, message: 'Perfil atualizado! ✨', severity: 'success' });
      setOpenModal(false);
      fetchPerfil();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao atualizar', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={24} sx={{ color: 'text.primary' }} />
      </Box>
    );
  }

  if (!usuario) return null;
  const membro = usuario.membro;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, margin: '0 auto' }}>
      
      {/* CARD COMPACTO SUPERIOR (FOTO + IDENTIDADE + BOTÃO) */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2.5, mb: 2, borderRadius: '16px', 
          border: '1px solid', borderColor: 'grey.100',
          background: '#fff', boxShadow: '0px 4px 20px rgba(0,0,0,0.01)'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="center">
          <Avatar 
            src={membro?.foto || usuario.foto || ''} 
            sx={{ width: 64, height: 64, border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
          />
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {usuario.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
              {membro?.email}
            </Typography>
            
            {/* CARGOS E DEPTOS JUNTOS E COMPACTOS LOGO ABAIXO DO NOME */}
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              {(membro?.cargos || []).map((c) => (
                <Chip key={c.id} label={c.nome} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: 'rgba(25, 118, 210, 0.05)', color: 'primary.main', border: 'none' }} />
              ))}
              {(membro?.departamentos || []).map((d) => (
                <Chip key={d.id} label={d.nome} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: 'rgba(156, 39, 176, 0.05)', color: 'secondary.main', border: 'none' }} />
              ))}
            </Stack>
          </Box>
          <Button 
            variant="contained" disableElevation size="small"
            startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />} 
            onClick={handleOpen}
            sx={{
              backgroundColor: 'text.primary', borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 2, py: 0.8,
              '&:hover': { backgroundColor: 'grey.800' }
            }}
          >
            Editar
          </Button>
        </Stack>
      </Paper>

      {/* GRID INFERIOR MICRO-CARDS DE INFORMAÇÃO */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <MiniCard title="Contactos" icon={<ContactIcon fontSize="inherit" />}>
            <Row label="Telefone" value={membro?.telefone || '—'} />
            <Row label="E-mail" value={membro?.email || '—'} />
          </MiniCard>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <MiniCard title="Organização" icon={<BusinessIcon fontSize="inherit" />}>
            <Row label="Sede" value={usuario.Sede?.nome || '—'} />
            <Row label="Filial" value={usuario.Filhal?.nome || '—'} />
          </MiniCard>
        </Grid>

        <Grid item xs={12} sm={4}>
          <MiniCard title="Segurança" icon={<ShieldIcon fontSize="inherit" />}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4, mb: 1 }}>
              Dados protegidos de ponta a ponta.
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
              Alterar senha →
            </Typography>
          </MiniCard>
        </Grid>
      </Grid>

      {/* MODAL DE EDIÇÃO CLEAN */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Editar Perfil
          <IconButton onClick={() => setOpenModal(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <TextField 
            label="Nome Completo" value={formUsuario.nome} onChange={(e) => setFormUsuario({ nome: e.target.value })} 
            fullWidth size="small" variant="outlined" InputLabelProps={{ shrink: true }}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenModal(false)} size="small" sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button variant="contained" disableElevation size="small" onClick={handleSubmit} sx={{ textTransform: 'none', fontWeight: 600, backgroundColor: 'text.primary', borderRadius: '6px', px: 2, '&:hover': { backgroundColor: 'grey.800' } }}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* TOAST POPUP */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// Componentes Utilitários de Escopo Local para manter o código limpo
function MiniCard({ title, icon, children }) {
  return (
    <Paper 
      elevation={0}
      sx={{ p: 2, height: '100%', borderRadius: '12px', border: '1px solid', borderColor: 'grey.100', backgroundColor: '#fff' }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, color: 'text.secondary', fontSize: '16px' }}>
        {icon}
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );
}

function Row({ label, value }) {
  return (
    <Box sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 500 }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</Typography>
    </Box>
  );
}