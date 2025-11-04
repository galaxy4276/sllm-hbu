import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
  TypographyColor,
} from '../../types/typography';
import { useTypographyStyles } from './Typography.styles';

const Typography = React.forwardRef<any, TypographyProps>(({
  children,
  variant = 'p',
  weight,
  color = 'primary',
  align,
  decoration,
  transform,
  display,
  numberOfLines,
  selectable = true,
  ellipsizeMode = 'tail',
  testID,
  style,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  fontFamily,
}, ref) => {
  // Apply styles based on props
  const styles = useTypographyStyles(
    variant,
    weight,
    color,
    align,
    decoration,
    transform,
    display,
    fontFamily,
    style
  );

  // Determine if we need a wrapper View
  const needsWrapper = display !== 'inline' || styles.container.marginTop || styles.container.marginBottom;

  // Accessibility configuration
  const accessibilityProps = {
    accessible,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole: accessibilityRole || (
      variant.startsWith('h') ? 'header' :
      variant === 'label' ? 'label' :
      'text'
    ),
  };

  // Text props
  const textProps = {
    ref,
    testID,
    style: styles.text,
    numberOfLines,
    selectable,
    ellipsizeMode,
    ...accessibilityProps,
  };

  if (needsWrapper) {
    return (
      <View style={styles.container}>
        <Text {...textProps}>
          {children}
        </Text>
      </View>
    );
  }

  return (
    <Text {...textProps} style={[styles.text, styles.container]}>
      {children}
    </Text>
  );
});

Typography.displayName = 'Typography';

export default Typography;