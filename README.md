# Lumoryn Billings – Frontend

A **fish shop billing system frontend** built with **React + Vite**, designed based on **real fish shop owner requirements**. The UI is intentionally simple and fast, optimized for counter billing where one admin handles billing while other staff manage fish selection and delivery.

---

## 🚀 Project Overview

Lumoryn Billing is a practical billing and sales management application for fish shops. The frontend focuses on:

* Fast billing at the counter
* Minimal clicks and distractions
* Clear visibility of customer queue, prices, and bill details

This repository contains **only the frontend** of the application.

---

## 🧩 System Workflow

* One **admin billing page** is used to generate bills
* Only **one staff member handles billing**
* Other staff focus on weighing fish and handing over orders
* Designed to match **real shop-floor workflow**, not generic POS assumptions

---

## 🛠️ Tech Stack (Frontend)

* **React** – UI development
* **Vite** – Fast build tool and dev server
* **JavaScript (ES6+)**
* **CSS** – Simple, clean styling

---

## ✨ Features

* Queue-based customer billing
* Editable bills before finalizing
* Live price updates
* Search functionality
* Sales and billing history view
* Clean UI optimized for daily shop usage

---

## 🔗 Backend Repository

The backend is developed using **Node.js, Express, and MongoDB Atlas**.

👉 **Backend GitHub Repository:**
[BillingSystem Frontend Repo Link](https://github.com/pranavtss/billingSystem-Backend.git)

Make sure the backend server is running before starting the frontend.

---

## ⚙️ Setup Instructions (Frontend)

1. Clone the repository

```bash
git clone <frontend-repo-url>
```

2. Navigate to the project folder

```bash
cd billingSystem-Frontend
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

## 🌐 Environment Configuration

Ensure the frontend API base URL points to the backend server (local or deployed).

Example:

```js
VITE_API_BASE_URL=http://localhost:5000
```


---

## 📌 Notes

* This project is built for **real-world small business usage**
* UI and features strictly follow fish shop owner needs
* Future scope includes analytics, role-based access, and performance optimizations

---

## 📜 License

This project is for **educational and learning purposes**.

---

⭐ If you find this project useful, feel free to star the repository!
