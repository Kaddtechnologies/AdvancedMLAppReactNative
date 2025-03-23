import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, ColorValue } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import { Spacing, BorderRadius } from '../../constants/Theme';
import { ExternalLink, Globe, Book, Code, Users, Star, LucideIcon } from 'lucide-react-native';

interface ExploreItem {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
}

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const exploreItems: ExploreItem[] = [
    {
      title: 'AI Documentation',
      description: 'Learn about the AI technology powering this application',
      icon: Book,
      url: 'https://example.com/ai-docs',
    },
    {
      title: 'Developer Resources',
      description: 'Access tools and APIs for building with our AI',
      icon: Code,
      url: 'https://example.com/developer',
    },
    {
      title: 'Community',
      description: 'Join our community of AI enthusiasts and developers',
      icon: Users,
      url: 'https://example.com/community',
    },
    {
      title: 'Featured Projects',
      description: 'Explore innovative projects built with our AI technology',
      icon: Star,
      url: 'https://example.com/projects',
    },
    {
      title: 'Website',
      description: 'Visit our main website for more information',
      icon: Globe,
      url: 'https://example.com',
    },
  ];

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <StyledText style={styles.title}>Explore</StyledText>
          <StyledText style={styles.subtitle}>
            Discover resources and tools to enhance your AI experience
          </StyledText>
        </View>

        <View style={styles.cardsContainer}>
          {exploreItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardWrapper}
              onPress={() => handleOpenLink(item.url)}
              activeOpacity={0.8}
            >
              <GradientCard style={styles.card} withShadow>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <item.icon color={colors.accent} size={24} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <StyledText style={styles.cardTitle}>{item.title}</StyledText>
                    <StyledText style={styles.cardDescription}>
                      {item.description}
                    </StyledText>
                  </View>
                  <ExternalLink color={colors.accentSecondary} size={20} />
                </View>
              </GradientCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  cardsContainer: {
    gap: Spacing.m,
  },
  cardWrapper: {
    marginBottom: Spacing.m,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
