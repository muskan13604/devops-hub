# DevOpsHub AI Frontend

Welcome to our React application! This is the user interface where you interact with the dashboard.
Here is a simple explanation of **kya use krre h, kyun krre h, aur kaise use krna hai** (what we are using, why, and how).

## Kya Use Kar Rahe Hain (Tech Stack)

- **React & Vite**: Hum yeh use karte hain to build fast and interactive user interfaces. Vite makes it super quick to start our development server.
- **TailwindCSS**: Yeh hamari styling library hai. Iski madad se hum directly apne code mein classes likh kar ek modern aur premium design (like glassmorphism) bana sakte hain bina alag CSS files likhe.
- **React Router**: Jab aap "Deployments" ya "Settings" pe click karte ho bina page reload huye naya section khulta hai, yeh React Router ki wajah se hota hai.
- **Redux Toolkit**: Yeh hamara state manager hai. Jaise hi aap login karte ho, aapka user data aur Access Token yahan save ho jata hai taaki poori application ko pata ho ki aap logged in ho.
- **React Query & Axios**: Yeh backend server se data laane aur bhejne (API calls) ke liye use hota hai.

## Secure Authentication Kaise Kaam Karta Hai?
Security bahut zaroori hai! Humne JWT authentication aise setup kiya hai:
1. **Access Token**: Yeh token Redux memory me save hota hai. Yeh fast hai aur jab aap page refresh karte ho tab gaayab ho jata hai (which is safe).
2. **Refresh Token**: Yeh token backend ek HttpOnly cookie me bhejta hai. Ise koi hacker ya script chura nahi sakti. Jab Access Token expire hota hai, Axios automatically is cookie ka use karke naya token le aata hai bina aapko logout kiye!

## Features Included (Naye Updates!)
- **React Query for Data**: Jab bhi hum table mein projects search ya load karte hain, React Query background mein data fetch karta hai. Isse page load fast hota hai aur loading spinners automatically dikhte hain. Ismein humne search aur pagination bhi implement kiya hai!
- **GitHub Integration UI**: Ab aap projects banate waqt apna GitHub Token de sakte hain. React Query is token ka use karke aapke saare repositories fetch karega aur aap ek dropdown se directly repository select kar sakte hain!

## Kaise Use Karein (How to run)

1. Apne environment variables set karein:
   Copy `.env.example` to `.env`.

2. Server start karein (from the root folder):
   ```bash
   pnpm --dir frontend dev
   ```

The application will start on port `5173`. Open it in your browser, login, and click on "Projects" to see the magic!
