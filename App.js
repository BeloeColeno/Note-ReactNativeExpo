import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Initial value for opacity: 1

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'CustomFont': require('./assets/fonts/Aladin-Regular.ttf'),
        });
        setIsReady(true);
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    if (isReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
      <View style={styles.container}>
        <Animated.View style={[styles.splash, { opacity: fadeAnim }]} />
        <AppNavigator />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
  },
});