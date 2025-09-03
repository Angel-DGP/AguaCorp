import { COLORS } from './Colors';

// Tamaños de fuente estandarizados
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

// Pesos de fuente estandarizados
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Espaciado estandarizado
export const SPACING = {
  xs: 4,
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

// Bordes estandarizados
export const BORDER_RADIUS = {
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 25,
  full: 9999,
} as const;

// Sombras estandarizadas
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Tamaños de iconos estandarizados
export const ICON_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
} as const;

// Estilos de tarjetas estandarizados
export const CARD_STYLES = {
  base: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.base,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
} as const;

// Estilos de botones estandarizados
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center' as const,
    ...SHADOWS.base,
  },
  secondary: {
    backgroundColor: COLORS.orange,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center' as const,
    ...SHADOWS.base,
  },
  success: {
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center' as const,
    ...SHADOWS.base,
  },
  danger: {
    backgroundColor: COLORS.red,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center' as const,
    ...SHADOWS.base,
  },
} as const;

// Estilos de texto estandarizados
export const TEXT_STYLES = {
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.darkBlue,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  sectionTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.darkBlue,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.darkBlue,
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
} as const;

// Estilos de badges estandarizados
const BADGE_BASE = {
  paddingHorizontal: SPACING.base,
  paddingVertical: SPACING.xs,
  borderRadius: BORDER_RADIUS.full,
} as const;

export const BADGE_STYLES = {
  base: BADGE_BASE,
  status: {
    active: {
      backgroundColor: COLORS.green,
      ...BADGE_BASE,
    },
    inactive: {
      backgroundColor: COLORS.orange,
      ...BADGE_BASE,
    },
    suspended: {
      backgroundColor: COLORS.red,
      ...BADGE_BASE,
    },
    overdue: {
      backgroundColor: COLORS.red,
      ...BADGE_BASE,
    },
    current: {
      backgroundColor: COLORS.green,
      ...BADGE_BASE,
    },
    pending: {
      backgroundColor: COLORS.orange,
      ...BADGE_BASE,
    },
    paid: {
      backgroundColor: COLORS.green,
      ...BADGE_BASE,
    },
  },
} as const;

// Estilos de tabs estandarizados
export const TAB_STYLES = {
  container: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.base,
    padding: SPACING.xs,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center' as const,
  },
  activeTab: {
    backgroundColor: COLORS.darkBlue,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
} as const;

// Estilos de filtros estandarizados
export const FILTER_STYLES = {
  container: {
    flexDirection: 'row' as const,
    gap: SPACING.sm,
  },
  filter: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  activeFilter: {
    backgroundColor: COLORS.darkBlue,
    borderColor: COLORS.darkBlue,
  },
  inactiveFilter: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
  },
} as const;
