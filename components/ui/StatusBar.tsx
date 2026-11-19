import React from 'react';
import { StatusBar as RNStatusBar, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';

interface StatusBarProps {
  scrolled: SharedValue<number>;
}

// Simulated iPhone status bar content (time + signal/wifi/battery), matching the
// phone-mockup chrome Figma ships alongside the app bar. `RNStatusBar` below still
// controls the real OS status bar on native; this row is the visual stand-in used
// inside the simulated phone frame (and on web, where there is no OS status bar).
export function StatusBar({ scrolled: _scrolled }: StatusBarProps) {
  const { colors, scheme } = useTheme();

  return (
    <>
      <RNStatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <Text style={[styles.time, { color: colors.contentPrimary }]}>9:41</Text>
        <View style={styles.icons}>
          <Svg width={18.149} height={11} viewBox="0 0 18.1494 11">
            <Path
              d="M2.2002 6.0498C2.80752 6.05003 3.2998 6.54301 3.2998 7.15039V9.90039C3.29959 10.5076 2.80739 10.9998 2.2002 11H1.09961C0.492308 10.9999 0.000211024 10.5077 0 9.90039V7.15039C0 6.54294 0.492178 6.0499 1.09961 6.0498H2.2002ZM7.25 4.40039C7.80215 4.40055 8.25 4.84821 8.25 5.40039V10C8.25 10.5522 7.80215 10.9998 7.25 11H5.94922C5.39715 10.9997 4.94922 10.5521 4.94922 10V5.40039C4.94922 4.84827 5.39715 4.40065 5.94922 4.40039H7.25ZM12.2002 2.2002C12.7523 2.20039 13.2002 2.64803 13.2002 3.2002V10C13.2001 10.5521 12.7523 10.9998 12.2002 11H10.8994C10.3474 10.9998 9.89946 10.5521 9.89941 10V3.2002C9.89941 2.64805 10.3473 2.20042 10.8994 2.2002H12.2002ZM17.1494 0C17.7017 0 18.1494 0.447715 18.1494 1V10C18.1494 10.5523 17.7017 11 17.1494 11H15.8496C15.2974 10.9999 14.8496 10.5522 14.8496 10V1C14.8496 0.447759 15.2974 7.16957e-05 15.8496 0H17.1494Z"
              fill={colors.contentPrimary}
            />
          </Svg>
          <Svg width={18} height={13} viewBox="0 0 18 13">
            <Path
              d="M9.00049 2.69984C11.6121 2.69995 14.1239 3.70936 16.0167 5.51942C16.1592 5.65916 16.387 5.6574 16.5274 5.51547L17.8899 4.13235C17.961 4.06036 18.0006 3.96285 18 3.86139C17.9994 3.75994 17.9586 3.6629 17.8867 3.59175C12.9188 -1.19725 5.08138 -1.19725 0.113467 3.59175C0.0415034 3.66284 0.000671769 3.75985 8.21779e-06 3.86131C-0.000655451 3.96277 0.0389034 4.06031 0.109931 4.13235L1.47278 5.51547C1.61307 5.65762 1.84107 5.65938 1.98351 5.51942C3.87652 3.70924 6.38859 2.69983 9.00049 2.69984ZM9.00049 7.19971C10.4354 7.19962 11.8191 7.73611 12.8828 8.70493C13.0267 8.84243 13.2533 8.83945 13.3935 8.69822L14.7544 7.3151C14.8261 7.24255 14.8658 7.14413 14.8648 7.04186C14.8638 6.9396 14.822 6.84201 14.7489 6.77094C11.5099 3.74028 6.49385 3.74028 3.25482 6.77094C3.18166 6.84201 3.13992 6.93964 3.13896 7.04195C3.138 7.14425 3.1779 7.24266 3.24972 7.3151L4.61021 8.69822C4.75045 8.83945 4.97707 8.84243 5.12094 8.70493C6.18388 7.73675 7.56651 7.20031 9.00049 7.19971ZM11.6158 10.5006C11.6886 10.4288 11.7287 10.3299 11.7266 10.2273C11.7245 10.1248 11.6804 10.0276 11.6048 9.95883C10.1014 8.67978 7.89957 8.67978 6.39618 9.95883C6.32049 10.0276 6.27636 10.1247 6.2742 10.2272C6.27204 10.3298 6.31206 10.4287 6.38479 10.5006L8.73924 12.8902C8.80824 12.9605 8.90233 13 9.00049 13C9.09866 13 9.19274 12.9605 9.26175 12.8902L11.6158 10.5006Z"
              fill={colors.contentPrimary}
            />
          </Svg>
          <Svg width={26.603} height={12.5} viewBox="0 0 26.6026 12.5">
            <Path
              d="M1.92308 3.20513C1.92308 2.49707 2.49707 1.92308 3.20513 1.92308H20.8333C21.5414 1.92308 22.1154 2.49707 22.1154 3.20513V9.29487C22.1154 10.0029 21.5414 10.5769 20.8333 10.5769H3.20513C2.49707 10.5769 1.92308 10.0029 1.92308 9.29487V3.20513Z"
              fill={colors.contentPrimary}
            />
            <Path
              opacity={0.4}
              d="M20.833 0C22.6031 0 24.0381 1.43496 24.0381 3.20508V9.29492C24.0381 11.065 22.6031 12.5 20.833 12.5H3.20508C1.43497 12.5 2.68974e-05 11.065 0 9.29492V3.20508C2.69574e-05 1.43497 1.43497 2.72881e-05 3.20508 0H20.833ZM3.20508 0.961914C1.96602 0.961941 0.961941 1.96602 0.961914 3.20508V9.29492C0.961941 10.534 1.96602 11.5381 3.20508 11.5381H20.833C22.0721 11.5381 23.0771 10.534 23.0771 9.29492V3.20508C23.0771 1.966 22.0721 0.961914 20.833 0.961914H3.20508ZM25 4.22461C25.9186 4.44183 26.6025 5.26505 26.6025 6.25C26.6025 7.23487 25.9185 8.05712 25 8.27441V4.22461Z"
              fill={colors.contentPrimary}
            />
          </Svg>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  time: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
