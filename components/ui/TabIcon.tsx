import React from 'react';
import { Platform } from 'react-native';
import { Home, MessageCircle, BarChart2, MoreHorizontal, LucideIcon } from 'lucide-react-native';

const Icons = {
  Home,
  MessageCircle,
  BarChart2,
  MoreHorizontal,
} as const;

type IconName = keyof typeof Icons;

interface TabIconProps {
  name: IconName;
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 24 }: TabIconProps) {
  const Icon = Icons[name];

  if (!Icon) {
    console.warn(`Icon ${name} not found in available icons`);
    return null;
  }

  // On web, we need to ensure the SVG is properly rendered
  if (Platform.OS === 'web') {
    return (
      <Icon
        color={color}
        size={size}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  // On native platforms, render normally
  return <Icon color={color} size={size} />;
}