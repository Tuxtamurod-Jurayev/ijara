# 🏠 IjaraBozor — O'zbekistonda Zamonaviy Ijara Platformasi

React (Vite) asosida yaratilgan zamonaviy, tezkor va xavfsiz ijara berish/olish platformasi. Loyiha GitHub va Vercel uchun to'liq moslashtirilgan bo'lib, keyingi bosqichda Telegram Bot va WebApp bilan integratsiya qilinadi.

---

## 🚀 Asosiy Imkoniyatlar

1. **Reklamalar / E'lonlar ko'rish:**
   - Foydalanuvchilar e'lonlarni ko'rishi, qidirishi va toifalar (Kvartiralar, Hovli/Dacha, Avtomobillar, Ofis/Bino, Jihozlar) bo'yicha filtrlashi mumkin.
   - Narxlar bo'yicha saralash (eng arzon yoki eng qimmat).
   - E'lon egasining telefon raqami, bir marta bosish bilan qo'ng'iroq qilish va nusxa olish imkoniyati.

2. **Ro'yxatdan o'tish (Register):**
   - **Ism va Familiya**
   - **Login (username)**
   - **Telefon raqami**
   - **Parol** (ko'rsatish/yashirish imkoniyati bilan)

3. **Tizimga kirish (Login):**
   - **Login** va **Parol** orqali kirish.
   - Shaxsiy profil va "Mening e'lonlarim" bo'limi.

4. **Administrator Paneli (Admin Dashboard):**
   - **Admin Login:** `admin`
   - **Admin Parol:** `1234`
   - **Sodda va qulay interfeys:**
     - Barcha ro'yxatdan o'tgan foydalanuvchilar ro'yxati (Ism, Login, Telefon, Sana).
     - Har bir foydalanuvchi joylagan **e'lonlar soni**.
     - **"E'lonlarini ko'rish"** tugmasi orqali aynan o'sha foydalanuvchining barcha reklamalarini to'liq ko'rish va boshqarish.
     - E'lonlar moderatsiyasi (keraksiz yoki noo'rin e'lonlarni o'chirish).
     - Foydalanuvchilarni o'chirish imkoniyati.

5. **Telegram Bot Integratsiyasi (Keyingi bosqich uchun tayyor):**
   - `Telegram WebApp SDK` integratsiyasi.
   - Bot Token va Chat ID orqali yangi e'lonlarni avtomatik kanal yoki guruhga fotosi va tavsifi bilan yuborish.
   - To'g'ridan-to'g'ri test xabar yuborish imkoniyati.

---

## 🛠 Loyihani Mahalliy Ishga Tushirish

```bash
# 1. Kutubxonalarni o'rnatish
npm install

# 2. Serverni ishga tushirish
npm run dev
```

Brauzerda `http://localhost:5174/` manzilini oching.

---

## 🌐 GitHub va Vercel'ga Joylash (Deploy)

### 1. GitHub'ga yuklash:
```bash
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/ijara.git
git push -u origin main
```

### 2. Vercel'ga yuklash:
1. [vercel.com](https://vercel.com) saytiga kiring.
2. **"Add New Project"** tugmasini bosing va GitHub dagi `ijara` repozitoriyasini tanlang.
3. Framework avtomatik ravishda **Vite** deb tanlanadi.
4. **"Deploy"** tugmasini bosing — 1 daqiqada butun dunyoga ochiq bo'ladi!

---

## 🔑 Admin Ma'lumotlari

- **Login:** `admin`
- **Parol:** `1234`
