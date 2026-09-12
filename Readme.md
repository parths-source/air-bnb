🏡 Stayora

> A full-stack accommodation listing platform inspired by Airbnb, built using the MERN-style JavaScript ecosystem with Express, MongoDB, EJS and Node.js.

🔗 Live Demo: https://stayora-3503.onrender.com/listings



📌 About The Project

**Stayora** is a full-stack web application where users can explore, create, edit and manage property listings.

The project was built to understand how a real-world full-stack application works, including:

- MVC architecture
- RESTful routing
- MongoDB database integration
- User authentication
- CRUD operations
- Reviews and ratings
- Image uploads
- Cloud image storage
- Form validation
- Session management
- Flash messages
- Error handling
- Deployment

The application is deployed on **Render** and uses MongoDB for persistent data storage.


🚀 Live Demo

👉 **https://stayora-3503.onrender.com/listings**

---

✨ Features

🏠 Listings

- View all available properties
- View individual property details
- Create new listings
- Edit existing listings
- Delete listings
- Add property images
- Default images for listings without uploaded images

⭐ Reviews

- Add reviews to listings
- Give ratings from 1–5
- Display reviews on listing pages
- Delete reviews

🔐 Authentication

- User signup
- User login
- User logout
- Protected routes
- User-based authorization

 ☁️ Image Uploads

- Upload property images
- Cloud-based image storage using Cloudinary
- Automatic handling of listing images

⚠️ Validation & Error Handling

- Joi-based server-side validation
- Custom error handling
- Flash messages for user feedback
- Express middleware for request handling

📱 Responsive UI

- Bootstrap-based responsive design
- Clean property-card layout
- Responsive navigation
- Mobile-friendly pages

---

🛠️ Tech Stack

#Frontend

- HTML5
- CSS3
- JavaScript
- EJS
- EJS-Mate
- Bootstrap 5

#Backend

- Node.js
- Express.js
- REST APIs
- MVC Architecture

#Database

- MongoDB
- Mongoose

# Authentication

- Passport.js
- Passport-Local-Mongoose
- Express Session

##Image Storage

- Cloudinary
- Multer
- Multer Storage Cloudinary

#Validation

- Joi

# Deployment

- Render

---

## 🏗️ Project Architecture

Stayora
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── listings/
│   ├── users/
│   ├── includes/
│   └── layouts/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│   └── ExpressError.js
│
├── init/
│   └── data.js
│
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── README.md
