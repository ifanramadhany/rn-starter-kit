import { useWindowDimensions } from 'react-native';
import { breakpoints } from '../theme/breakpoints';

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const longestSide = Math.max(width, height);

  return {
    width,
    height,
    isLandscape: width > height,
    isTablet: shortestSide >= breakpoints.tablet,
    isDesktop: longestSide >= breakpoints.desktop,
  };
}
