import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState('');

    const handleSave = async () => {
        const newNote = { title, content, tag: `#${tag}` };
        const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
        storedNotes.push(newNote);
        await AsyncStorage.setItem('notes', JSON.stringify(storedNotes));
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Content"
                    value={content}
                    onChangeText={setContent}
                    placeholderTextColor="#888"
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tag"
                    value={tag}
                    onChangeText={setTag}
                    placeholderTextColor="#888"
                />
                <Button title="Save Note" onPress={handleSave} color="#00a300" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2e2e2e',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#00a300',
        marginBottom: 20,
        padding: 10,
        color: '#fff',
    },
});