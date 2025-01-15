import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
});

export default function AddNoteScreen({ navigation }) {
    const handleAddNote = async (values) => {
        const storedNotes = JSON.parse(await AsyncStorage.getItem('notes')) || [];
        storedNotes.push({ ...values, completed: false });
        await AsyncStorage.setItem('notes', JSON.stringify(storedNotes));
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Formik
                    initialValues={{ title: '', content: '' }}
                    validationSchema={NoteSchema}
                    onSubmit={handleAddNote}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('title')}
                                onBlur={handleBlur('title')}
                                value={values.title}
                                placeholder="Note Title"
                                placeholderTextColor="#888"
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                onChangeText={handleChange('content')}
                                onBlur={handleBlur('content')}
                                value={values.content}
                                placeholder="Note Content"
                                placeholderTextColor="#888"
                                multiline
                            />
                            <Button onPress={handleSubmit} title="Add Note" color="#00ff00" />
                        </View>
                    )}
                </Formik>
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
        backgroundColor: '#2e2e2e',
        padding: 10,
    },
    input: {
        backgroundColor: '#3e3e3e',
        color: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    textArea: {
        height: 100,
    },
});