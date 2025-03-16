import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import StyledText from '../ui/StyledText';
import { Brain, Compass, Settings, LineChart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const menuItems = [
  { title: 'AI Analytics', icon: LineChart, route: '/screens/ai-analytics' },
  { title: 'Enhanced AI', icon: Brain, route: '/screens/enhanced-ai' },
  { title: 'Explore', icon: Compass, route: '/screens/explore' },
  { title: 'Settings', icon: Settings, route: '/screens/settings' },
];

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <LinearGradient
        colors={colors.navBarGradient.colors as [string, string]}
        start={colors.navBarGradient.start}
        end={colors.navBarGradient.end}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={styles.logo}
          />
          <StyledText style={styles.title}>Advanced ML App</StyledText>
          <StyledText style={styles.subtitle}>AI-Powered Experience</StyledText>
        </View>

        {/* Default drawer items */}
        <DrawerItemList {...props} />

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.accentSecondary }]} />

        {/* Custom menu items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push(item.route);
            }}
          >
            <item.icon color={colors.text} size={24} />
            <StyledText style={styles.menuItemText}>{item.title}</StyledText>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    marginVertical: 15,
    marginHorizontal: 20,
    opacity: 0.2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
});