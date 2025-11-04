import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface RippleProps {
  x: number;
  y: number;
  rippleKey: string;
}

interface TouchRippleProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const Ripple: React.FC<RippleProps> = ({ x, y, rippleKey }) => {
  const isSmall = rippleKey.includes('small');
  const scale = useSharedValue(0);
  const opacity = useSharedValue(isSmall ? 0.4 : 0.6);

  scale.value = withSpring(isSmall ? 1.8 : 2.5, {
    damping: 25,
    stiffness: 80,
  });

  opacity.value = withSpring(0, {
    damping: 30,
    stiffness: 60,
    duration: isSmall ? 500 : 600,
  });

  const animatedStyle = useAnimatedStyle(() => {
    const maxSize = isSmall ? 40 : 120;
    const radius = interpolate(scale.value, [0, 1, 2, 3], [
      isSmall ? 5 : 10,
      isSmall ? 15 : 30,
      isSmall ? 25 : 60,
      maxSize
    ]);

    return {
      position: 'absolute',
      left: x - radius / 2,
      top: y - radius / 2,
      width: radius,
      height: radius,
      borderRadius: radius / 2,
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, styles.ripple]}>
      <LinearGradient
        colors={
          isSmall
            ? ['rgba(89, 172, 119, 0.2)', 'rgba(111, 190, 138, 0.05)']
            : ['rgba(89, 172, 119, 0.3)', 'rgba(89, 172, 119, 0.15)', 'rgba(111, 190, 138, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

export const TouchRipple: React.FC<TouchRippleProps> = ({ children, onPress }) => {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const handleTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // 메인 물방울
    const mainRipple: RippleProps = {
      x: locationX,
      y: locationY,
      key: `ripple-${Date.now()}-${Math.random()}`,
    };

    // 작은 주변 물방울들
    const smallRipples: RippleProps[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 * i) / 3;
      const distance = 20 + Math.random() * 15;
      smallRipples.push({
        x: locationX + Math.cos(angle) * distance,
        y: locationY + Math.sin(angle) * distance,
        key: `ripple-small-${Date.now()}-${Math.random()}-${i}`,
      });
    }

    setRipples(prev => [...prev, mainRipple, ...smallRipples]);

    // 메인 물방울은 1초 후, 작은 물방울들은 0.8초 후 제거
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.key !== mainRipple.key));
    }, 1000);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => !smallRipples.some(s => s.key === r.key)));
    }, 800);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handleTouch}
      >
        {children}
      </TouchableOpacity>
      {ripples.map(ripple => (
        <Ripple key={ripple.key} x={ripple.x} y={ripple.y} rippleKey={ripple.key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  touchArea: {
    flex: 1,
  },
  ripple: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});