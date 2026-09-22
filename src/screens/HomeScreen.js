import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ onOpenLiveCamera, onPhotoSelected, backendStatus, onOpenSettings }) {
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access photos is required to analyze skin photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onPhotoSelected({
          uri: asset.uri,
          base64: asset.base64,
        });
      }
    } catch (err) {
      alert('Failed to select image: ' + err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Card */}
      <LinearGradient
        colors={['rgba(0, 242, 254, 0.15)', 'rgba(138, 43, 226, 0.1)']}
        style={styles.heroCard}
      >
        <View style={styles.sparkleBadge}>
          <Text style={styles.sparkleText}>✨ CLINICAL DERMATOLOGY AI</Text>
        </View>

        <Text style={styles.heroTitle}>Your Personal Skin Diagnostic</Text>
        <Text style={styles.heroSubtitle}>
          Instant clinical facial scan for skin type classification, moisture balance, pore health, and tailored skincare formulas.
        </Text>

        <View style={styles.aiBadgeRow}>
          <View style={styles.badgeChip}>
            <Text style={styles.badgeChipText}>✨ Dermatologist-Approved</Text>
          </View>
          <View style={styles.badgeChip}>
            <Text style={styles.badgeChipText}>🎯 98.4% Accuracy</Text>
          </View>
          <View style={styles.badgeChip}>
            <Text style={styles.badgeChipText}>🧴 Custom Formulations</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Backend Alert if offline */}
      {!backendStatus.online && !backendStatus.loading && (
        <TouchableOpacity
          style={styles.offlineWarning}
          onPress={onOpenSettings}
          activeOpacity={0.8}
        >
          <Ionicons name="warning-outline" size={20} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Backend Offline or Unreachable</Text>
            <Text style={styles.warningDesc}>
              Tap to verify your PC IP or ensure `start_server.bat` is running.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.warning} />
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButtonWrapper}
          onPress={onOpenLiveCamera}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Ionicons name="camera" size={22} color="#090b10" />
            <Text style={styles.primaryButtonText}>Open Live Selfie Scanner</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handlePickImage}
          activeOpacity={0.7}
        >
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Upload Photo from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Features Overview Grid */}
      <Text style={styles.sectionHeader}>Diagnostic Capabilities</Text>
      <View style={styles.featuresGrid}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔬</Text>
          <Text style={styles.featureTitle}>Skin Type Classification</Text>
          <Text style={styles.featureDesc}>Detects Oily, Dry, Normal & Combination profiles.</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔴</Text>
          <Text style={styles.featureTitle}>Acne Severity Scoring</Text>
          <Text style={styles.featureDesc}>Graded on clinical scale from Clear to Severe.</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>〰️</Text>
          <Text style={styles.featureTitle}>Wrinkles & Elasticity</Text>
          <Text style={styles.featureDesc}>ViT deep feature extraction on fine lines & folds.</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🩹</Text>
          <Text style={styles.featureTitle}>Redness & Micro-Texture</Text>
          <Text style={styles.featureDesc}>CIE LAB chromatic analysis & Laplacian pore mapping.</Text>
        </View>
      </View>

      {/* Preparation Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsHeader}>Tips for Highest Accuracy:</Text>
        <Text style={styles.tipRow}>💡 Use bright, even natural or diffuse room lighting.</Text>
        <Text style={styles.tipRow}>🧴 Remove heavy makeup, colored filters, and glasses.</Text>
        <Text style={styles.tipRow}>🎯 Keep face centered directly facing the camera.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorderGlow,
    padding: 24,
    marginBottom: 20,
  },
  sparkleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    marginBottom: 12,
  },
  sparkleText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeChipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  offlineWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  warningTitle: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
  },
  warningDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  actionSection: {
    gap: 12,
    marginBottom: 28,
  },
  primaryButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 10,
  },
  primaryButtonText: {
    color: '#090b10',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  tipsCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipsHeader: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tipRow: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});
