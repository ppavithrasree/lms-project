# Learning Management System (LMS) - College Project Report

## 📖 Introduction
This project is a fully functional **Learning Management System (LMS)** designed to help users discover, create, and enroll in online courses. It acts as a digital classroom platform where users can manage their educational journey.

We built this project to demonstrate our understanding of modern full-stack web development, client-server architecture, database management, and UI/UX design.

---

## 🛠️ Technology Stack Used
This project is built using the **MERN-like Stack** (MongoDB, Express, React/Next.js, Node.js). 

### 1. Frontend (The User Interface)
- **Framework:** **Next.js** (A powerful React framework). We used Next.js because it provides fast rendering and an excellent developer experience.
- **Styling:** **Tailwind CSS v3**. Instead of writing raw CSS, we used Tailwind to rapidly design a modern, responsive, "glassmorphism" (frosted glass) dark theme.
- **Animations:** **Framer Motion**. Used to make the website feel alive with smooth entrance animations, hover effects, and transitions.
- **Icons:** **Lucide-React**. For clean and scalable vector icons.
- **HTTP Client:** **Axios**. Used to securely send and receive data from our backend server.

### 2. Backend (The Server)
- **Runtime:** **Node.js**. Allows us to run JavaScript outside the browser.
- **Framework:** **Express.js**. A lightweight framework used to create our API routes (like `/register`, `/login`, `/courses`).
- **Database Connector:** **Mongoose**. An elegant Object Data Modeling (ODM) library that helps our server talk to MongoDB.
- **Middleware:** **CORS** (Cross-Origin Resource Sharing). Allows our frontend (running on port 3000) to safely request data from our backend (running on port 5000).

### 3. Database (Data Storage)
- **Database:** **MongoDB Atlas** (Cloud Database). We chose a NoSQL database because it stores data in flexible, JSON-like documents, making it perfect for dynamic course and user data. By using Atlas (the cloud version), our database is accessible from anywhere without needing local installation.

---

## 📊 Database Models (Schema)
Our database consists of three main collections:
1. **Users:** Stores registered users (`name`, `email`, `password`).
2. **Courses:** Stores available courses (`title`, `description`, `image`).
3. **Enrollments:** Connects a user to a course (`email`, `courseId`, `title`).

---

## 💻 How to Run the Project Locally

To run this project on any computer, you need to have **Node.js** installed.

### Step 1: Start the Backend Server
The backend handles all database communication and logic.
1. Open a terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
*(You should see "Server running on port 5000" in the terminal. **Leave this terminal open.**)*

### Step 2: Start the Frontend Application
The frontend is what the user actually sees and interacts with.
1. Open a **new, second terminal** window.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and go to: **`http://localhost:3000`**

---

## 🚀 Key Features Implemented
* **Authentication:** Users can register for a new account and securely log in.
* **Course Catalog:** Users can browse a dynamically rendered grid of available courses.
* **Enrollment System:** Logged-in users can enroll in courses with a single click.
* **Dashboard:** A personalized "My Courses" page showing learning progress.
* **Course Creation:** Authorized users can add new courses to the database with a title, description, and cover image.
* **Modern UI/UX:** A responsive, animated, dark-mode styling that looks professional and high-tech.
* **Interactive Feedback:** Custom browser alerts natively block the screen to confirm successful actions (like enrollment or registration) or handle errors.

---

## ❓ Potential Interview/Viva Questions & Answers

**Q: Why did you use MongoDB instead of SQL?**
> **A:** Because an LMS involves dynamic data (like courses that might have varying attributes), NoSQL provides flexibility. MongoDB's JSON-like document structure pairs perfectly with JavaScript and our Node backend.

**Q: What is the purpose of Axios?**
> **A:** Axios is an HTTP client. It is what our Next.js frontend uses to send POST/GET requests to our Express backend. For example, when a user clicks "Login", Axios sends the email and password to port 5000.

**Q: How does the application remember that a user is logged in?**
> **A:** When a login is successful, we store the user's email in the browser's `localStorage`. The Navbar and other components check this `localStorage` to determine if they should show "Login" or "My Courses / Logout".

**Q: What is `server.js` doing?**
> **A:** It is our main backend file. It connects to MongoDB Atlas, defines our database models, and sets up our REST API endpoints (like `app.post("/register")`). It listens for requests on port 5000, processes them, and sends a response back to the frontend.
