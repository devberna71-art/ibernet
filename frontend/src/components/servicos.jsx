import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccountBalance,
  People,
  MonetizationOn,
  NotificationsActive,
  EventNote,
  BarChart,
  GroupWork,
} from "@mui/icons-material";
import { motion } from "framer-motion";

/* ---------- DADOS ---------- */
const services = [
  {
    title: "Secretaria Inteligente",
    description:
      "Automatize documentos, organize correspondências e centralize toda a administração institucional da igreja.",
    icon: <AccountBalance fontSize="inherit" />,
  },
  {
    title: "Gestão de Membros",
    description:
      "Acompanhe o crescimento espiritual, envolvimento e histórico de cada membro de forma intuitiva e visual.",
    icon: <People fontSize="inherit" />,
  },
  {
    title: "Gestão Financeira",
    description:
      "Controle total de dízimos, ofertas e doações com dashboards analíticos, relatórios interativos e alertas automáticos.",
    icon: <MonetizationOn fontSize="inherit" />,
  },
  {
    title: "Alertas & Notificações",
    description:
      "Receba comunicações inteligentes sobre movimentações financeiras, eventos e marcos importantes da igreja.",
    icon: <NotificationsActive fontSize="inherit" />,
  },
  {
    title: "Cultos & Eventos",
    description:
      "Planeje, organize e acompanhe cada detalhe de cultos e eventos com controle financeiro integrado.",
    icon: <EventNote fontSize="inherit" />,
  },
  {
    title: "Relatórios Avançados",
    description:
      "Crie relatórios completos e personalizados, visualize estatísticas e acompanhe o impacto das suas decisões.",
    icon: <BarChart fontSize="inherit" />,
  },
  {
    title: "Departamentos & Ministérios",
    description:
      "Organize grupos e ministérios com acompanhamento dinâmico de objetivos, tarefas e participações.",
    icon: <GroupWork fontSize="inherit" />,
  },
];

/* ---------- ESTILOS ---------- */
const PageContainer = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(to bottom, #f8faff, #ffffff)",
  padding: "100px 30px 80px",
  minHeight: "100vh",
}));

const AnimatedGlow = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "900px",
  height: "900px",
  background: `radial-gradient(circle at center, ${theme.palette.primary.light}33, transparent 70%)`,
  top: "-200px",
  right: "-250px",
  filter: "blur(180px)",
  zIndex: 0,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  textAlign: "center",
  color: theme.palette.primary.main,
  fontSize: "3rem",
  letterSpacing: "-0.02em",
  marginBottom: "16px",
  position: "relative",
  zIndex: 2,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: "center",
  maxWidth: "850px",
  margin: "0 auto 60px",
  lineHeight: 1.8,
  fontSize: "1.1rem",
  zIndex: 2,
  position: "relative",
  fontWeight: 400,
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  borderRadius: "14px",
  padding: "40px 30px",
  textAlign: "center",
  transition: "all 0.3s ease",
  cursor: "default",
  overflow: "hidden",
  zIndex: 1,
  maxWidth: "370px",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 10px 30px rgba(37,99,235,0.08)`,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: "64px",
  marginBottom: "20px",
  color: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: "1.25rem",
  marginBottom: "12px",
  zIndex: 1,
}));

const CardText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.95rem",
  lineHeight: 1.6,
  zIndex: 1,
}));

/* ---------- COMPONENTE ---------- */
export default function Servicos() {
  return (
    <PageContainer>
      <AnimatedGlow
        component={motion.div}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <Title
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nossos Serviços
      </Title>

      <SubTitle
        component={motion.p}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        A <strong>Bernet-Eclesia</strong> oferece soluções inteligentes,
        automatizadas e humanizadas para simplificar a gestão da sua igreja.
        Experimente tecnologia, beleza e espiritualidade conectadas.
      </SubTitle>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="stretch"
        sx={{ position: "relative", zIndex: 3 }}
      >
        {services.map((service, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ServiceCard>
              <IconWrapper>{service.icon}</IconWrapper>
              <CardTitle variant="h6">{service.title}</CardTitle>
              <CardText variant="body1">{service.description}</CardText>
            </ServiceCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
