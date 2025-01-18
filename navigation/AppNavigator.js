import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../component/CustomHeader';
import HomeScreen from '../screens/HomeScreen';
import CompletedNotesScreen from '../screens/CompletedNotesScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import CustomDrawerContent from '../component/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStackNavigator() {
    return (
        <Stack.Navigator id={0}>
            <Stack.Screen
                name="HomeStack"
                component={HomeScreen}
                options={({ navigation }) => ({
                    header: () => <CustomHeader navigation={navigation} title="Home" />,
                })}
            />
            <Stack.Screen
                name="AddNote"
                component={AddNoteScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#2e2e2e',
                    },
                    drawerLabelStyle: {
                        color: '#fff',
                    },
                }}
             id={1}>
                <Drawer.Screen
                    name="Home"
                    component={MainStackNavigator}
                    options={{ headerShown: false }}
                />
                <Drawer.Screen
                    name="CompletedNotes"
                    component={CompletedNotesScreen}
                    options={({ navigation }) => ({
                        header: () => <CustomHeader navigation={navigation} title="Completed Notes" />,
                    })}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}