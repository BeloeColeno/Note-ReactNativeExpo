import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompletedNotesScreen({navigation}) {
    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {
        const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
        setNotes(storedNotes);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadNotes);
        return unsubscribe;
    }, [navigation]);

    const handlePress = async (note) => {
        const updatedNotes = notes.filter(n => n !== note);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    return (
            <View style={styles.container}>
                <FlatList
                    data={notes.filter(note => note.completed)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.noteCard}
                            onPress={() => handlePress(item)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            <Text style={styles.noteText}>{item.content}</Text>
                            <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2e2e',
        padding: 10,
    },
    noteCard: {
        backgroundColor: '#3e3e3e',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    noteTitle: {
        color: '#00a300',
        fontSize: 12,
        marginBottom: 5,
    },
    noteText: {
        color: '#fff',
    },
    actionText: {
        color: '#00a300',
        fontSize: 12,
        marginTop: 5,
    },
    safeArea: {
        backgroundColor: '#2e2e2e',
    },
});