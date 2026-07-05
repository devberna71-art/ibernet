import React from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  return (
    <Box
      sx={{
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #020617 100%)`,
        color: "#fff",
        pt: 10,
        pb: 5,
        px: { xs: 3, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ANIMAÇÃO DE BRILHO */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        sx={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: (theme) =>
            `radial-gradient(circle at center, ${theme.palette.primary.main}1a, transparent 80%)`,
          top: "-100px",
          left: "40%",
          filter: "blur(120px)",
        }}
      />

      {/* CAMADA DE BRILHO SUTIL */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-200px",
          right: "-150px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: (theme) =>
            `radial-gradient(circle at center, ${theme.palette.primary.light}0d, transparent 80%)`,
          filter: "blur(100px)",
        }}
      />

      {/* CONTEÚDO */}
      <Grid container spacing={6} sx={{ position: "relative", zIndex: 2 }}>
        {/* LOGO E DESCRIÇÃO */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: (theme) =>
                `linear-gradient(90deg, ${theme.palette.primary.light}, #a5b4fc)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bernet-Eclesia
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              maxWidth: 360,
              lineHeight: 1.8,
              fontSize: "0.95rem",
            }}
          >
            A plataforma de gestão eclesiástica mais moderna de Angola.
            Inovação, transparência e excelência — tudo para sua igreja crescer
            com sabedoria e ordem.
          </Typography>
        </Grid>

        {/* LINKS */}
        <Grid item xs={12} sm={6} md={2.5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              letterSpacing: "0.5px",
              color: "primary.light",
            }}
          >
            Navegação
          </Typography>
          {["Home", "Sobre", "Planos", "Testemunhos", "Contato"].map(
            (item, i) => (
              <Typography
                key={i}
                component={motion.div}
                whileHover={{ x: 5, color: "primary.light" }}
                transition={{ duration: 0.2 }}
                sx={{
                  mb: 1.2,
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  color="inherit"
                  underline="none"
                >
                  {item}
                </Link>
              </Typography>
            )
          )}
        </Grid>

        {/* CONTATO */}
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              letterSpacing: "0.5px",
              color: "primary.light",
            }}
          >
            Contato
          </Typography>
          {[
            {
              icon: <PhoneIcon sx={{ color: "primary.light", mr: 1 }} />,
              text: "+244 923 519 571",
            },
            {
              icon: <EmailIcon sx={{ color: "primary.light", mr: 1 }} />,
              text: "contato@bernet-eclesia.com",
            },
            {
              icon: <LocationOnIcon sx={{ color: "primary.light", mr: 1 }} />,
              text: "Luanda, Angola — Av. Deolinda Rodrigues",
            },
          ].map((item, i) => (
            <Typography
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {item.icon}
              {item.text}
            </Typography>
          ))}
        </Grid>

        {/* REDES SOCIAIS */}
        <Grid item xs={12} md={2}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              letterSpacing: "0.5px",
              color: "primary.light",
            }}
          >
            Siga-nos
          </Typography>
          <Box>
            {[
              { icon: <FacebookIcon />, color: "#1877F2" },
              { icon: <InstagramIcon />, color: "#E1306C" },
              { icon: <WhatsAppIcon />, color: "#25D366" },
              { icon: <YouTubeIcon />, color: "#FF0000" },
            ].map((social, i) => (
              <IconButton
                key={i}
                component={motion.button}
                whileHover={{
                  scale: 1.2,
                  boxShadow: `0 0 20px ${social.color}`,
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* LINHA FINAL */}
      <Divider
        sx={{
          my: 5,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      />

      <Typography
        variant="body2"
        align="center"
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()}{" "}
        <strong style={{ color: "#60a5fa" }}>Bernet-Eclesia</strong> — Todos os
        direitos reservados.
        <br />
        Desenvolvido com 💙 por{" "}
        <strong style={{ color: "#a5b4fc" }}>Bernardo António & Dr Manuel Neto</strong>.
      </Typography>
    </Box>
  );
}
