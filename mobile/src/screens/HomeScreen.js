import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // YENİ: Ekran odaklanınca çalışır
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // YENİ: Token kontrolü için

// BURAYA KENDİ IP ADRESİNİ YAZ
const API_URL = 'http://192.168.0.10:5000/api/products'; 

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giriş durumu

  // 1. Ekrana her gelindiğinde Token var mı diye kontrol et
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token); // Token varsa true, yoksa false olur
      };
      checkLoginStatus();
      fetchProducts(); // Ürünleri de tazele
    }, [])
  );

  // 2. Sağ üst köşedeki butonu duruma göre ayarla
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        isLoggedIn ? (
          // Giriş yapıldıysa "ÇIKIŞ" butonu göster
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Çıkış</Text>
          </TouchableOpacity>
        ) : (
          // Giriş yapılmadıysa "GİRİŞ" butonu göster
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginRight: 15 }}>
            <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Giriş</Text>
          </TouchableOpacity>
        )
      ),
    });
  }, [navigation, isLoggedIn]); // isLoggedIn değişince butonu yeniden çiz

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Çıkış", "Çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { 
        text: "Evet, Çık", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem('token'); // Bileti yırt
          setIsLoggedIn(false); // Durumu güncelle
          Alert.alert("Başarılı", "Çıkış yapıldı.");
        }
      }
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <Image 
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>
          {Number(item.price) === 0 ? 'BAĞIŞ 🎁' : `${item.price} TL`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Yükleniyor veya ürün yok...</Text>}
      />
      
      {/* İlan Ver Butonu */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  card: { flexDirection: 'row', backgroundColor: 'white', marginBottom: 10, borderRadius: 10, padding: 10, elevation: 3 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { marginLeft: 15, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: 'green', marginTop: 5 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#28a745', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: 'white', fontSize: 30, fontWeight: 'bold' }
});