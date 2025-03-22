import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { EventArg } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabIcon } from '../../components/ui/TabIcon';
import SideNav from '../../components/ui/SideNav';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);

  return (
    <>
      <SideNav isVisible={isSideNavVisible} onClose={() => setIsSideNavVisible(false)} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.accentSecondary,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <View style={styles.tabBarBackground}>
              <BlurView intensity={40} tint="dark" style={styles.blurView}>
                <LinearGradient
                  colors={colors.navBarGradient.colors as [string, string]}
                  start={colors.navBarGradient.start}
                  end={colors.navBarGradient.end}
                  style={styles.gradient}
                />
              </BlurView>
            </View>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          tabBarLabelStyle: {
            textTransform: 'capitalize',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            headerTitle: 'Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => <TabIcon name="Home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: '',
            headerTitle: 'Conversations',
            tabBarLabel: 'Conversations',
            tabBarBackground: () => (
              <View style={styles.tabBarBackground}>
                <BlurView intensity={20} tint="dark" style={styles.blurView} />
              </View>
            ),
            tabBarIcon: ({ color }) => <TabIcon name="MessageCircle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="metrics"
          options={{
            title: 'Metrics',
            headerTitle: 'Metrics',
            tabBarLabel: 'Metrics',
            tabBarIcon: ({ color }) => <TabIcon name="BarChart2" color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            headerTitle: 'More',
            tabBarLabel: 'More',
            tabBarIcon: ({ color }) => <TabIcon name="MoreHorizontal" color={color} />,
          }}
          listeners={{
            tabPress: (e: EventArg<"tabPress", true>) => {
              // Prevent default navigation
              e.preventDefault();
              // Show side menu
              setIsSideNavVisible(true);
            },
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
