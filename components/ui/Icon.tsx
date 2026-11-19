import React from 'react';
import { Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';

// Codepoints from groww-huge-rounded font
const ICONS: Record<string, string> = {
  arrowUp:           '', // arrow-up-01
  arrowDown:         '', // arrow-down-01
  arrowLeft:         '', // arrow-left-01
  arrowRight:        '', // arrow-right-01
  arrowExpand:       '', // mds_ic_huge_expand
  informationCircle: '', // information-circle
  close:             '', // cancel-01
  moreVertical:      '', // more-vertical
  unfoldMore:        '', // unfold-more
  alarm:             '', // alarm-clock
  bookmark:          '', // bookmark-02
  search:            '', // mds_ic_huge_product_search
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = '#000' }: IconProps) {
  const glyph = ICONS[name] ?? '';
  return (
    <Text style={{ fontFamily: 'GrowwHugeIcons', fontSize: size, color, lineHeight: size }}>
      {glyph}
    </Text>
  );
}

interface IconButtonProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function IconButton({ name, size = 20, color, style, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Icon name={name} size={size} color={color ?? '#989EA0'} />
    </TouchableOpacity>
  );
}
