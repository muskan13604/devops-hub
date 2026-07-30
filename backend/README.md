# DevOpsHub AI Backend

Welcome to the backend server! This handles all the data and business logic for our application.
We have built this using some of the most popular and powerful tools available. 

Here is a simple explanation of **kya use krre h, kyun krre h, aur kaise use krna hai** (what we are using, why, and how).

## Kya Use Kar Rahe Hain (Tech Stack)

- **Node.js & Express**: Yeh hamara main server framework hai. Express makes it very easy to create APIs (like `/api/auth/login`) and handle requests from the frontend quickly and efficiently.
- **MongoDB**: Yeh hamara database hai. Hum apna data (like users) yahan save karte hain. It's a NoSQL database, which means it is very flexible and fast for storing JSON-like documents.
- **JWT (JSON Web Tokens)**: Yeh authentication ke liye use hota hai. Jab aap login karte ho, server aapko ek token deta hai. You use this token to prove who you are without sending your password every time. We also use **Refresh Tokens** so that you stay logged in securely.
- **bcryptjs**: Yeh passwords ko encrypt (hash) karne ke liye use hota hai. Hum kabhi bhi actual passwords database mein save nahi karte, sirf unka hashed version save hota hai for security.

## Features Included
- **User Authentication**: Register, Login, Logout using secure JWTs.
- **Password Hashing**: Securely storing user passwords.
- **Role Based Access Control (RBAC)**: Users can have roles like `Admin`, `Developer`, or `Viewer`. Humne ek special middleware (`authorize`) banaya hai to protect routes based on these roles!
- **Protected Routes**: APIs jinko access karne ke liye aapko pehle login karna padega.

## Kaise Use Karein (How to run)

1. Apne environment variables set karein:
   Copy `.env.example` to `.env` and put your MongoDB URI there.

2. Dependencies install karein:
   From the root of the project, run:
   ```bash
   pnpm install
   ```

3. Server start karein:
   ```bash
   pnpm --dir backend dev
   ```

The server will start on port `4000` (or whatever is in your `.env`).

## Demo Routes (RBAC in Action)
You can test the Role-Based Access Control using these routes:
- `GET /api/demo/public-info` (Any logged-in user can access)
- `GET /api/demo/dev-dashboard` (Only Admin and Developer can access)
- `GET /api/demo/admin-panel` (Only Admin can access)
