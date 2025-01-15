import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const checkAndCreateFile = async () => {
    try {
      const dir = `${FileSystem.documentDirectory}note/`;
      const fileUri = `${dir}notes.json`;

      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error checking/creating file:', error);
      }
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAndCreateFile();
      } catch (error) {
        if (__DEV__) {
          console.error('Error initializing app:', error);
        }
      }
    };
    initializeApp();
  }, []);

  return <AppNavigator />;
}