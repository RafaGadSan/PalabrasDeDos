import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface Word {
  id: string;
  spanish: string;
  ukrainian: string;
  example: string;
  tags: string[];
}

export default function App() {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('words')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Word[];
        setWords(data);
      });
    return unsubscribe;
  }, []);

  const addWord = () => {
    firestore().collection('words').add({
      spanish: "casa",
      ukrainian: "дім",
      example: "Vivo en una casa grande.",
      tags: ["hogar"],
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp()
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🇪🇸🇺🇦 PalabrasDeDos</Text>
      <Button title="Añadir 'casa'" onPress={addWord} />
      <FlatList
        data={words}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.wordItem}>
            <Text style={styles.spanish}>🇪🇸 {item.spanish}</Text>
            <Text style={styles.ukrainian}>🇺🇦 [translate:{item.ukrainian}]</Text>
            <Text style={styles.example}>{item.example}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  wordItem: { padding: 15, backgroundColor: 'white', marginVertical: 5, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  spanish: { fontSize: 18, fontWeight: '600', color: '#e74c3c' },
  ukrainian: { fontSize: 18, marginTop: 5, fontWeight: '500' },
  example: { fontSize: 14, color: '#666', marginTop: 5, fontStyle: 'italic' }
});
