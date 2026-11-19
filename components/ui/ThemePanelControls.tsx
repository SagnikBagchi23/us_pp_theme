import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Image, Modal, Pressable, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing, radius } from '@/constants/tokens';
import { dataVizLight, dataVizDark, DATA_VIZ_FAMILIES, type DataVizFamily } from '@/constants/dataVizTokens';
import type { LogoEntry } from '@/assets/logoCatalog';

export function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[textStyles.bodySmallHeavy, { color: colors.contentSecondary }, styles.sectionTitle]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.sectionBody, { backgroundColor: colors.backgroundSurfaceZ2, borderColor: colors.borderPrimary }]}>
        {children}
      </View>
    </View>
  );
}

export function PanelRow({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[styles.row, { borderBottomColor: colors.borderPrimary }]}>{children}</View>;
}

export function PanelToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <PanelRow>
      <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.borderPrimary, true: colors.contentAccent }}
        thumbColor="#FFFFFF"
      />
    </PanelRow>
  );
}

export function PanelSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.sliderRow, { borderBottomColor: colors.borderPrimary }]}>
      <View style={styles.sliderHeader}>
        <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
        <Text style={[textStyles.bodySmallHeavy, { color: colors.contentSecondary }]}>{Math.round(value)}</Text>
      </View>
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor={colors.contentAccent}
        maximumTrackTintColor={colors.borderPrimary}
        thumbTintColor={colors.contentAccent}
      />
    </View>
  );
}

export function PanelSelect({
  label,
  value,
  logos,
  onChange,
}: {
  label: string;
  value: string | null;
  logos: LogoEntry[];
  onChange: (id: string) => void;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = logos.find((l) => l.id === value);

  return (
    <>
      <PanelRow>
        <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
        <TouchableOpacity style={styles.selectTrigger} onPress={() => setOpen(true)} activeOpacity={0.7}>
          {selected && <Image source={selected.source} style={styles.selectThumb} />}
          <Text style={[textStyles.bodySmallHeavy, { color: colors.contentPrimary }]}>
            {selected ? selected.ticker : 'Select…'}
          </Text>
        </TouchableOpacity>
      </PanelRow>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.backgroundSurfaceZ1, borderColor: colors.borderPrimary }]}>
            <Text style={[textStyles.headingXSmall, { color: colors.contentPrimary }, styles.modalTitle]}>
              Choose a stock
            </Text>
            <FlatList
              data={logos}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => { onChange(item.id); setOpen(false); }}
                >
                  <Image source={item.source} style={styles.optionThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={[textStyles.bodyBaseHeavy, { color: colors.contentPrimary }]}>{item.ticker}</Text>
                    <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function PanelSegmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <PanelRow>
      <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
      <View style={styles.segmentGroup}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
              style={[
                styles.segmentBtn,
                { borderColor: colors.borderPrimary },
                active && { backgroundColor: colors.contentAccent, borderColor: colors.contentAccent },
              ]}
            >
              <Text
                style={[
                  textStyles.bodyXSmallHeavy,
                  { color: active ? colors.backgroundPrimary : colors.contentPrimary },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </PanelRow>
  );
}

export function PanelImagePicker({
  label,
  uri,
  onPick,
  onClear,
}: {
  label: string;
  uri: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  const { colors } = useTheme();
  return (
    <PanelRow>
      <View style={{ flex: 1 }}>
        <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
        <Text style={[textStyles.bodyXSmall, { color: colors.contentTertiary }]}>
          {uri ? 'Custom image selected' : 'None'}
        </Text>
      </View>
      {uri && <Image source={{ uri }} style={styles.selectThumb} />}
      <TouchableOpacity onPress={onPick} style={styles.resetBtn}>
        <Text style={[textStyles.bodyXSmallHeavy, { color: colors.contentAccent }]}>{uri ? 'Change' : 'Choose'}</Text>
      </TouchableOpacity>
      {uri && (
        <TouchableOpacity onPress={onClear} style={styles.resetBtn}>
          <Text style={[textStyles.bodyXSmallHeavy, { color: colors.contentNegative }]}>Remove</Text>
        </TouchableOpacity>
      )}
    </PanelRow>
  );
}

const PRESET_SWATCHES: { family: DataVizFamily; variant: 'base' | 'emphasis' }[] = DATA_VIZ_FAMILIES.flatMap((family) => [
  { family, variant: 'base' as const },
  { family, variant: 'emphasis' as const },
]);

export function PanelSwatchRow({
  label,
  color,
  isAuto,
  onPick,
  onReset,
}: {
  label: string;
  color: string;
  isAuto: boolean;
  onPick: (hex: string) => void;
  onReset: () => void;
}) {
  const { colors, scheme } = useTheme();
  const [open, setOpen] = useState(false);
  const table = scheme === 'dark' ? dataVizDark : dataVizLight;

  return (
    <>
      <PanelRow>
        <View style={{ flex: 1 }}>
          <Text style={[textStyles.bodyBase, { color: colors.contentPrimary }]}>{label}</Text>
          <Text style={[textStyles.bodyXSmall, { color: colors.contentTertiary }]}>
            {isAuto ? 'Auto (logo-derived)' : 'Manual'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.swatch, { backgroundColor: color, borderColor: colors.borderPrimary }]}
          onPress={() => setOpen(true)}
        />
        {!isAuto && (
          <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
            <Text style={[textStyles.bodyXSmallHeavy, { color: colors.contentAccent }]}>Reset</Text>
          </TouchableOpacity>
        )}
      </PanelRow>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.backgroundSurfaceZ1, borderColor: colors.borderPrimary }]}>
            <Text style={[textStyles.headingXSmall, { color: colors.contentPrimary }, styles.modalTitle]}>
              {label} color
            </Text>
            <View style={styles.swatchGrid}>
              {PRESET_SWATCHES.map(({ family, variant }) => {
                const hex = table[family][variant];
                return (
                  <TouchableOpacity
                    key={`${family}-${variant}`}
                    style={[styles.swatchOption, { backgroundColor: hex, borderColor: colors.borderPrimary }]}
                    onPress={() => { onPick(hex); setOpen(false); }}
                  />
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    letterSpacing: 1,
  },
  sectionBody: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  sliderRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  selectThumb: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  resetBtn: {
    paddingHorizontal: spacing.xs,
  },
  segmentGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    marginBottom: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  optionThumb: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatchOption: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});
