import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.header}>
                <Text style={styles.headerText}>MyNote</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        backgroundColor: '#2e2e2e',
    },
    header: {
        padding: 15,
        backgroundColor: '#005300',
        borderRadius: 100,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffffff',
        borderStyle: 'dashed',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
    },
});