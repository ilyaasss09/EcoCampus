import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    // Form verileri için state
    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        category_id: "1", // Varsayılan olarak 1 (Kitap) seçili
        image_url: "https://via.placeholder.com/150" // Örnek resim
    });

    // Sayfa açılınca ürünleri çek
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Ürünler çekilemedi", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: token } // Bileti gösteriyoruz
            });
            alert("Ürün silindi!");
            fetchProducts(); // Listeyi yenile
        } catch (error) {
            alert("Hata: Başkasının ürününü silemezsiniz veya yetkiniz yok.");
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:5000/api/products", form, {
                headers: { Authorization: token } // Bileti gösteriyoruz
            });
            alert("Ürün başarıyla eklendi!");
            fetchProducts(); // Listeyi yenile
            // Formu temizle
            setForm({ ...form, title: "", price: "", description: "" });
        } catch (error) {
            alert("Ürün eklenirken hata oluştu.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
            
            {/* Üst Başlık ve Çıkış */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1>📦 EcoCampus Panel</h1>
                <button onClick={handleLogout} style={{ padding: "8px 15px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Çıkış Yap
                </button>
            </div>

            {/* Yeni Ürün Ekleme Formu */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
                <h3>➕ Yeni İlan Ekle</h3>
                <form onSubmit={handleAddProduct} style={{ display: "grid", gap: "10px" }}>
                    <input 
                        placeholder="Ürün Başlığı (Örn: Matematik Kitabı)" 
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                        required
                        style={{ padding: "10px" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input 
                            type="number" 
                            placeholder="Fiyat (0 ise Bağış)" 
                            value={form.price}
                            onChange={(e) => setForm({...form, price: e.target.value})}
                            style={{ flex: 1, padding: "10px" }}
                        />
                        <select 
                            value={form.category_id}
                            onChange={(e) => setForm({...form, category_id: e.target.value})}
                            style={{ flex: 1, padding: "10px" }}
                        >
                            <option value="1">Kitap</option>
                            <option value="2">Elektronik</option>
                            <option value="3">Giyim</option>
                        </select>
                    </div>
                    <textarea 
                        placeholder="Açıklama" 
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                        style={{ padding: "10px", height: "60px" }}
                    />
                    <button type="submit" style={{ background: "#28a745", color: "white", border: "none", padding: "10px", cursor: "pointer", fontWeight: "bold" }}>
                        İLAN VER
                    </button>
                </form>
            </div>

            {/* Ürün Listesi */}
            <h3>📋 Aktif İlanlar</h3>
            {products.length === 0 ? <p>Henüz hiç ilan yok.</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ background: "#eee", textAlign: "left" }}>
                            <th style={{ padding: "10px" }}>Başlık</th>
                            <th style={{ padding: "10px" }}>Fiyat</th>
                            <th style={{ padding: "10px" }}>Kategori</th>
                            <th style={{ padding: "10px" }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>{product.title}</td>
                                <td style={{ padding: "10px" }}>
                                    {Number(product.price) === 0 ? 
                                        <span style={{ color: "green", fontWeight: "bold" }}>BAĞIŞ 🎁</span> : 
                                        `${product.price} TL`}
                                </td>
                                <td style={{ padding: "10px" }}>{product.category_name || "Diğer"}</td>
                                <td style={{ padding: "10px" }}>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px", cursor: "pointer" }}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;