import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ backendStatus, onOpenSettings }) {
  const getStatusIndicator = () => {
    if (backendStatus.loading) {
      return {
        color: colors.warning,
        text: 'Checking AI...',
      };
    }
    if (backendStatus.online) {
      if (backendStatus.modelsReady) {
        return {
          color: colors.success,
          text: 'AI Ready',
        };
      }
      return {
        color: colors.warning,
        text: 'Models Loading...',
      };
    }
    return {
      color: colors.danger,
      text: 'AI Offline',
    };
  };

  const status = getStatusIndicator();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoIcon}>
          <Text style={styles.sparkle}>✨</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>SkinAI</Text>
          <Text style={styles.brandSub}>Neural Diagnostics</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.statusBadge, { borderColor: status.color + '40' }]}
        onPress={onOpenSettings}
        activeOpacity={0.7}
      >
        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        <Ionicons name="settings-outline" size={12} color={colors.textMuted} style={styles.settingsIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorderGlow,
  },
  sparkle: {
    fontSize: 18,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandSub: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingsIcon: {
    marginLeft: 2,
  },
});
