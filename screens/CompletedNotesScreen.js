import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function CompletedNotesScreen({ navigation }) {
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

    const handleDelete = async (noteToDelete) => {
        const updatedNotes = notes.filter(note => note !== noteToDelete);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const handlePin = async (note) => {
        const updatedNotes = notes.map(n => n === note ? { ...n, pinned: !n.pinned } : n);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const filteredNotes = notes.filter(note => note.completed).filter(note => {
        if (searchQuery.startsWith('#')) {
            return note.tag.includes(searchQuery);
        }
        return note.title.includes(searchQuery) || note.content.includes(searchQuery);
    });

    const sortedNotes = filteredNotes.sort((a, b) => b.pinned - a.pinned);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={'#888'}
            />
            <FlatList
                data={sortedNotes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.noteCard}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <Text style={styles.noteText}>{item.content}</Text>
                        <Text style={styles.noteTag}>{item.tag}</Text>
                        <View style={styles.noteActions}>
                            <TouchableOpacity onPress={() => handleDelete(item)}>
                                <Text style={styles.deleteButton}>Удалить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handlePin(item)}>
                                <Ionicons
                                    name={item.pinned ? "pin" : "pin-outline"}
                                    size={24}
                                    color="#00a300"
                                    style={!item.pinned ? { transform: [{ rotate: '45deg' }] } : {}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
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
    noteActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    deleteButton: {
        color: '#ff0000',
    },
});