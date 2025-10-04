
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { WidgetProvider } from "@/contexts/WidgetContext";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { useNetworkState } from "expo-network";
import React, { useEffect } from "react";
import { Button } from "@/components/button";
import { dataUpdateScheduler } from "@/utils/dataUpdateScheduler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize data updates when app starts
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing parliamentary data updates...');
        
        // Initialize background fetch
        await dataUpdateScheduler.initializeBackgroundFetch();
        
        // Check for updates on app start
        const updateResult = await dataUpdateScheduler.checkAndUpdate();
        console.log('Initial update check result:', updateResult);
        
        if (updateResult.updated && !updateResult.success) {
          console.warn('Initial data update failed, but app will continue with cached data');
        }
        
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    if (loaded) {
      initializeApp();
    }
  }, [loaded]);

  // Monitor network state for connectivity-dependent features
  useEffect(() => {
    if (networkState.isConnected === false) {
      console.log('Network disconnected - app will use cached data');
    } else if (networkState.isConnected === true) {
      console.log('Network connected - fresh data updates available');
    }
  }, [networkState.isConnected]);

  if (!loaded) {
    return null;
  }

  const customDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#007AFF',
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      border: '#38383A',
      notification: '#FF453A',
    },
  };

  const customLightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#007AFF',
      background: '#F2F2F7',
      card: '#FFFFFF',
      text: '#000000',
      border: '#C6C6C8',
      notification: '#FF3B30',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : customLightTheme}>
        <WidgetProvider>
          <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: "modal",
                title: "Modal Screen"
              }} 
            />
            <Stack.Screen 
              name="transparent-modal" 
              options={{ 
                presentation: "transparentModal",
                animation: "fade",
                title: "Transparent Modal"
              }} 
            />
            <Stack.Screen 
              name="formsheet" 
              options={{ 
                presentation: "formSheet",
                title: "Form Sheet"
              }} 
            />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
