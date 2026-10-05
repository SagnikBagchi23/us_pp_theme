import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, ThemeOverrideProvider } from '@/constants/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    Sohne: require('../assets/fonts/Sohne-Kraftig.otf'),
    GrowwSans: require('../assets/fonts/GrowwSans-Regular.otf'),
    GrowwSansMedium: require('../assets/fonts/GrowwSans-Medium.otf'),
    GrowwHugeIcons: require('../assets/fonts/GrowwHuge-Rounded.ttf'),
  });

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: '#060809' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemeOverrideProvider>
            <StatusBar style="light" backgroundColor="#060809" translucent={false} />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
          </ThemeOverrideProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
