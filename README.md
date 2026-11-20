# ToDo List UI (Frontend)

Antarmuka pengguna untuk aplikasi ToDo List. Dibangun menggunakan React, Vite, dan Tailwind CSS dengan desain modern. Aplikasi ini terhubung dengan REST API dari repositori backend.

## Live Demo

Aplikasi Web: https://todo-list-frontend-lime-one.vercel.app

## Teknologi

- React 19 (Vite)
- Tailwind CSS
- Axios
- React Hot Toast
- Docker + Nginx
- Vercel (Deployment)

## Fitur

- Menambahkan task baru (judul dan deskripsi)
- Edit inline (memperbarui judul dan deskripsi langsung dari daftar)
- Menandai task selesai/belum selesai
- Menghapus task
- Filter task berdasarkan status (Semua, Pending, Selesai)
- Sortir task berdasarkan judul atau status
- Skeleton loading saat memuat data
- Notifikasi toast untuk setiap aksi

## Cara Menjalankan Secara Lokal

1. Clone repositori ini:

    git clone https://github.com/halik3/todo-list-frontend.git
    cd todo-list-frontend

2. Install dependensi:

    npm install

3. Buat file .env di root folder dan arahkan ke URL backend lokal:

    VITE_API_URL=http://127.0.0.1:8000

4. Jalankan aplikasi:

    npm run dev

   Aplikasi akan berjalan di http://localhost:5173.

5. Build untuk produksi:

    npm run build

## Menjalankan dengan Docker

    docker build -t todo-frontend .
    docker run -p 8080:80 todo-frontend

Akses di http://localhost:8080.

## Deployment

Proyek ini menggunakan Vercel untuk deployment frontend. Pastikan environment variable VITE_API_URL telah diisi dengan URL backend Railway pada pengaturan proyek di Vercel.