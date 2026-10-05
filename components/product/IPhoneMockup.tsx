import React from 'react';
import { View, StyleSheet } from 'react-native';

const SCREEN_W = 393;
const SCREEN_H = 852;
const BEZEL = 14;
const FRAME_R = 56;

interface IPhoneMockupProps {
  children: React.ReactNode;
}

export function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <View style={styles.frame}>
      <View style={styles.screen}>
        {children}
      </View>
      <View style={styles.dynamicIsland} />
      <View style={styles.homeBar} />
      <View style={[styles.sideButton, styles.sideButtonVolUp]} />
      <View style={[styles.sideButton, styles.sideButtonVolDown]} />
      <View style={[styles.sideButton, styles.sideButtonPower]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: SCREEN_W + BEZEL * 2,
    height: SCREEN_H + BEZEL * 2,
    borderRadius: FRAME_R,
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.5,
    shadowRadius: 48,
    elevation: 30,
  },
  screen: {
    position: 'absolute',
    top: BEZEL,
    left: BEZEL,
    width: SCREEN_W,
    height: SCREEN_H,
    borderRadius: FRAME_R - BEZEL,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dynamicIsland: {
    position: 'absolute',
    top: BEZEL + 12,
    alignSelf: 'center',
    left: (SCREEN_W + BEZEL * 2) / 2 - 63,
    width: 126,
    height: 37,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  homeBar: {
    position: 'absolute',
    bottom: BEZEL + 8,
    alignSelf: 'center',
    left: (SCREEN_W + BEZEL * 2) / 2 - 67,
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fff',
    opacity: 0.22,
  },
  sideButton: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  sideButtonVolUp: {
    left: -4,
    top: 130,
    height: 36,
  },
  sideButtonVolDown: {
    left: -4,
    top: 178,
    height: 36,
  },
  sideButtonPower: {
    right: -4,
    top: 150,
    height: 72,
  },
});
