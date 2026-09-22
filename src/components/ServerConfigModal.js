import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { colors } from '../theme/colors';
import { checkHealth, getServerUrl, setServerUrl } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ServerConfigModal({ visible, onClose, onServerUpdated }) {
  const [urlInput, setUrlInput] = useState(getServerUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    Keyboard.dismiss();
    setTesting(true);
    setTestResult(null);

    const res = await checkHealth(urlInput.trim());
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    const updated = setServerUrl(urlInput);
    if (onServerUpdated) onServerUpdated(updated);
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = 'http://192.168.18.8:8000';
    setUrlInput(defaultUrl);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Ionicons name="server-outline" size={20} color={colors.primary} />
                <Text style={styles.title}>AI Server Settings</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              Configure the host URL of your Python AI backend. Ensure your phone and PC are connected to the same Wi-Fi.
            </Text>

            <Text style={styles.inputLabel}>Backend Server URL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="http://192.168.x.x:8000"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetBtnText}>Default</Text>
              </TouchableOpacity>
            </View>

            {/* Ping Result Box */}
            {testResult && (
              <View
                style={[
                  styles.resultBox,
                  testResult.success ? styles.resultSuccess : styles.resultError,
                ]}
              >
                <Ionicons
                  name={testResult.success ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={testResult.success ? colors.success : colors.danger}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.resultTitle,
                      { color: testResult.success ? colors.success : colors.danger },
                    ]}
                  >
                    {testResult.success
                      ? `Connected! (${testResult.latency}ms)`
                      : 'Connection Failed'}
                  </Text>
                  <Text style={styles.resultDetails}>
                    {testResult.success
                      ? testResult.data.models_ready
                        ? 'All AI Vision models loaded & ready'
                        : 'Connected (Deep learning models still initializing)'
                      : testResult.error}
                  </Text>
                </View>
              </View>
            )}

            {/* Quick troubleshooting tips */}
            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>Troubleshooting Tips:</Text>
              <Text style={styles.tipItem}>• Both PC and Phone must share the same Wi-Fi.</Text>
              <Text style={styles.tipItem}>• Run `start_server.bat` on your PC first.</Text>
              <Text style={styles.tipItem}>• Windows Firewall must allow incoming port 8000.</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={handleTest}
                disabled={testing}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.testBtnText}>Test Connection</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save & Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    color: colors.textPrimary,
    fontSize: 14,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  resetBtnText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  resultSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultDetails: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tipItem: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  testBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  saveBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#090b10',
    fontWeight: '700',
    fontSize: 13,
  },
});
