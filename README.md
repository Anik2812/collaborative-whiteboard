# 🎨 Collaborative Whiteboard

<div align="center">

![Collaborative Whiteboard Logo](https://github.com/user-attachments/assets/a50c8c79-f695-4d76-ab1c-3c7fa82d33e1)



[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

</div>

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)

## 🔍 About

Collaborative Whiteboard is a real-time, interactive web application that allows users to create, share, and collaborate on digital whiteboards. With a robust React frontend and a powerful Node.js backend, this application provides a seamless and secure collaborative experience.

## ✨ Features

- 🖌️ Real-time collaboration using Socket.io
- 🔐 Secure user authentication
- 📋 Multiple whiteboard management
- 🏠 User-friendly home page
- 📱 Responsive design
- 🔒 JWT-based authentication
- 🗄️ MongoDB database integration

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Anik2812/collaborative-whiteboard.git
   ```
   
2. Install NPM packages:
   ```
     cd collaborative-whiteboard/frontend
     npm install
     cd ../backend
     npm install
   ```
   
3. Set up environment variables and create a `.env` file in the backend directory with the following variables:
   ```
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      PORT=5000
   ```

4. Start the backend server:
    `npm start`

5. Start the frontend development server:
   `cd ../backend
    npm start
   `

## 🖥️ Usage

- Register/Login: Create an account or log in to access your whiteboards.
- Create a Whiteboard: Click on the "Create New Whiteboard" button.
- Collaborate: Share the whiteboard URL with your team to start collaborating in real-time.
- Manage Whiteboards: View and manage all your whiteboards from the dashboard.

## 🛠️ Technologies
#Frontend

* React
* Material-UI
* React Router

# Backend

* Node.js
* Express.js
* MongoDB
* Socket.io
* JSON Web Tokens (JWT)

## 🌐 API Endpoints

- POST /api/auth/register: Register a new user
- POST /api/auth/login: Login user
- GET /api/whiteboard: Get all whiteboards for a user
- POST /api/whiteboard: Create a new whiteboard
- GET /api/whiteboard/:id: Get a specific whiteboard
- PUT /api/whiteboard/:id: Update a whiteboard
- DELETE /api/whiteboard/:id: Delete a whiteboard

---
<div align="center">
  Made by Anik
</div>
