import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadNotes = async () => {
        try {
            const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
            setNotes(storedNotes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    useEffect(() => {
        return navigation.addListener('focus', loadNotes);
    }, [navigation]);

    const handlePress = async (note) => {
        const updatedNotes = notes.map(n => n === note ? { ...n, completed: true } : n);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const filteredNotes = notes.filter(note => {
        if (searchQuery.startsWith('#')) {
            return note.tag.includes(searchQuery);
        }
        return note.title.includes(searchQuery) || note.content.includes(searchQuery);
    });

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={'#888'}
            />
            <FlatList
                data={filteredNotes.filter(note => !note.completed)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.noteCard}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <Text style={styles.noteText}>{item.content}</Text>
                        <Text style={styles.noteTag}>{item.tag}</Text>
                        <TouchableOpacity onPress={() => handlePress(item)}>
                            <Text style={styles.completeButton}>Complete</Text>
                        </TouchableOpacity>
                    </View>
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
    searchInput: {
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        color: '#fff',
        borderColor: '#00a300',
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
    noteTag: {
        color: '#00a300',
        fontSize: 12,
        marginTop: 5,
    },
    completeButton: {
        color: '#00a300',
        marginTop: 10,
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
});