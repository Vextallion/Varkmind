import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@shared/theme/useTheme';
import { TabSymbol } from '@shared/ui/atoms/TabSymbol';

const TAB_BAR_BASE = 56;

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tab.active,
        tabBarInactiveTintColor: theme.tab.inactive,
        tabBarStyle: {
          backgroundColor: theme.tab.background,
          borderTopColor: theme.tab.border,
          borderTopWidth: 1,
          height: TAB_BAR_BASE + bottom,
          paddingTop: 8,
          paddingBottom: bottom,
        },
        tabBarLabelStyle: {
          fontFamily: theme.font.uiMedium,
          fontSize: 11,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => (
            <TabSymbol
              color={color}
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: ({ color }) => (
            <TabSymbol
              color={color}
              name={{
                ios: 'square.and.pencil',
                android: 'edit',
                web: 'edit',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('tabs.library'),
          tabBarIcon: ({ color }) => (
            <TabSymbol
              color={color}
              name={{
                ios: 'books.vertical.fill',
                android: 'library_books',
                web: 'library_books',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => (
            <TabSymbol
              color={color}
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
