# 🧁 Sweet Shop Management System – Overview

The **Sweet Shop Management System** is a full-stack application that helps shop owners manage their sweet inventory. It supports adding, viewing, deleting, searching, sorting, purchasing, and restocking sweets.

---

## 🧪 Built with Test-Driven Development (TDD)

- All features are developed following TDD using **Jest** and **Supertest**.
- Tests are written before implementation to ensure reliability and maintainability.
- The backend is fully covered with meaningful test cases.

---

## 🛠 Backend: Express + JSON

- Developed with **Node.js** and **Express.js**.
- Follows a modular structure with clear separation of concerns (routes, controllers, services, models).

---

## 💻 Frontend: React + Tailwind

- Built using **React** and styled with **Tailwind CSS**.
- Features include forms, tables, and buttons for inventory control.
- Provides alerts and for feedback on user actions.
# ✨ Features

The Sweet Shop Management System includes a comprehensive set of features to efficiently manage sweet inventory.



### 🍬 Add Sweets  
Add new sweets with details like ID, name, category, price, and quantity.

---

### 🗑️ Delete Sweets  
Remove sweets from the inventory using their unique ID.

---

### 👀 View All Sweets  
Display a list of all available sweets in the system.

---

### 🔍 Search Sweets  
Search sweets by name, category, or a given price range.

---

### ↕️ Sort Sweets  
Sort sweets by name, category, or price in ascending or descending order.

---

### 🛒 Purchase Sweets  
Simulate purchasing sweets, reducing the available stock. Handles low-stock scenarios with proper validation.

---

### 📦 Restock Sweets  
Increase the quantity of existing sweets to replenish inventory.

---

### ✅ Test Coverage  
Each of the above features is covered with unit and integration tests using **Jest** and **Supertest**, ensuring reliability and correctness.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Nirzar12/kata_sweet_shop_system.git
  cd kata_sweet_shop_system
```

Install dependencies

```bash
  npm install
```
Now Go to the frontend directory and install packages 

```bash
  cd frontend
  npm install 
```

again go to the root folder and run backend and frontend in separate terminals

```bash
  cd ..
  npm run backend
  npm run frontend
```
## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## 🔗 Running URLs

- **Frontend:** [http://localhost:5173](http://localhost:5173)  
- **Backend (API Base URL):** [http://localhost:3000/api/sweets](http://localhost:3000/api/sweets)

## ⚠️ Disclaimer

When you first open and run this project on your system, the sweet inventory (stored in a local JSON file) will be empty.

Please make sure to **add sweets through the frontend interface first** using the "Add Sweet" form before testing other features like view, search, sort, purchase, or restock.






## 🌐 Environment Variables

No environment variables are required to run this project at the moment.

However, ensure that **MongoDB is installed and running locally** on your system, as the application connects to your local MongoDB instance by default.
## 📸 Screenshots

A collection of frontend UI screenshots is available in the **`/Screenshots`** folder located at the root of the project. These images showcase the user interface for key features such as adding, viewing, and managing sweets.

---

## 🧪 Test Report

Comprehensive test results for all backend functionalities are available in the **`/reports`** directory.  
You can view the detailed HTML report by opening **`test-report.html`** in your browser.

