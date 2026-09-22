import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ovalWidth = Math.min(width * 0.76, 320);
const ovalHeight = Math.min(height * 0.44, 420);

export default function CameraScreen({ onClose, onPhotoCaptured }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [flash, setFlash] = useState('off');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.permIconBox}>
          <Ionicons name="camera-outline" size={48} color={colors.primary} />
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          SkinAI uses real-time facial scanning to analyze your skin type and health. Please enable camera access to continue.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.permButtonText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permCancel} onPress={onClose}>
          <Text style={styles.permCancelText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleFacing = () => {
    setFacing((current) => (current === 'front' ? 'back' : 'front'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const handleCapture = async () => {
    if (cameraRef.current && !capturing) {
      try {
        setCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          base64: true,
          skipProcessing: false,
        });

        if (photo && photo.uri) {
          onPhotoCaptured({
            uri: photo.uri,
            base64: photo.base64,
          });
        }
      } catch (err) {
        alert('Could not capture photo: ' + err.message);
      } finally {
        setCapturing(false);
      }
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        onPhotoCaptured({
          uri: res.assets[0].uri,
          base64: res.assets[0].base64,
        });
      }
    } catch (err) {
      alert('Failed to select photo: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Underlying Native Camera Stream (Zero children to avoid iOS layout clipping) */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={flash === 'on'}
        ref={cameraRef}
      />

      {/* 2. Top-level Floating Overlay Container */}
      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Header Controls */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.circleBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.statusPill}>
            <View style={styles.liveIndicator} />
            <Text style={styles.statusPillText}>AI Facial Scanner</Text>
          </View>

          <View style={styles.topRightGroup}>
            <TouchableOpacity style={styles.circleBtn} onPress={toggleFlash} activeOpacity={0.7}>
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={20}
                color={flash === 'on' ? '#f59e0b' : '#ffffff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Face Alignment Oval Guide */}
        <View style={styles.centerArea} pointerEvents="none">
          <View style={styles.faceOval}>
            {/* Elegant Corner Reticles */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.tipBubble}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.tipText}>Center your face • Natural lighting</Text>
          </View>
        </View>

        {/* Bottom Shutter Dock Bar */}
        <View style={styles.bottomDock}>
          {/* Gallery Pick Shortcut */}
          <TouchableOpacity
            style={styles.dockSideBtn}
            onPress={handlePickFromGallery}
            activeOpacity={0.75}
          >
            <View style={styles.dockIconCircle}>
              <Ionicons name="images" size={22} color="#ffffff" />
            </View>
            <Text style={styles.dockBtnLabel}>Gallery</Text>
          </TouchableOpacity>

          {/* Prominent High-Visibility Shutter Button */}
          <TouchableOpacity
            style={styles.shutterRing}
            onPress={handleCapture}
            disabled={capturing}
            activeOpacity={0.8}
          >
            <View style={styles.shutterCenter}>
              {capturing ? (
                <ActivityIndicator size="small" color="#090b10" />
              ) : (
                <View style={styles.shutterInnerDot} />
              )}
            </View>
          </TouchableOpacity>

          {/* Flip Camera */}
          <TouchableOpacity
            style={styles.dockSideBtn}
            onPress={toggleFacing}
            activeOpacity={0.75}
          >
            <View style={styles.dockIconCircle}>
              <Ionicons name="camera-reverse" size={22} color="#ffffff" />
            </View>
            <Text style={styles.dockBtnLabel}>Flip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0c0e14',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  permTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 10,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  permButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  permButtonText: {
    color: '#090b10',
    fontWeight: '700',
    fontSize: 16,
  },
  permCancel: {
    marginTop: 16,
    padding: 10,
  },
  permCancelText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 14, 20, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 14, 20, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    gap: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusPillText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOval: {
    width: ovalWidth,
    height: ovalHeight,
    borderRadius: ovalWidth / 2,
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.55)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: -3,
    left: -3,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: -3,
    right: -3,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  tipBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    backgroundColor: 'rgba(12, 14, 20, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
    paddingTop: 16,
    backgroundColor: 'rgba(9, 11, 16, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  dockSideBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dockIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  dockBtnLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  shutterRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterCenter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  shutterInnerDot: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
  },
});
