# ToDo List API (Backend)

REST API untuk mengelola daftar tugas harian. Dibangun dengan FastAPI, SQLAlchemy, dan PostgreSQL (Neon). Menerapkan prinsip SOLID untuk kode yang terstruktur.

## 🚀 Teknologi
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (Neon Serverless)
- **Testing**: Pytest
- **Deployment**: Railway (Docker)

## ✨ Fitur
- Membuat task baru
- Melihat seluruh task
- Melihat task berdasarkan ID
- Memperbarui task (judul/deskripsi)
- Menghapus task
- Menandai task selesai (toggle status)

## 🛠️ Prasyarat
- Python 3.11+
- PostgreSQL (lokal atau Neon)
- Docker (opsional, untuk containerization)

## 💻 Cara Menjalankan di Lokal

1. **Clone repositori & masuk ke folder:**
   ```bash
   git clone https://github.com/halik3/todo-list-backend.git
   cd todo-list-backend