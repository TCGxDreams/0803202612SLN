# SinhLN2326

> Trang liên kết cá nhân cho lớp 12SLN — PTNK 2026

## ✨ Tính năng

- 🔗 Trang profile cá nhân theo username (`/:username`)
- 🔐 Đăng nhập / Đăng ký qua Supabase Auth
- 🛠️ Admin Dashboard — quản lý thông tin, thêm/xoá links, đổi mật khẩu
- 📋 Nút chia sẻ / copy link trang cá nhân
- 🎨 Giao diện holographic pastel, responsive (mobile + desktop)
- 🌙 Hỗ trợ Dark/Light mode

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Vanilla CSS + Be Vietnam Pro font
- **Backend:** Supabase (Auth + PostgreSQL)
- **Icons:** Lucide React

## 🚀 Cài đặt

```bash
# Clone repo
git clone https://github.com/TCGxDreams/0803202612SLN.git
cd 0803202612SLN

# Cài dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local
# Điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY

# Chạy dev server
npm run dev
```

## 📝 Biến môi trường

Tạo file `.env.local` với nội dung:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📄 License

[MIT](LICENSE)
