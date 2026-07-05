// src/pages/Contato.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "#fff",
  textAlign: "center",
  padding: "100px 20px 80px",
  position: "relative",
  overflow: "hidden",
}));

const HeroGlow = styled(Box)(() => ({
  position: "absolute",
  width: "550px",
  height: "550px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
  filter: "blur(120px)",
  top: "25%",
  left: "35%",
  zIndex: 0,
}));

const ContactCard = styled(Paper)(() => ({
  padding: "40px 30px",
  textAlign: "center",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const ContactIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  marginBottom: "15px",
  "&:hover": { backgroundColor: theme.palette.primary.main, color: "#fff" },
}));

const ContactForm = styled("form")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
}));

/* ---------- COMPONENTE ---------- */
export default function Contato() {
  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f8faff, #ffffff)", minHeight: "100vh" }}>
      {/* HERO */}
      <HeroSection>
        <HeroGlow />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
            position: "relative",
            zIndex: 2,
            letterSpacing: "-0.02em",
          }}
        >
          Fale Conosco!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "700px",
            mx: "auto",
            lineHeight: 1.6,
            fontWeight: 400,
            position: "relative",
            zIndex: 2,
          }}
        >
          Tem dúvidas, sugestões ou deseja conversar connosco?  
          A nossa equipa está pronta para o atender com profissionalismo e dedicação.
        </Typography>
      </HeroSection>

      {/* CONTEÚDO */}
      <Box sx={{ py: 8, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={4} justifyContent="center">
          {/* INFORMAÇÕES DE CONTATO */}
          <Grid item xs={12} md={4}>
            <ContactCard
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactIcon size="large">
                <PhoneIcon />
              </ContactIcon>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Telefone
              </Typography>
              <Typography variant="body1" color="text.secondary">+244 923 519 571</Typography>

              <Box sx={{ mt: 4 }}>
                <ContactIcon size="large">
                  <EmailIcon />
                </ContactIcon>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  E-mail
                </Typography>
                <Typography variant="body1" color="text.secondary">bernet-eclesia@gmail.com</Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <ContactIcon size="large">
                  <LocationOnIcon />
                </ContactIcon>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Endereço
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Luanda, Angola<br />Bairro Kapolo, nº 123
                </Typography>
              </Box>
            </ContactCard>
          </Grid>

          {/* FORMULÁRIO DE CONTATO */}
          <Grid item xs={12} md={8}>
            <ContactCard
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                }}
              >
                Envie-nos uma Mensagem
              </Typography>

              <ContactForm>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Seu Nome"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Seu E-mail"
                      type="email"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Assunto"
                  fullWidth
                  required
                />

                <TextField
                  label="Mensagem"
                  multiline
                  rows={5}
                  fullWidth
                  required
                />

                <Button
                  variant="contained"
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    alignSelf: "flex-start",
                    px: 4,
                    py: 1.2,
                  }}
                >
                  ✉️ Enviar Mensagem
                </Button>
              </ContactForm>
            </ContactCard>
          </Grid>
        </Grid>

        {/* MAPA FICTÍCIO */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            mt: 8,
            height: 360,
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <iframe
            title="Localização Bernet"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15716.746214013727!2d13.234!3d-8.838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f20b39cb2aaf%3A0xf4cb44fdf528d5d5!2sLuanda%2C%20Angola!5e0!3m2!1spt-PT!2sao!4v1700000000000"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
}
