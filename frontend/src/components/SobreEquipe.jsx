// src/pages/SobreEquipa.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import heroImage from "../assets/nossaequipe.jpg";
import berna from "../assets/bernardo.jpg";
import pastor from "../assets/pastor.jpg";
import equipa from "../assets/equipa.jpg";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundImage: `url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "50vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#fff",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: `linear-gradient(to bottom, rgba(15,23,42,0.6), ${theme.palette.primary.dark}cc)`,
  },
}));

const HeroContent = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: "900px",
  padding: "20px",
}));

const ProfileImage = styled(motion.img)(({ size }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  objectFit: "cover",
  objectPosition: "top center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  border: "4px solid #fff",
  transition: "transform 0.4s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const GlowCircle = styled(Box)(({ color }) => ({
  position: "absolute",
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
  filter: "blur(90px)",
  zIndex: 0,
}));

/* ---------- COMPONENTE ---------- */
export default function SobreEquipa() {
  return (
    <Box sx={{ backgroundColor: "#f8faff", overflow: "hidden" }}>
      {/* HERO */}
      <HeroSection>
        <HeroContent>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            A Nossa Equipa
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Pessoas que acreditam no poder da fé e da tecnologia.  
            Criamos soluções que transformam o modo como as igrejas se organizam e crescem.
          </Typography>
        </HeroContent>
      </HeroSection>

      {/* DECORAÇÃO DE EQUIPA */}
      <Box
        sx={{
          position: "relative",
          py: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Luzes decorativas */}
        <GlowCircle color="rgba(37, 99, 235, 0.2)" sx={{ top: "10%", left: "15%" }} />
        <GlowCircle color="rgba(148, 163, 184, 0.15)" sx={{ bottom: "10%", right: "15%" }} />

        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            mb: 8,
            position: "relative",
            zIndex: 2,
          }}
        >
          Conheça as Pessoas Por Trás da Bernet-Eclesia
        </Typography>

        {/* Linha de imagens */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 8 },
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {/* Bernardo (esquerda) */}
          <Box sx={{ textAlign: "center" }}>
            <ProfileImage
              src={berna}
              alt="Bernardo António"
              size="200px"
              whileHover={{ scale: 1.05 }}
            />
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              Bernardo António
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
               Desenvolvedor
            </Typography>
          </Box>

          {/* Equipa (centro) */}
          <Box sx={{ position: "relative", textAlign: "center" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                width: "400px",
                height: "400px",
                background:
                  "radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
                filter: "blur(80px)",
                zIndex: 0,
              }}
            />
            <ProfileImage
              src={equipa}
              alt="Equipa Bernet"
              size="280px"
              whileHover={{ scale: 1.03, rotate: 1 }}
              style={{
                zIndex: 2,
                border: "6px solid #fff",
                boxShadow:
                  "0 15px 45px rgba(37,99,235,0.2)",
              }}
            />
            <Typography
              sx={{
                mt: 3,
                fontWeight: 800,
                color: "text.primary",
              }}
            >
              Equipa Bernet
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", maxWidth: "360px", mx: "auto" }}>
              Unidos pela mesma visão, desenvolvemos soluções que inspiram fé e inovação.
            </Typography>
          </Box>

          {/* Dr. Neto (direita) */}
          <Box sx={{ textAlign: "center" }}>
            <ProfileImage
              src={pastor}
              alt="Dr. Neto"
              size="200px"
              whileHover={{ scale: 1.05 }}
            />
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              Dr. Neto
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
              Mentor & Estrategista
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
