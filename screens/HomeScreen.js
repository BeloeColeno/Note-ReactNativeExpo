import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {
    const [notes, setNotes] = useState([]);

    const loadNotes = async () => {
        try {
            const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            setNotes(storedNotes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadNotes);
        return unsubscribe;
    }, [navigation]);

    const handlePress = async (note) => {
        const updatedNotes = notes.map(n => n === note ? {...n, completed: true} : n);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    return (
            <View style={styles.container}>
                <FlatList
                    data={notes.filter(note => !note.completed)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.noteCard}
                            onPress={() => handlePress(item)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            <Text style={styles.noteText}>{item.content}</Text>
                            <Text style={styles.actionText}>Complete</Text>
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddNote')}
                >
                    <Text style={styles.addButtonText}>Add Note</Text>
                </TouchableOpacity>
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
    addButton: {
        backgroundColor: '#007a00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    safeArea: {
        backgroundColor: '#2e2e2e',
    },
});