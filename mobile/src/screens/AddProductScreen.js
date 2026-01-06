import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// BURAYA KENDİ IP ADRESİNİ YAZ
const API_URL = 'http://192.168.0.10:5000/api/products';

export default function AddProductScreen({ navigation }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category_id: '1',
    image_url: 'https://via.placeholder.com/150'
  });

  const handleSubmit = async () => {
    // 1. Token'ı hafızadan al
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      Alert.alert('Uyarı', 'İlan vermek için önce giriş yapmalısınız.');
      navigation.navigate('Login');
      return;
    }

    try {
      // 2. Token ile birlikte isteği gönder
      await axios.post(API_URL, form, {
        headers: { Authorization: token }
      });
      
      Alert.alert('Tebrikler', 'İlanınız başarıyla eklendi!');
      navigation.goBack(); // Geri dön
    } catch (error) {
      Alert.alert('Hata', 'Ürün eklenirken bir sorun oluştu.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni İlan Ver</Text>

      <Text style={styles.label}>Başlık</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Örn: Fizik Kitabı"
        value={form.title}
        onChangeText={(text) => setForm({...form, title: text})}
      />

      <Text style={styles.label}>Fiyat (TL)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0 yazarsanız Bağış olur"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => setForm({...form, price: text})}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Ürün hakkında bilgi..."
        multiline
        value={form.description}
        onChangeText={(text) => setForm({...form, description: text})}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>YAYINLA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginTop: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});