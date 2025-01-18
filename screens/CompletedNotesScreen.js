import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const unsubscribe = navigation.addListener('focus', loadNotes);
        return unsubscribe;
    }, [navigation]);

    const handleDelete = async (noteToDelete) => {
        const updatedNotes = notes.filter(note => note !== noteToDelete);
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const filteredNotes = notes.filter(note => note.completed).filter(note => {
        if (searchQuery.startsWith('#')) {
            return note.tag.includes(searchQuery);
        }
        return note.title.includes(searchQuery) || note.content.includes(searchQuery);
    });

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
                data={filteredNotes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.noteCard}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <Text style={styles.noteText}>{item.content}</Text>
                        <Text style={styles.noteTag}>{item.tag}</Text>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <Text style={styles.deleteButton}>Удалить</Text>
                        </TouchableOpacity>
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
    deleteButton: {
        color: '#ff0000',
        marginTop: 10,
    },
});