/**
 * ECLESIA — Tema MUI
 * Alinhado com o Design System: primary #2563EB · text #0F172A · bg #FFFFFF
 */
import { createTheme } from "@mui/material/styles";

const eclesiaTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main:         "#2563EB",
      light:        "#EFF6FF",
      dark:         "#1D4ED8",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main:         "#475569",
      light:        "#F8FAFC",
      dark:         "#0F172A",
      contrastText: "#FFFFFF",
    },
    error:   { main: "#EF4444", light: "#FEE2E2", dark: "#DC2626" },
    warning: { main: "#D97706", light: "#FEF3C7", dark: "#B45309" },
    success: { main: "#16A34A", light: "#DCFCE7", dark: "#15803D" },
    info:    { main: "#2563EB", light: "#EFF6FF", dark: "#1D4ED8" },
    background: {
      default: "#FFFFFF",
      paper:   "#FFFFFF",
    },
    text: {
      primary:   "#0F172A",
      secondary: "#475569",
      disabled:  "#94A3B8",
    },
    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontSize: "30px", fontWeight: 700, lineHeight: 1.2, color: "#0F172A" },
    h2: { fontSize: "24px", fontWeight: 700, lineHeight: 1.25, color: "#0F172A" },
    h3: { fontSize: "20px", fontWeight: 700, lineHeight: 1.3, color: "#0F172A" },
    h4: { fontSize: "18px", fontWeight: 600, lineHeight: 1.4, color: "#0F172A" },
    h5: { fontSize: "16px", fontWeight: 600, lineHeight: 1.4, color: "#0F172A" },
    h6: { fontSize: "14px", fontWeight: 600, lineHeight: 1.5, color: "#0F172A" },
    body1: { fontSize: "14px", lineHeight: 1.5, color: "#0F172A" },
    body2: { fontSize: "13px", lineHeight: 1.5, color: "#475569" },
    caption: { fontSize: "12px", lineHeight: 1.4, color: "#94A3B8" },
    overline: { fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" },
    subtitle1: { fontSize: "14px", fontWeight: 600, color: "#0F172A" },
    subtitle2: { fontSize: "13px", fontWeight: 600, color: "#475569" },
    button: { fontSize: "13px", fontWeight: 600, textTransform: "none", letterSpacing: "0" },
  },

  shape: { borderRadius: 8 },

  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 16px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.06)",
    "0 8px 32px rgba(0,0,0,0.10)",
    "0 16px 48px rgba(0,0,0,0.12)",
    ...Array(19).fill("none"),
  ],

  components: {
    /* ── Button ── */
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "contained" },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "13px",
          textTransform: "none",
          letterSpacing: 0,
          padding: "8px 16px",
          transition: "all 0.15s ease",
        },
        containedPrimary: {
          background: "#2563EB",
          "&:hover": { background: "#1D4ED8" },
        },
        outlinedPrimary: {
          borderColor: "#E2E8F0",
          color: "#0F172A",
          "&:hover": { borderColor: "#2563EB", background: "#EFF6FF" },
        },
      },
    },

    /* ── TextField ── */
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "14px",
          backgroundColor: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563EB",
            borderWidth: "1.5px",
          },
        },
        input: { padding: "8px 12px", color: "#0F172A" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          color: "#94A3B8",
          "&.Mui-focused": { color: "#2563EB" },
        },
      },
    },

    /* ── Select ── */
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: "8px", fontSize: "14px" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          "&:hover": { background: "#EFF6FF" },
          "&.Mui-selected": { background: "#EFF6FF", color: "#2563EB", fontWeight: 600 },
        },
      },
    },

    /* ── Paper / Card ── */
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          backgroundImage: "none",
        },
        elevation0: { boxShadow: "none", border: "1px solid #E2E8F0" },
        elevation1: { boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" },
        elevation3: { boxShadow: "0 4px 16px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.06)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          backgroundImage: "none",
        },
      },
    },

    /* ── Table ── */
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& th": {
            backgroundColor: "#F8FAFC",
            color: "#475569",
            fontWeight: 600,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #E2E8F0",
            padding: "10px 16px",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& tr": { borderBottom: "1px solid #F1F5F9" },
          "& tr:hover": { backgroundColor: "#F8FAFC" },
          "& td": { fontSize: "13px", color: "#0F172A", padding: "12px 16px" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F1F5F9",
          fontSize: "13px",
          padding: "10px 16px",
        },
      },
    },

    /* ── Dialog / Modal ── */
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: "16px", fontWeight: 600, color: "#0F172A", padding: "20px 24px 16px" },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: "0 24px 16px" },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: "12px 24px 20px", gap: "8px" },
      },
    },

    /* ── Chip ── */
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 600,
          height: "24px",
        },
        colorPrimary: {
          background: "#EFF6FF",
          color: "#2563EB",
          border: "1px solid #BFDBFE",
        },
      },
    },

    /* ── Accordion ── */
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "10px !important",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            boxShadow: "0 4px 16px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.06)",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { minHeight: "52px", padding: "0 20px" },
        content: { margin: "12px 0" },
      },
    },

    /* ── DataGrid ── */
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          borderRadius: "10px",
          fontSize: "13px",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#F8FAFC" },
          "& .MuiDataGrid-cell": { borderBottom: "1px solid #F1F5F9" },
        },
      },
    },

    /* ── Divider ── */
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#E2E8F0" } },
    },

    /* ── CircularProgress ── */
    MuiCircularProgress: {
      defaultProps: { size: 24, thickness: 4 },
      styleOverrides: { root: { color: "#2563EB" } },
    },

    /* ── LinearProgress ── */
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: "4px", height: "6px", backgroundColor: "#E2E8F0" },
        bar: { borderRadius: "4px" },
      },
    },

    /* ── Snackbar/Alert ── */
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: "8px", fontSize: "13px" },
        standardSuccess: { background: "#DCFCE7", color: "#15803D" },
        standardError: { background: "#FEE2E2", color: "#DC2626" },
        standardWarning: { background: "#FEF3C7", color: "#B45309" },
        standardInfo: { background: "#EFF6FF", color: "#1D4ED8" },
      },
    },

    /* ── Tooltip ── */
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0F172A",
          color: "#F8FAFC",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "6px 10px",
        },
      },
    },

    /* ── Switch ── */
    MuiSwitch: {
      styleOverrides: {
        switchBase: { "&.Mui-checked": { color: "#2563EB" } },
        track: { ".Mui-checked.Mui-checked + &": { backgroundColor: "#2563EB" } },
      },
    },
  },
});

export default eclesiaTheme;
