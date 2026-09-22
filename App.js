import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from './src/theme/colors';
import Header from './src/components/Header';
import Stepper from './src/components/Stepper';
import ServerConfigModal from './src/components/ServerConfigModal';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { checkHealth, analyzeSkin, getServerUrl } from './src/services/api';

export default function App() {
  // Navigation states: 'home' | 'camera' | 'preview' | 'loading' | 'results'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [capturedPhoto, setCapturedPhoto] = useState(null); // { uri, base64 }
  const [analysisResults, setAnalysisResults] = useState(null);
  const [serverModalVisible, setServerModalVisible] = useState(false);

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    modelsReady: false,
    loading: true,
  });

  const pollBackendHealth = async () => {
    const res = await checkHealth();
    if (res.success) {
      setBackendStatus({
        online: true,
        modelsReady: res.data?.models_ready ?? true,
        loading: false,
      });
    } else {
      setBackendStatus({
        online: false,
        modelsReady: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    pollBackendHealth();
    const interval = setInterval(pollBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Determine current stepper progress number
  const getStepNumber = () => {
    switch (currentScreen) {
      case 'home':
      case 'camera':
        return 1;
      case 'preview':
        return 2;
      case 'loading':
        return 3;
      case 'results':
        return 4;
      default:
        return 1;
    }
  };

  const handlePhotoCaptured = (photo) => {
    setCapturedPhoto(photo);
    setCurrentScreen('preview');
  };

  const handlePhotoSelected = (photo) => {
    setCapturedPhoto(photo);
    setCurrentScreen('preview');
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCurrentScreen('home');
  };

  const handleStartAnalysis = async () => {
    if (!capturedPhoto || !capturedPhoto.base64) {
      Alert.alert('Error', 'No photo available to analyze. Please take or choose a photo.');
      return;
    }

    setCurrentScreen('loading');

    try {
      const data = await analyzeSkin(capturedPhoto.base64);
      setAnalysisResults(data);
      setCurrentScreen('results');
    } catch (err) {
      Alert.alert(
        'AI Analysis Failed',
        `${err.message}\n\nPlease check that your backend server is running on ${getServerUrl()} and that both devices are on the same Wi-Fi network.`,
        [
          { text: 'Server Settings', onPress: () => setServerModalVisible(true) },
          { text: 'Back to Preview', onPress: () => setCurrentScreen('preview') },
        ]
      );
    }
  };

  const handleNewScan = () => {
    setCapturedPhoto(null);
    setAnalysisResults(null);
    setCurrentScreen('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* When camera is open, show full-screen camera without header */}
      {currentScreen === 'camera' ? (
        <CameraScreen
          onClose={() => setCurrentScreen('home')}
          onPhotoCaptured={handlePhotoCaptured}
        />
      ) : (
        <View style={styles.container}>
          {/* Top Brand & Status Header */}
          <Header
            backendStatus={backendStatus}
            onOpenSettings={() => setServerModalVisible(true)}
          />

          {/* 4-Step Progress Indicator */}
          <Stepper currentStep={getStepNumber()} />

          {/* Screen Content */}
          <View style={styles.screenWrapper}>
            {currentScreen === 'home' && (
              <HomeScreen
                onOpenLiveCamera={() => setCurrentScreen('camera')}
                onPhotoSelected={handlePhotoSelected}
                backendStatus={backendStatus}
                onOpenSettings={() => setServerModalVisible(true)}
              />
            )}

            {currentScreen === 'preview' && (
              <PreviewScreen
                imageUri={capturedPhoto?.uri}
                onRetake={handleRetake}
                onAnalyze={handleStartAnalysis}
              />
            )}

            {currentScreen === 'loading' && (
              <LoadingScreen imageUri={capturedPhoto?.uri} />
            )}

            {currentScreen === 'results' && (
              <ResultsScreen
                data={analysisResults}
                onNewScan={handleNewScan}
              />
            )}
          </View>
        </View>
      )}

      {/* Server Config & Diagnostic Modal */}
      <ServerConfigModal
        visible={serverModalVisible}
        onClose={() => setServerModalVisible(false)}
        onServerUpdated={() => pollBackendHealth()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
