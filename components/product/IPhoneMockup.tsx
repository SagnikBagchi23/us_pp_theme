import React from 'react';
import { View, StyleSheet } from 'react-native';

const SCREEN_W = 360;
const SCREEN_H = 800;
const BEZEL = 4;
const CORNER_RADIUS = 32;

interface IPhoneMockupProps {
  children: React.ReactNode;
}

export function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <View style={styles.frame}>
      <View style={styles.screen}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: SCREEN_W + BEZEL * 2,
    height: SCREEN_H + BEZEL * 2,
    borderRadius: CORNER_RADIUS,
    backgroundColor: '#000',
  },
  screen: {
    position: 'absolute',
    top: BEZEL,
    left: BEZEL,
    width: SCREEN_W,
    height: SCREEN_H,
    borderRadius: CORNER_RADIUS - BEZEL,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
