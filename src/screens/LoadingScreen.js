import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';

const STATUS_STEPS = [
  'Uploading portrait to local AI engine...',
  'Executing ViT Transformer: Skin Type Detection...',
  'Analyzing Acne & Blemish severity patterns...',
  'Extracting MediaPipe Face Mesh landmarks...',
  'Processing OpenCV CIE LAB redness & pore sharpness...',
  'Synthesizing clinical diagnostic scores...',
  'Compiling tailored skincare routine recommendations...',
];

export default function LoadingScreen({ imageUri }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Laser scanning animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Step cycler
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < STATUS_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <View style={styles.container}>
      {/* Visual Scanning Container */}
      <Animated.View
        style={[
          styles.scanFrame,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.fallbackBox} />
        )}

        {/* Darkened overlay */}
        <View style={styles.darkOverlay} />

        {/* Moving Laser Line */}
        <Animated.View
          style={[
            styles.laserLine,
            { transform: [{ translateY: scanTranslateY }] },
          ]}
        />
      </Animated.View>

      {/* Futuristic Progress Information */}
      <View style={styles.textContainer}>
        <View style={styles.pulseDotRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.headline}>Running Neural Network Inference...</Text>
        </View>

        <Text style={styles.statusText}>{STATUS_STEPS[statusIndex]}</Text>

        <View style={styles.modelTags}>
          <Text style={styles.tag}>ViT Transformer</Text>
          <Text style={styles.tag}>MediaPipe</Text>
          <Text style={styles.tag}>OpenCV</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 36,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackBox: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceLight,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 11, 16, 0.45)',
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  pulseDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  headline: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    minHeight: 36,
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 16,
  },
  modelTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    fontSize: 10,
    color: colors.textMuted,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
});
