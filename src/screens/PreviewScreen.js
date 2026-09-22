import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function PreviewScreen({ imageUri, onRetake, onAnalyze }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Review Your Photo</Text>
      <Text style={styles.subtitle}>
        Ensure your face is clearly visible, well-lit, and in focus before proceeding with neural analysis.
      </Text>

      {/* Image Preview Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        
        {/* Subtle decorative scan frame */}
        <View style={styles.overlayFrame} pointerEvents="none">
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <View style={styles.readyBadge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.readyText}>Ready for AI Diagnostics</Text>
        </View>
      </View>

      {/* Quality checklist */}
      <View style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark" size={16} color={colors.primary} />
          <Text style={styles.checkText}>Face is centered and front-facing</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark" size={16} color={colors.primary} />
          <Text style={styles.checkText}>Even lighting across both cheeks</Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark" size={16} color={colors.primary} />
          <Text style={styles.checkText}>No motion blur or obstructions</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={onRetake}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-reverse-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.retakeText}>Retake Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyzeButtonWrapper}
          onPress={onAnalyze}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyzeButton}
          >
            <Ionicons name="sparkles" size={18} color="#090b10" />
            <Text style={styles.analyzeText}>Analyze Skin</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 340,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  overlayFrame: {
    ...StyleSheet.absoluteFillObject,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
  },
  readyBadge: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 11, 16, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  readyText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  checklistCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retakeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButtonWrapper: {
    flex: 1.3,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeText: {
    color: '#090b10',
    fontSize: 15,
    fontWeight: '700',
  },
});
