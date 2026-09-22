import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ovalWidth = Math.min(width * 0.74, 300);
const ovalHeight = Math.min(height * 0.44, 400);

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
      <View style={styles.centerContainer}>
        <View style={styles.permIconBox}>
          <Ionicons name="camera-outline" size={48} color={colors.primary} />
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          SkinAI uses real-time facial scanning to evaluate your skin health. Please allow camera access to continue.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.permButtonText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permCancel} onPress={onClose}>
          <Text style={styles.permCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
        alert('Could not take photo: ' + err.message);
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
    <View style={styles.fullScreen}>
      {/* 1. Full Screen Native Camera Preview Layer */}
      <CameraView
        style={styles.cameraStream}
        facing={facing}
        enableTorch={flash === 'on'}
        ref={cameraRef}
      />

      {/* 2. Top Header Controls (Anchored to top safe area) */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.circleButton} onPress={onClose} activeOpacity={0.75}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.scannerBadge}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.scannerBadgeText}>AI Live Scanner</Text>
        </View>

        <TouchableOpacity style={styles.circleButton} onPress={toggleFlash} activeOpacity={0.75}>
          <Ionicons
            name={flash === 'on' ? 'flash' : 'flash-off'}
            size={20}
            color={flash === 'on' ? '#f59e0b' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      {/* 3. Center Face Guide Oval (Anchored to optical upper-middle) */}
      <View style={styles.centerGuide} pointerEvents="none">
        <View style={styles.faceOval}>
          {/* Corner Reticles */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <View style={styles.tipBox}>
          <Ionicons name="sparkles" size={13} color={colors.primary} />
          <Text style={styles.tipText}>Center face • Keep natural lighting</Text>
        </View>
      </View>

      {/* 4. Bottom Shutter Dock Bar (Anchored strictly to bottom of screen) */}
      <View style={styles.bottomDock}>
        {/* Gallery Pick Shortcut */}
        <TouchableOpacity
          style={styles.sideDockAction}
          onPress={handlePickFromGallery}
          activeOpacity={0.7}
        >
          <View style={styles.sideIconCircle}>
            <Ionicons name="images-outline" size={22} color="#ffffff" />
          </View>
          <Text style={styles.sideDockLabel}>Gallery</Text>
        </TouchableOpacity>

        {/* Big High-Visibility Shutter Button */}
        <TouchableOpacity
          style={styles.shutterRing}
          onPress={handleCapture}
          disabled={capturing}
          activeOpacity={0.8}
        >
          <View style={styles.shutterInnerCircle}>
            {capturing ? (
              <ActivityIndicator size="small" color="#090b10" />
            ) : (
              <View style={styles.shutterCore} />
            )}
          </View>
        </TouchableOpacity>

        {/* Flip Camera */}
        <TouchableOpacity
          style={styles.sideDockAction}
          onPress={toggleFacing}
          activeOpacity={0.7}
        >
          <View style={styles.sideIconCircle}>
            <Ionicons name="camera-reverse-outline" size={24} color="#ffffff" />
          </View>
          <Text style={styles.sideDockLabel}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    width: width,
    height: height,
    backgroundColor: '#000000',
    position: 'relative',
  },
  cameraStream: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
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
    borderColor: 'rgba(0, 242, 254, 0.3)',
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

  // TOP HEADER (Absolute top)
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 36,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 20,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(9, 11, 16, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(9, 11, 16, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  scannerBadgeText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },

  // CENTER GUIDE (Absolute optical center)
  centerGuide: {
    position: 'absolute',
    top: height * 0.16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  faceOval: {
    width: ovalWidth,
    height: ovalHeight,
    borderRadius: ovalWidth / 2,
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.6)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: 'rgba(9, 11, 16, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tipText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },

  // BOTTOM DOCK (Absolute bottom)
  bottomDock: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    zIndex: 20,
  },
  sideDockAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  sideIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(9, 11, 16, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 4,
  },
  sideDockLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  shutterRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  shutterInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  shutterCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
  },
});
