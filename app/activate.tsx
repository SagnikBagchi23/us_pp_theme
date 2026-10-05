import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { textStyles } from '@/constants/tokens';

export default function ActivateScreen() {
  const { colors } = useTheme();
  const { back } = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundPrimary, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[textStyles.headingBase, { color: colors.contentPrimary }]}>Invest in US Stocks</Text>
      <Text onPress={back} style={[textStyles.bodyBase, { color: colors.contentAccent, marginTop: 16 }]}>← Go back</Text>
    </SafeAreaView>
  );
}
