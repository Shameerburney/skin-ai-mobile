import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Stepper({ currentStep }) {
  const steps = [
    { num: 1, label: 'Photo' },
    { num: 2, label: 'Review' },
    { num: 3, label: 'Scanning' },
    { num: 4, label: 'Report' },
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = step.num === currentStep;
        const isPassed = step.num < currentStep;

        return (
          <React.Fragment key={step.num}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isPassed && styles.circlePassed,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    isActive && styles.circleTextActive,
                    isPassed && styles.circleTextPassed,
                  ]}
                >
                  {isPassed ? '✓' : step.num}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  isPassed && styles.labelPassed,
                ]}
              >
                {step.label}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  step.num < currentStep && styles.connectorPassed,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: 'center',
    width: 60,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  circlePassed: {
    borderColor: colors.success,
    backgroundColor: colors.successGlow,
  },
  circleText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  circleTextActive: {
    color: colors.primary,
  },
  circleTextPassed: {
    color: colors.success,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.textPrimary,
  },
  labelPassed: {
    color: colors.textSecondary,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.surfaceLight,
    marginBottom: 16,
    marginHorizontal: -4,
  },
  connectorPassed: {
    backgroundColor: colors.success,
  },
});
