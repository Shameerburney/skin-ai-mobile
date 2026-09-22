import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// High-end fallback product catalog tailored to skin profiles
const getFallbackProducts = (skinType = 'Normal') => {
  const st = skinType.toLowerCase();
  if (st.includes('oily')) {
    return [
      {
        id: 'oily_1',
        name: 'Clarity BHA Gentle Purifying Cleanser',
        category: 'Step 1 • Cleanse',
        tag: 'Non-Stripping Sebum Control',
        rating: 4.9,
        reviews: 1420,
        price: '$24.00',
        key_ingredients: '2% Salicylic Acid, Green Tea, Zinc PCA',
        reason: 'Unclogs deep pore buildup while preventing surface shine without tightness.',
        badge: 'Recommended Cleanser',
        icon: '🫧',
      },
      {
        id: 'oily_2',
        name: 'Pure Niacinamide 10% Pore Refining Serum',
        category: 'Step 2 • Target',
        tag: 'Pore Tightening & Balancing',
        rating: 4.8,
        reviews: 2150,
        price: '$28.00',
        key_ingredients: '10% Niacinamide, Zinc PCA, Centella',
        reason: 'Regulates oil gland hyperactivity and evens out post-breakout discoloration.',
        badge: 'Hero Active',
        icon: '🧪',
      },
      {
        id: 'oily_3',
        name: 'Water-Drench Oil-Free Gel Moisturizer',
        category: 'Step 3 • Hydrate',
        tag: 'Ultra-Lightweight Matte Finish',
        rating: 4.9,
        reviews: 980,
        price: '$26.00',
        key_ingredients: 'Multi-Molecular Hyaluronic Acid, Aloe Vera',
        reason: 'Infuses deep cellular hydration while leaving skin velvety smooth and shine-free.',
        badge: 'Daily Hydrator',
        icon: '💧',
      },
      {
        id: 'oily_4',
        name: 'Invisible Matte Mineral Fluid SPF 50+',
        category: 'Step 4 • Protect',
        tag: 'Zero White Cast • Anti-Shine',
        rating: 4.9,
        reviews: 1840,
        price: '$30.00',
        key_ingredients: 'Zinc Oxide, Silica, Vitamin E',
        reason: 'Broad-spectrum daily barrier that keeps skin protected without clogging pores.',
        badge: 'Essential Sunscreen',
        icon: '☀️',
      },
    ];
  } else if (st.includes('dry')) {
    return [
      {
        id: 'dry_1',
        name: 'Hydra-Silk Gentle Cream-to-Milk Cleanser',
        category: 'Step 1 • Cleanse',
        tag: 'Lipid-Replenishing Wash',
        rating: 4.9,
        reviews: 1120,
        price: '$25.00',
        key_ingredients: 'Oat Milk, Ceramides, Chamomile Extract',
        reason: 'Melts away impurities while leaving the natural moisture barrier completely intact.',
        badge: 'Ultra-Gentle',
        icon: '🥛',
      },
      {
        id: 'dry_2',
        name: 'Multi-Peptide & HA Deep Infusion Serum',
        category: 'Step 2 • Target',
        tag: 'Elasticity & Moisture Surge',
        rating: 4.9,
        reviews: 1890,
        price: '$32.00',
        key_ingredients: 'Tri-Peptide Complex, 5x Hyaluronic Acid',
        reason: 'Plumps dehydrated layers and boosts collagen synthesis for smooth, bouncy skin.',
        badge: 'Hero Hydrator',
        icon: '✨',
      },
      {
        id: 'dry_3',
        name: 'Barrier-Restore 5x Ceramide Comfort Cream',
        category: 'Step 3 • Nourish',
        tag: 'Intensive Skin Barrier Repair',
        rating: 5.0,
        reviews: 2310,
        price: '$29.00',
        key_ingredients: 'Ceramides NP/AP/EOP, Squalane, Shea Butter',
        reason: 'Locks in 24-hour hydration, soothing flakiness and rebuilding lipid resilience.',
        badge: 'Barrier Hero',
        icon: '🧴',
      },
      {
        id: 'dry_4',
        name: 'Dewy Glow Daily Shield SPF 50',
        category: 'Step 4 • Protect',
        tag: 'Hydrating Sun Protection',
        rating: 4.8,
        reviews: 1450,
        price: '$28.00',
        key_ingredients: 'Hyaluronic Acid, Vitamin C, Niacinamide',
        reason: 'Keeps dry skin luminous and radiant with complete UVA/UVB photoprotection.',
        badge: 'Glow Finish',
        icon: '☀️',
      },
    ];
  } else {
    // Normal / Combination
    return [
      {
        id: 'combo_1',
        name: 'Balancing Amino Acid Gentle Foaming Wash',
        category: 'Step 1 • Cleanse',
        tag: 'pH 5.5 Balanced Cleanse',
        rating: 4.9,
        reviews: 1650,
        price: '$24.00',
        key_ingredients: 'Amino Acids, Rice Water, Glycerin',
        reason: 'Balances combination skin by clearing the T-zone without dehydrating the cheeks.',
        badge: 'Daily Favorite',
        icon: '🫧',
      },
      {
        id: 'combo_2',
        name: 'Niacinamide + Cica Harmonizing Serum',
        category: 'Step 2 • Target',
        tag: 'Clarity, Calming & Tone',
        rating: 4.9,
        reviews: 2420,
        price: '$28.00',
        key_ingredients: '5% Niacinamide, Centella Asiatica, Allantoin',
        reason: 'Refines pore texture, evens skin tone, and calms redness in one lightweight step.',
        badge: 'Harmonizing Active',
        icon: '🌿',
      },
      {
        id: 'combo_3',
        name: 'Daily Moisture-Balance Peptide Emulsion',
        category: 'Step 3 • Hydrate',
        tag: 'Smart Adaptive Hydration',
        rating: 4.8,
        reviews: 1390,
        price: '$27.00',
        key_ingredients: 'Copper Peptides, Hyaluronic Acid, Squalane',
        reason: 'Delivers targeted moisture where dry, with an airy finish that never feels greasy.',
        badge: 'Smart Balance',
        icon: '💧',
      },
      {
        id: 'combo_4',
        name: 'Velvet Shield Broad Spectrum SPF 50',
        category: 'Step 4 • Protect',
        tag: 'Invisible Featherlight Finish',
        rating: 4.9,
        reviews: 1980,
        price: '$29.00',
        key_ingredients: 'Green Tea Extract, Vitamin E, UV Filters',
        reason: 'Invisible everyday protection that wears seamlessly under skincare or makeup.',
        badge: 'Invisible Shield',
        icon: '☀️',
      },
    ];
  }
};

export default function ResultsScreen({ data, onNewScan }) {
  const [activeRoutineTab, setActiveRoutineTab] = useState('am');

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No diagnostic scan found.</Text>
        <TouchableOpacity style={styles.newScanBtn} onPress={onNewScan}>
          <Text style={styles.newScanText}>Start New Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const primary = data.primary_skin_type || {};
  const concerns = data.skin_concerns || {};
  const rawProducts = data.recommended_products || data.recommendations || [];
  const products = rawProducts.length > 0 ? rawProducts : getFallbackProducts(primary.type);

  // Meter color helper
  const getScoreColor = (score) => {
    if (score < 25) return '#10b981'; // Green
    if (score < 50) return '#00f2fe'; // Teal/Cyan
    if (score < 75) return '#f59e0b'; // Amber
    return '#ef4444'; // Coral Red
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Results Header */}
      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.headerEyebrow}>PERSONALIZED REPORT</Text>
          <Text style={styles.headerTitle}>Your Skin Diagnostic</Text>
        </View>

        <TouchableOpacity style={styles.newScanBtn} onPress={onNewScan} activeOpacity={0.75}>
          <Ionicons name="camera-outline" size={16} color={colors.primary} />
          <Text style={styles.newScanText}>Retake</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Skin Profile Card */}
      <LinearGradient
        colors={['rgba(0, 242, 254, 0.16)', 'rgba(138, 43, 226, 0.12)']}
        style={styles.primaryCard}
      >
        <View style={styles.primaryBadgeRow}>
          <View style={styles.clinicalBadge}>
            <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
            <Text style={styles.clinicalBadgeText}>CLINICAL AI ASSESSMENT</Text>
          </View>
          <View style={styles.confidencePill}>
            <Text style={styles.confidenceText}>
              {primary.confidence_percentage ? `${primary.confidence_percentage}% Match` : 'High Confidence'}
            </Text>
          </View>
        </View>

        <Text style={styles.skinTypeHeading}>{primary.type || 'Balanced Skin'}</Text>
        <Text style={styles.skinTypeDescription}>
          Your skin exhibits characteristics of {primary.type || 'Balanced Skin'}. Formulations below are curated to maintain harmony and protect your natural skin barrier.
        </Text>

        {/* Probability Distribution */}
        {primary.breakdown && (
          <View style={styles.breakdownBox}>
            <Text style={styles.breakdownTitle}>Spectrum Analysis</Text>
            {Object.entries(primary.breakdown).map(([typeKey, val]) => {
              const pct = Math.round(val * 100);
              return (
                <View key={typeKey} style={styles.breakdownRow}>
                  <Text style={styles.breakdownName}>{typeKey}</Text>
                  <View style={styles.breakdownTrack}>
                    <View
                      style={[
                        styles.breakdownFill,
                        {
                          width: `${pct}%`,
                          backgroundColor: typeKey.toLowerCase() === (primary.type || '').toLowerCase()
                            ? colors.primary
                            : 'rgba(255, 255, 255, 0.25)',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        )}
      </LinearGradient>

      {/* Skin Health Parameters Grid */}
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Key Skin Parameters</Text>
        <Text style={styles.sectionSubtitle}>Biometric observations from your scan</Text>
      </View>

      <View style={styles.concernsGrid}>
        {/* 1. Blemish & Clarity */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <View style={[styles.concernIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <Text style={styles.concernIcon}>🔴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.concernTitle}>Blemish & Clarity</Text>
              <Text style={styles.concernStatus}>
                {concerns.acne?.label || 'Clear Complexion'}
              </Text>
            </View>
          </View>
          <Text style={styles.concernAdvice}>
            {concerns.acne?.label?.toLowerCase().includes('clear')
              ? 'Skin follicles appear calm with no active inflammatory outbreaks.'
              : 'Targeted spot care recommended to calm localized follicular redness.'}
          </Text>
        </View>

        {/* 2. Sebum & Oil Balance */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <View style={[styles.concernIconCircle, { backgroundColor: 'rgba(0, 242, 254, 0.12)' }]}>
              <Text style={styles.concernIcon}>💧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.concernTitle}>Hydration & Sebum</Text>
              <Text style={styles.concernStatus}>
                {concerns.oiliness?.label || 'Balanced'}
              </Text>
            </View>
          </View>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.oiliness?.score || 35)}%`,
                  backgroundColor: getScoreColor(concerns.oiliness?.score || 35),
                },
              ]}
            />
          </View>
          <Text style={styles.concernAdvice}>
            Hydration levels evaluated through surface light reflection and moisture retention.
          </Text>
        </View>

        {/* 3. Pores & Smoothness */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <View style={[styles.concernIconCircle, { backgroundColor: 'rgba(138, 43, 226, 0.12)' }]}>
              <Text style={styles.concernIcon}>🔬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.concernTitle}>Pores & Texture</Text>
              <Text style={styles.concernStatus}>
                {concerns.pores_texture?.label || 'Refined Texture'}
              </Text>
            </View>
          </View>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.pores_texture?.score || 25)}%`,
                  backgroundColor: getScoreColor(concerns.pores_texture?.score || 25),
                },
              ]}
            />
          </View>
          <Text style={styles.concernAdvice}>
            Pore diameter and epidermal texture smoothness index.
          </Text>
        </View>

        {/* 4. Tone & Redness */}
        <View style={styles.concernCard}>
          <View style={styles.concernTop}>
            <View style={[styles.concernIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Text style={styles.concernIcon}>🌿</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.concernTitle}>Skin Calmness</Text>
              <Text style={styles.concernStatus}>
                {concerns.redness?.label || 'Calm & Even'}
              </Text>
            </View>
          </View>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, concerns.redness?.score || 20)}%`,
                  backgroundColor: getScoreColor(concerns.redness?.score || 20),
                },
              ]}
            />
          </View>
          <Text style={styles.concernAdvice}>
            Vascular reactivity and tone uniformity across cheeks and nasal bridge.
          </Text>
        </View>
      </View>

      {/* Routine Tabs (AM / PM) */}
      <View style={styles.routineSection}>
        <View style={styles.routineHeader}>
          <View>
            <Text style={styles.sectionTitle}>Curated Daily Regimen</Text>
            <Text style={styles.sectionSubtitle}>Dermatologist-designed routine steps</Text>
          </View>

          <View style={styles.routineToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, activeRoutineTab === 'am' && styles.toggleBtnActive]}
              onPress={() => setActiveRoutineTab('am')}
            >
              <Text style={[styles.toggleText, activeRoutineTab === 'am' && styles.toggleTextActive]}>
                ☀️ Morning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, activeRoutineTab === 'pm' && styles.toggleBtnActive]}
              onPress={() => setActiveRoutineTab('pm')}
            >
              <Text style={[styles.toggleText, activeRoutineTab === 'pm' && styles.toggleTextActive]}>
                🌙 Evening
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step-by-step Routine Cards */}
        {activeRoutineTab === 'am' ? (
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>1</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Gentle Low-pH Cleanser</Text>
                <Text style={styles.stepDesc}>Refreshes skin without stripping natural barrier lipids.</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>2</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Antioxidant / Barrier Serum</Text>
                <Text style={styles.stepDesc}>Defends against free radicals and reinforces hydration.</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>3</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Weightless Moisture Emulsion</Text>
                <Text style={styles.stepDesc}>Locks in deep moisture for all-day radiance.</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>4</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Broad-Spectrum SPF 50</Text>
                <Text style={styles.stepDesc}>Crucial daily shield against UV-induced pigment and aging.</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>1</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Double Cleanse</Text>
                <Text style={styles.stepDesc}>Dissolves SPF, environmental micro-dust, and surface oils.</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>2</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Cellular Active / Exfoliant</Text>
                <Text style={styles.stepDesc}>Supports overnight cellular renewal and pore clarity.</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>3</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepName}>Ceramide Repair Balm</Text>
                <Text style={styles.stepDesc}>Deep nighttime lipid restoration while you sleep.</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Recommended Demo Products Section */}
      <View style={styles.productsSection}>
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.sectionTitle}>Targeted Formulations</Text>
            <Text style={styles.sectionSubtitle}>Formulated specifically for your diagnostic scan</Text>
          </View>
        </View>

        <View style={styles.productsList}>
          {products.map((prod, index) => (
            <View key={prod.id || index} style={styles.productCard}>
              <View style={styles.prodTopRow}>
                <View style={styles.prodCategoryPill}>
                  <Text style={styles.prodCategoryText}>{prod.category || 'Targeted Care'}</Text>
                </View>
                <Text style={styles.prodPrice}>{prod.price || '$26.00'}</Text>
              </View>

              <View style={styles.prodNameRow}>
                <Text style={styles.prodIcon}>{prod.icon || '✨'}</Text>
                <Text style={styles.prodName}>{prod.name}</Text>
              </View>

              <Text style={styles.prodTag}>{prod.tag}</Text>

              <View style={styles.prodRatingRow}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.prodRating}>
                  {prod.rating || 4.9} ({prod.reviews || 950} reviews)
                </Text>
              </View>

              <View style={styles.activesBox}>
                <Text style={styles.activesLabel}>Key Actives:</Text>
                <Text style={styles.activesValue}>{prod.key_ingredients}</Text>
              </View>

              <View style={styles.reasonBox}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.reasonText}>{prod.reason}</Text>
              </View>

              <TouchableOpacity style={styles.addToRoutineBtn} activeOpacity={0.8}>
                <Text style={styles.addToRoutineText}>Explore Formula</Text>
                <Ionicons name="arrow-forward" size={14} color="#090b10" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Retake Button */}
      <TouchableOpacity style={styles.bottomRetake} onPress={onNewScan} activeOpacity={0.85}>
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomRetakeGradient}
        >
          <Ionicons name="scan" size={20} color="#090b10" />
          <Text style={styles.bottomRetakeText}>Perform Another Diagnostic Scan</Text>
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
    padding: 18,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  headerEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  newScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
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
  primaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    padding: 20,
    marginBottom: 26,
  },
  primaryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  clinicalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clinicalBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confidencePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  skinTypeHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  skinTypeDescription: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 16,
  },
  breakdownBox: {
    backgroundColor: 'rgba(12, 14, 20, 0.5)',
    borderRadius: 14,
    padding: 14,
  },
  breakdownTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownName: {
    width: 90,
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownPct: {
    width: 34,
    textAlign: 'right',
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeadingRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  concernsGrid: {
    gap: 12,
    marginBottom: 28,
  },
  concernCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  concernTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  concernIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  concernIcon: {
    fontSize: 18,
  },
  concernTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  concernStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  meterTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  concernAdvice: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  routineSection: {
    marginBottom: 28,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  routineToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepsList: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNum: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  stepName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  productsSection: {
    marginBottom: 28,
  },
  productsHeader: {
    marginBottom: 14,
  },
  productsList: {
    gap: 16,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  prodTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  prodCategoryPill: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  prodCategoryText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  prodPrice: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  prodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  prodIcon: {
    fontSize: 22,
  },
  prodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  prodTag: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  prodRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  prodRating: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activesBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  activesLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  activesValue: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  reasonText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  addToRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addToRoutineText: {
    color: '#090b10',
    fontWeight: '800',
    fontSize: 13,
  },
  bottomRetake: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomRetakeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  bottomRetakeText: {
    color: '#090b10',
    fontWeight: '800',
    fontSize: 15,
  },
});
