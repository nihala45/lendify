# 📚 Lendify

**Lendify** is a Book Lending & Recommendation System built with Django REST API and a modern React frontend.

---

## 🌐 Live Demo

Frontend (Vercel):

👉 [https://lendify-tzaf.vercel.app/](https://lendify-tzaf.vercel.app/)

---

## 📬 API Endpoints (Examples)

- User registration & login
- List books with filters
- Borrow & return books
- Get book recommendations

---

## 🛠️ Tech Stack

- **Backend**: Django 5, Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Frontend**: React.js (Vite), Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Deployment**:
  - Frontend: Vercel
  - Backend: Django (deployed separately)

---

## 🚀 Features

- User registration & login (JWT)
- Browse books (filter by genre, author, availability)
- Borrow & return books
- Book recommendations based on reading history
- Tracks how many times each book has been read
- React frontend with modern UI

---

## ⚙️ Backend Setup

1. **Clone the repo**

    ```bash
    git clone https://github.com/nihala45/lendify
    cd backend
    ```

2. **Create virtualenv**

    ```bash
    python -m venv venv
    source venv/bin/activate     # On Windows: venv\Scripts\activate
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run migrations**

    ```bash
    python manage.py migrate
    ```

5. **Run server**

    ```bash
    python manage.py runserver
    ```

---

## ⚙️ Frontend Setup

1. **Navigate to frontend**

    ```bash
    cd frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run locally**

    ```bash
    npm run dev
    ```

4. **Build for production**

    ```bash
    npm run build
    ```

5. **Deploy to Vercel**

    ```bash
    vercel deploy
    ```

---

## ✨ Author

**Nihala Shirin**

---



