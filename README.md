# EcoCampus - Sürdürülebilir Kampüs Pazar Yeri

EcoCampus, üniversite öğrencilerinin kullanmadıkları ders materyallerini, kitaplarını veya eşyalarını satabilecekleri ya da ihtiyaç sahiplerine ücretsiz bağışlayabilecekleri, sürdürülebilirliği destekleyen bir mobil ve web platformudur.

Bu proje; Backend (Node.js), Web (React) ve Mobil (React Native) platformlarını içeren **3 katmanlı (Fullstack) mimari** ile geliştirilmiştir.

---

## Proje Klasör Yapısı

Proje üç ana klasörden oluşmaktadır:

* **`/backend`**: Node.js ve Express.js ile yazılmış REST API servisi.
* **`/web`**: React ve Vite ile geliştirilmiş Yönetim Paneli.
* **`/mobile`**: React Native ve Expo ile geliştirilmiş Mobil Uygulama.

---

## Kullanılan Teknolojiler

* **Backend:** Node.js, Express.js, PostgreSQL, JWT (JSON Web Token), Bcrypt
* **Veritabanı:** PostgreSQL (İlişkisel Veritabanı)
* **Web Frontend:** React.js, Vite, Axios, React Router
* **Mobil:** React Native, Expo Go, React Navigation

---

## Kurulum ve Çalıştırma Rehberi

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları sırasıyla uygulayın.


### 1. Veritabanı Kurulumu (PostgreSQL)

1.  Bilgisayarınızda **PostgreSQL** ve **pgAdmin** yüklü olmalıdır.
2.  pgAdmin üzerinden `ecocampus_db` adında yeni bir veritabanı oluşturun.
3.  Aşağıdaki SQL kodlarını **Query Tool** aracılığıyla çalıştırarak tabloları oluşturun:

```sql
-- Kullanıcılar Tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Ürünler Tablosu
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category_id INTEGER,
    image_url TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```


### 2. Backend (Sunucu) Başlatma

Terminali açın ve `backend` klasörüne gidin:

```bash
cd backend
npm install
```

`backend` klasörü içinde `.env` adında bir dosya oluşturun ve içine şu bilgileri kaydedin:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=kendi_sifreniz
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecocampus_db
JWT_SECRET=gizli_anahtar
```

Sunucuyu başlatın:

```bash
node server.js
```


### 3. Web Paneli (Frontend) Başlatma

Yeni bir terminal açın ve `web` klasörüne gidin:

```bash
cd web
npm install
npm run dev
```

Terminalde verilen linke (Genellikle `http://localhost:5173`) tıklayarak Web Panelini tarayıcıda açabilirsiniz.


### 4. Mobil Uygulama (React Native) Başlatma

Yeni bir terminal açın ve `mobile` klasörüne gidin:

```bash
cd mobile
npm install
```

**⚠️ ÖNEMLİ AYAR:**
Mobil uygulamanın telefonunuzda çalışabilmesi için `mobile/src/screens` altındaki dosyalarda (Örn: `HomeScreen.js`) bulunan `API_URL` değişkenine bilgisayarınızın yerel IP adresini yazmalısınız.

*Örnek:* `const API_URL = 'http://192.168.1.35:5000/api/products';`

Uygulamayı başlatın:

```bash
npx expo start --clear
```

---

## Özellikler

* **Kimlik Doğrulama:** JWT tabanlı güvenli giriş ve kayıt sistemi.
* **Senkronizasyon:** Web ve Mobil platformlarında veriler eş zamanlı güncellenir.
* **Ürün Yönetimi:** İlan ekleme, listeleme ve silme özellikleri.
* **Güvenlik:** Kullanıcılar sadece kendi ekledikleri içerikleri silebilir.