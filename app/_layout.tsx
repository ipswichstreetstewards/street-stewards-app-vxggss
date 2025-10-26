
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SystemBars } from "react-native-edge-to-edge";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useNetworkState } from "expo-network";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { useColorScheme, Alert, ActivityIndicator, View } from "react-native";
import { supabase } from "@/app/integrations/supabase/client";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isConnected } = useNetworkState();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setIsAuthenticated(!!session);
      setIsReady(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setIsAuthenticated(!!session);
      
      if (_event === 'SIGNED_OUT') {
        router.replace('/(auth)/login');
      } else if (_event === 'SIGNED_IN') {
        router.replace('/(tabs)/(home)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isReady, isAuthenticated]);

  if (!loaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WidgetProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SystemBars style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="log-cleanup" options={{ presentation: "modal" }} />
            <Stack.Screen name="report-hazard" options={{ presentation: "modal" }} />
            <Stack.Screen name="plant-identification" options={{ presentation: "modal" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}
