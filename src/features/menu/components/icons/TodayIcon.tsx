import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

type TodayIconProps = {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

export default function TodayIcon({
  color = '#0f172a',
  size = 24,
  strokeWidth = 2,
}: TodayIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="today-icon-core" x1="7" y1="6" x2="17" y2="18">
          <Stop offset="0" stopColor="#fde047" />
          <Stop offset="0.55" stopColor="#fb923c" />
          <Stop offset="1" stopColor="#f43f5e" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="4.5" fill="url(#today-icon-core)" />
      <Circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <G strokeLinecap="round" strokeWidth={strokeWidth}>
        <Path d="M12 2.5V5" stroke="#facc15" />
        <Path d="M12 19v2.5" stroke="#fb7185" />
        <Path d="M4.57 4.57l1.77 1.77" stroke="#38bdf8" />
        <Path d="M17.66 17.66l1.77 1.77" stroke="#f97316" />
        <Path d="M2.5 12H5" stroke="#22c55e" />
        <Path d="M19 12h2.5" stroke="#a855f7" />
        <Path d="M4.57 19.43l1.77-1.77" stroke="#14b8a6" />
        <Path d="M17.66 6.34l1.77-1.77" stroke="#ef4444" />
      </G>
    </Svg>
  );
}
