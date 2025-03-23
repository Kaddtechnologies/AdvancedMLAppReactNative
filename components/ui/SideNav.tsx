import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, Brain, Compass, Settings, X } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

interface SideNavProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SideNav({ isVisible, onClose }: SideNavProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  // Animation values
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Return null only when not visible
  if (!isVisible) return null;

  const navigationItems = [
    { title: 'AI Analytics', icon: LineChart, route: '/ai-analytics' },
    { title: 'Enhanced AI', icon: Brain, route: '/enhanced-ai' },
    { title: 'Explore', icon: Compass, route: '/explore' },
    { title: 'Settings', icon: Settings, route: '/settings' },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <LinearGradient
            colors={colors.navBarGradient.colors as [string, string]}
            start={colors.navBarGradient.start}
            end={colors.navBarGradient.end}
            style={styles.gradient}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X color={colors.text} size={24} />
            </TouchableOpacity>
            {navigationItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.navItem}
                onPress={() => handleNavigation(item.route)}
              >
                <item.icon color={colors.text} size={24} />
                <Text style={[styles.navText, { color: colors.text }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '70%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  navText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
