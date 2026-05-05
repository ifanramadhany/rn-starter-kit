import { useWindowDimensions } from 'react-native';
import { breakpoints } from '../theme/breakpoints';

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isLandscape: width > height,
    isTablet: width >= breakpoints.tablet,
    isDesktop: width >= breakpoints.desktop,
  };
}
