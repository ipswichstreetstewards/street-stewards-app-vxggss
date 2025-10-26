
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'activity',
      route: '/(tabs)/activity',
      icon: 'list.bullet',
      label: 'Activity',
    },
    {
      name: 'community',
      route: '/(tabs)/community',
      icon: 'person.3.fill',
      label: 'Community',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" color={colors.text} />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="activity">
          <Icon sf="list.bullet" drawable="ic_activity" color={colors.text} />
          <Label>Activity</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="community">
          <Icon sf="person.3.fill" drawable="ic_community" color={colors.text} />
          <Label>Community</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" color={colors.text} />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="activity" />
        <Stack.Screen name="community" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
