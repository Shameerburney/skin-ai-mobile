import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
        <Ionicons name="camera-outline" size={64} color={colors.primary} />
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          To perform real-time facial skin diagnostics, please allow camera permission.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permCancel} onPress={onClose}>
          <Text style={styles.permCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
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
        alert('Failed to capture photo: ' + err.message);
      } finally {
        setCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={flash === 'on'}
        ref={cameraRef}
      >
        {/* Top Controls Overlay */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.topRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={22}
                color={flash === 'on' ? colors.warning : '#ffffff'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleFacing}>
              <Ionicons name="camera-reverse-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Face Alignment Oval Guide */}
        <View style={styles.guideContainer} pointerEvents="none">
          <View style={styles.faceOval}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.guideText}>Center your face within the frame</Text>
        </View>

        {/* Bottom Shutter Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.shutterOuter}>
            <TouchableOpacity
              style={styles.shutterInner}
              onPress={handleCapture}
              disabled={capturing}
              activeOpacity={0.7}
            >
              {capturing ? (
                <ActivityIndicator size="small" color="#090b10" />
              ) : (
                <View style={styles.shutterDot} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const ovalWidth = width * 0.72;
const ovalHeight = height * 0.46;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  permDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  permButtonText: {
    color: '#090b10',
    fontWeight: '700',
    fontSize: 15,
  },
  permCancel: {
    marginTop: 14,
    padding: 8,
  },
  permCancelText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  topRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  guideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOval: {
    width: ovalWidth,
    height: ovalHeight,
    borderRadius: ovalWidth / 2,
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.7)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.primary,
  },
  guideText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
});
