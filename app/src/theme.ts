import { createTheme } from '@mui/material/styles'

export const tagColors = {
  blue: { bg: '#E7F3F8', text: '#0B6E99', border: '#BFDDEB' },
  green: { bg: '#DBEDDB', text: '#1C6E3D', border: '#BFDBC0' },
  yellow: { bg: '#FBF3DB', text: '#8A6A1E', border: '#EFE1B2' },
  red: { bg: '#FBE4E4', text: '#A32E2E', border: '#EFCACA' },
  purple: { bg: '#EEE6F8', text: '#6940A5', border: '#D6C5EB' },
  orange: { bg: '#FADEC9', text: '#B65A1C', border: '#EFC6A3' },
  pink: { bg: '#F5E0E9', text: '#A6446B', border: '#E8C6D3' },
  gray: { bg: '#EBECED', text: '#5F6368', border: '#D8D9DB' },
} as const

export type TagColorKey = keyof typeof tagColors

const NOTION_BG = '#FFFFFF'
const NOTION_BG_ALT = '#F7F7F5'
const NOTION_BORDER = '#E9E9E7'
const NOTION_TEXT = '#37352F'
const NOTION_TEXT_MUTED = '#787774'
const NOTION_ACCENT = '#2383E2'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: NOTION_ACCENT, contrastText: '#FFFFFF' },
    background: { default: NOTION_BG, paper: NOTION_BG },
    text: { primary: NOTION_TEXT, secondary: NOTION_TEXT_MUTED },
    divider: NOTION_BORDER,
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    fontSize: 14,
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.9375rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
    body2: { fontSize: '0.875rem', lineHeight: 1.55, color: NOTION_TEXT_MUTED },
    button: { fontWeight: 500, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: NOTION_BG,
          color: NOTION_TEXT,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          padding: '6px 12px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        outlined: {
          borderColor: NOTION_BORDER,
          color: NOTION_TEXT,
          backgroundColor: NOTION_BG,
          '&:hover': {
            backgroundColor: NOTION_BG_ALT,
            borderColor: NOTION_BORDER,
          },
        },
        text: {
          color: NOTION_TEXT,
          '&:hover': { backgroundColor: NOTION_BG_ALT },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: NOTION_BG,
          border: `1px solid ${NOTION_BORDER}`,
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: NOTION_BG,
          borderBottom: `1px solid ${NOTION_BORDER}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 2, backgroundColor: NOTION_TEXT },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 44,
          color: NOTION_TEXT_MUTED,
          '&.Mui-selected': { color: NOTION_TEXT },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500, height: 22 },
      },
    },
  },
})
