import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route, navigation }) {
  // Home sayfasından gönderilen ürün bilgilerini alıyoruz
  const { product } = route.params;

  // SİLME FONKSİYONU
  const handleDelete = async () => {
    // 1. Token var mı? (Giriş yapmış mı?)
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert("Hata", "Silmek için giriş yapmalısınız.");
      return;
    }

    // 2. Emin misin diye sor
    Alert.alert(
      "İlanı Sil",
      "Bu ilanı silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive", 
          onPress: async () => {
            try {
              // 3. Backend'e SİL isteği at (IP ADRESİNİ DÜZELT!)
              await axios.delete(`http://192.168.0.10:5000/api/products/${product.id}`, {
                headers: { Authorization: token }
              });

              Alert.alert("Başarılı", "İlan silindi.");
              navigation.goBack(); // Ana sayfaya dön
            } catch (error) {
              // Eğer başkasının ürününü silmeye çalışırsa Backend hata döner
              Alert.alert("Hata", "Sadece kendi ilanlarınızı silebilirsiniz!");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: product.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>
            {Number(product.price) === 0 ? 'BAĞIŞ 🎁' : `${product.price} TL`}
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{product.description || "Açıklama girilmemiş."}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Satıcı</Text>
        <Text style={styles.seller}>{product.username || "Bilinmiyor"}</Text>
      </View>

      {/* SİLME BUTONU (Kırmızı) */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>BU İLANI SİL 🗑️</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  infoContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 20, color: '#28a745', fontWeight: 'bold', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  description: { fontSize: 16, color: '#666', lineHeight: 22 },
  seller: { fontSize: 16, color: '#007bff' },
  deleteButton: { 
    backgroundColor: '#ff4444', 
    margin: 20, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  deleteText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});