import { createTheme } from "@mui/material/styles";

const tokens = {
  bg: "#F6F1E9",
  surface: "#FFFFFF",
  surfaceMuted: "#ECE5D8",
  primary: "#D97A4D",
  primarySoft: "#FBE3CF",
  text: "#211D19",
  textMuted: "#8B8378",
  danger: "#B5332C",
  success: "#5C8A5C",
};

export default createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.primary,
      light: tokens.primarySoft,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: tokens.textMuted,
    },
    error: {
      main: tokens.danger,
    },
    success: {
      main: tokens.success,
    },
    background: {
      default: tokens.bg,
      paper: tokens.surface,
    },
    text: {
      primary: tokens.text,
      secondary: tokens.textMuted,
    },
    divider: tokens.surfaceMuted,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    h1: { fontSize: "30px", fontWeight: 700, color: tokens.text },
    h2: { fontSize: "24px", fontWeight: 700, color: tokens.text },
    h3: { fontSize: "17px", fontWeight: 600, color: tokens.text },
    body1: { fontSize: "14px", color: tokens.text },
    body2: { fontSize: "13px", color: tokens.textMuted },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    "none",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
    "0 2px 8px rgba(33,29,25,0.05)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          backgroundColor: tokens.primary,
          "&:hover": { backgroundColor: "#C56A3F" },
        },
        outlined: {
          borderColor: tokens.primary,
          color: tokens.primary,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          boxShadow: "0 2px 8px rgba(33,29,25,0.05)",
          border: `1px solid ${tokens.surfaceMuted}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: tokens.primary,
        },
      },
    },
  },
});

export { tokens };
