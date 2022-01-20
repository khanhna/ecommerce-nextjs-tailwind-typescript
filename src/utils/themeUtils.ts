import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';

export const fullConfig = resolveConfig(tailwindConfig as any);

export const themeBreakpoints = {
  sm: parseInt(((fullConfig.theme.screens as any).sm as string).replace('px', '')),
  md: parseInt(((fullConfig.theme.screens as any).md as string).replace('px', '')),
  lg: parseInt(((fullConfig.theme.screens as any).lg as string).replace('px', '')),
  xl: parseInt(((fullConfig.theme.screens as any).xl as string).replace('px', '')),
  '2xl': parseInt(((fullConfig.theme.screens as any)['2xl'] as string).replace('px', '')),
};

export const themeMarginMilestones = {
  sm: 12,
  md: 24,
  lg: 48,
};
