import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen({ data, onNewScan }) {
  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No diagnostic results found.</Text>
        <TouchableOpacity style={styles.newScanBtn} onPress={onNewScan}>
          <Text style={styles.newScanText}>Start New Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const primary = data.primary_skin_type || {};
  const concerns = data.skin_concerns || {};
  const recommendations = data.recommendations || [];

  // Helper for meter bar color based on score (lower is usually clearer/calmer)
  const getMeterColor = (score) => {
    if (score < 25) return colors.success;
    if (score < 50) return colors.info;
    if (score < 75) return colors.warning;
    return colors.danger;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.headerTitle}>AI Skin Diagnostics</Text>
          <Text style={styles.headerSubtitle}>Complete Multi-Model Assessment</Text>
        </View>

        <TouchableOpacity style={styles.newScanBtn} onPress={onNewScan} activeOpacity={0.7}>
          <Ionicons name="scan-outline" size={16} color={colors.primary} />
          <Text style={styles.newScanText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Skin Type Banner */}
      <LinearGradient
        colors={['rgba(0, 242, 254, 0.18)', 'rgba(138, 43, 226, 0.15)']}
        style={styles.primaryTypeCard}
      >
        <View style={styles.badgeRow}>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>PRIMARY AI CLASSIFICATION</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {primary.confidence_percentage ? `${primary.confidence_percentage}% Confidence` : 'Verified'}
            </Text>
          </View>
        </View>

        <Text style={styles.skinTypeTitle}>{primary.type || 'Normal Skin'}</Text>
        <Text style={styles.modelTag}>{primary.model_used || 'dima806/skin_types_image_detection'}</Text>

        {/* Breakdown bars if present */}
        {primary.breakdown && (
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownLabel}>Classification Probabilities:</Text>
            {Object.entries(primary.breakdown).map(([typeKey, val]) => {
              const pct = Math.round(val * 100);
              return (
                <View key={typeKey} style={styles.breakdownRow}>
                  <Text style={styles.breakdownName}>{typeKey}</Text>
                  <View style={styles.breakdownBar}>
                    <View style={[styles.breakdownFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.breakdownPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        )}
      </LinearGradient>

      {/* Detected Concerns Section */}
      <Text style={styles.sectionTitle}>Detected Cosmetic Concerns</Text>
      <View style={styles.concernsGrid}>
        {/* 1. Acne */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>🔴</Text>
            <Text style={styles.concernTitle}>Acne / Blemishes</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.acne?.label || 'Clear Skin'}</Text>
          <Text style={styles.concernSub}>
            {concerns.acne?.confidence_percentage
              ? `${concerns.acne.confidence_percentage}% Confidence • skintelligent-acne`
              : 'Neural Assessment'}
          </Text>
        </View>

        {/* 2. Wrinkles */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>〰️</Text>
            <Text style={styles.concernTitle}>Wrinkles & Lines</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.wrinkles?.label || 'Smooth Skin'}</Text>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.wrinkles?.score || 15)}%`,
                  backgroundColor: getMeterColor(concerns.wrinkles?.score || 15),
                },
              ]}
            />
          </View>
          <Text style={styles.concernSub}>Score: {concerns.wrinkles?.score || 0}/100</Text>
        </View>

        {/* 3. Redness */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>🩹</Text>
            <Text style={styles.concernTitle}>Skin Redness</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.redness?.label || 'Minimal Redness'}</Text>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.redness?.score || 15)}%`,
                  backgroundColor: getMeterColor(concerns.redness?.score || 15),
                },
              ]}
            />
          </View>
          <Text style={styles.concernSub}>CIE LAB Score: {concerns.redness?.score || 0}/100</Text>
        </View>

        {/* 4. Oiliness */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>💧</Text>
            <Text style={styles.concernTitle}>Oiliness & Shine</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.oiliness?.label || 'Balanced'}</Text>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.oiliness?.score || 25)}%`,
                  backgroundColor: getMeterColor(concerns.oiliness?.score || 25),
                },
              ]}
            />
          </View>
          <Text style={styles.concernSub}>HSV Highlight: {concerns.oiliness?.score || 0}/100</Text>
        </View>

        {/* 5. Pores */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>🔬</Text>
            <Text style={styles.concernTitle}>Pores & Texture</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.pores_texture?.label || 'Refined Pores'}</Text>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.pores_texture?.score || 20)}%`,
                  backgroundColor: getMeterColor(concerns.pores_texture?.score || 20),
                },
              ]}
            />
          </View>
          <Text style={styles.concernSub}>Laplacian Score: {concerns.pores_texture?.score || 0}/100</Text>
        </View>

        {/* 6. Dark Spots */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <Text style={styles.concernIcon}>☀️</Text>
            <Text style={styles.concernTitle}>Dark Spots</Text>
          </View>
          <Text style={styles.concernLabel}>{concerns.dark_spots?.label || 'Even Tone'}</Text>
          <View style={styles.meterContainer}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.dark_spots?.score || 15)}%`,
                  backgroundColor: getMeterColor(concerns.dark_spots?.score || 15),
                },
              ]}
            />
          </View>
          <Text style={styles.concernSub}>Contrast Score: {concerns.dark_spots?.score || 0}/100</Text>
        </View>
      </View>

      {/* Product Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.recommendationsSection}>
          <View style={styles.recHeaderRow}>
            <Text style={styles.recIcon}>🧴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.recTitle}>Personalized Skincare Routine</Text>
              <Text style={styles.recSub}>Formulations targeted specifically to your scan</Text>
            </View>
          </View>

          <View style={styles.productsList}>
            {recommendations.map((prod, index) => (
              <View key={prod.id || index} style={styles.productCard}>
                <View style={styles.productTop}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{prod.badge || prod.category}</Text>
                  </View>
                  <Text style={styles.productPrice}>{prod.price}</Text>
                </View>

                <View style={styles.productNameRow}>
                  <Text style={styles.prodEmoji}>{prod.icon || '✨'}</Text>
                  <Text style={styles.productName}>{prod.name}</Text>
                </View>

                <Text style={styles.productTag}>{prod.tag}</Text>

                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>
                    {prod.rating} ({prod.reviews} reviews)
                  </Text>
                </View>

                <View style={styles.ingredientBox}>
                  <Text style={styles.ingredientLabel}>Key Actives:</Text>
                  <Text style={styles.ingredientVal}>{prod.key_ingredients}</Text>
                </View>

                <Text style={styles.reasonText}>💡 {prod.reason}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* New Scan Bottom CTA */}
      <TouchableOpacity style={styles.bottomCta} onPress={onNewScan} activeOpacity={0.85}>
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomCtaGradient}
        >
          <Ionicons name="camera" size={20} color="#090b10" />
          <Text style={styles.bottomCtaText}>Perform Another Scan</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    paddingBottom: 50,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  newScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  newScanText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryTypeCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorderGlow,
    padding: 20,
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confidenceBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  skinTypeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modelTag: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 16,
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
    gap: 8,
  },
  breakdownLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownName: {
    width: 80,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  breakdownBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  breakdownPct: {
    width: 36,
    textAlign: 'right',
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  concernsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  concernCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
  },
  concernTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  concernIcon: {
    fontSize: 16,
  },
  concernTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  concernLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  meterContainer: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  concernSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  recommendationsSection: {
    marginBottom: 28,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  recIcon: {
    fontSize: 26,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productsList: {
    gap: 14,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  productTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  productPrice: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  prodEmoji: {
    fontSize: 18,
  },
  productName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  productTag: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  ratingText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  ingredientBox: {
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ingredientVal: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  reasonText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bottomCta: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  bottomCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    gap: 8,
  },
  bottomCtaText: {
    color: '#090b10',
    fontSize: 15,
    fontWeight: '700',
  },
});
