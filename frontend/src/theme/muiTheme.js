import { createTheme } from "@mui/material/styles";

const tokens = {
  bg: "#FFFFFF",
  bgSection: "#F8F9FB",
  surface: "#FFFFFF",
  border: "#E8E8ED",
  primary: "#4F5EF7",
  primaryHover: "#3B4AE8",
  primarySoft: "#EEF0FE",
  text: "#0D0D12",
  textSecondary: "#4A4A5A",
  textMuted: "#8C8CA1",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
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
      main: tokens.textSecondary,
    },
    error: {
      main: tokens.danger,
    },
    success: {
      main: tokens.success,
    },
    warning: {
      main: tokens.warning,
    },
    background: {
      default: tokens.bg,
      paper: tokens.surface,
    },
    text: {
      primary: tokens.text,
      secondary: tokens.textSecondary,
      disabled: tokens.textMuted,
    },
    divider: tokens.border,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontSize: "24px", fontWeight: 700, color: tokens.text },
    h2: { fontSize: "20px", fontWeight: 700, color: tokens.text },
    h3: { fontSize: "16px", fontWeight: 600, color: tokens.text },
    body1: { fontSize: "14px", color: tokens.text },
    body2: { fontSize: "13px", color: tokens.textSecondary },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 4px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 16px rgba(0,0,0,0.08)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 8px 32px rgba(0,0,0,0.10)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "13px",
          boxShadow: "none",
          transition: "all 150ms ease-in-out",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          backgroundColor: tokens.primary,
          color: "#FFFFFF",
          "&:hover": { backgroundColor: tokens.primaryHover },
        },
        outlined: {
          borderColor: tokens.border,
          color: tokens.text,
          "&:hover": { borderColor: tokens.primary, backgroundColor: tokens.primarySoft },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          border: `1px solid ${tokens.border}`,
          backgroundColor: tokens.surface,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: "12px",
          border: `1px solid ${tokens.border}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "14px",
            color: tokens.text,
            "& fieldset": {
              borderColor: tokens.border,
            },
            "&:hover fieldset": {
              borderColor: tokens.textMuted,
            },
            "&.Mui-focused fieldset": {
              borderColor: tokens.primary,
              borderWidth: "1.5px",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px",
            color: tokens.textMuted,
            "&.Mui-focused": {
              color: tokens.primary,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "14px",
          color: tokens.text,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.border,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.textMuted,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "14px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.border,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.textMuted,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: "10px 14px",
          fontSize: "14px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
          padding: "12px 16px",
          fontSize: "13px",
          borderBottom: `1px solid ${tokens.border}`,
          color: tokens.textSecondary,
        },
        head: {
          fontWeight: 600,
          color: tokens.text,
          backgroundColor: tokens.bgSection,
          borderBottom: `2px solid ${tokens.border}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: `${tokens.bgSection} !important`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          fontWeight: 600,
          fontSize: "12px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          border: `1px solid ${tokens.border}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "16px",
          color: tokens.text,
          borderBottom: `1px solid ${tokens.border}`,
          padding: "16px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px !important",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${tokens.border}`,
          padding: "12px 24px",
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
