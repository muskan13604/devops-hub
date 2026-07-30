# DevOps Hub AI 🚀

Yeh ek complete DevOps dashboard application hai jo React (Frontend) aur Node.js/Express (Backend) ka use karta hai. Is project mein humne GitHub API aur Docker dono ko integrate kiya hai!

## 🛠️ Humne Abhi Tak Kya Kya Kiya Hai?

### 1. Authentication & Roles (Backend & Frontend)
- **Kya kiya:** JWT aur Cookies ka use karke secure login/register system banaya.
- **Kaise kiya:** Backend mein `auth.controller.js` banaya jo user password ko bcrypt se hash karta hai, aur JWT tokens generate karta hai. Frontend mein React Query aur Redux ka use karke user state manage kiya gaya hai.
- **Roles:** `Admin`, `Developer`, aur `Viewer` roles banaye hain jisse unauthorized users sensitive APIs access na kar sakein.

### 2. GitHub Integration
- **Kya kiya:** User ka GitHub Personal Access Token store karke unke repositories, branches aur latest commits fetch kiye.
- **Kaise kiya:** Backend mein `github.service.js` fetch API use karta hai GitHub se data laane ke liye. Frontend mein ek dedicated "Repositories" page aur ek slide-over panel banaya hai jo directly branches aur unke commits dikhata hai.

### 3. Dockerization (Docker Compose)
- **Kya kiya:** Pure frontend, backend aur database (MongoDB) ko Docker containers ke andar daal diya. Nginx ka setup kiya as a reverse proxy.
- **Kaise kiya:** 
  - `backend/Dockerfile`: Node Alpine base image use karke backend setup kiya aur usme `docker` CLI install kiya.
  - `frontend/Dockerfile`: Multi-stage build (Node se build karke Nginx se serve kiya).
  - `docker-compose.yml`: Frontend, Backend, MongoDB aur ek Nginx API gateway ko ek sath connect kiya.

### 4. Docker APIs & UI (Host Machine ke Docker se baat karna)
- **Kya kiya:** Aisi APIs banayi jo backend se directly Docker images list, pull, build aur delete kar sakti hain, aur frontend pe iska ek mast "Docker Engine" page banaya hai!
- **Kaise kiya:** Backend Docker container ke andar host machine ka Docker socket (`/var/run/docker.sock`) mount kiya gaya hai. Backend mein Node ka `child_process.exec` use karke hum backend se real terminal commands (jaise `docker images`) run karte hain. Frontend pe ek modal banaya hai jo in commands ka raw output (logs) ek dark terminal view mein dikhata hai.

### 5. Jenkins CI/CD Integration
- **Kya kiya:** "Deployments" section ko ek fully functional Jenkins Dashboard mein convert kiya jisse hum jobs trigger kar sakte hain aur build history dekh sakte hain.
- **Kyu kiya:** Kyunki DevOps dashboard bina CI/CD ke adhura hai! Jenkins se directly pipelines trigger karna bahut zaruri hai.
- **Kaise kiya:** 
  - Backend mein naya `jenkins` module banaya jo Jenkins REST API se baat karta hai (Basic Auth use karke).
  - Jenkins configuration (URL, Username, Token) ko dynamically MongoDB ke user document mein store kiya (jaise GitHub token).
  - Jab bhi build trigger hota hai, ek naya `jenkinsHistory` collection MongoDB mein entry store karta hai taaki hume past builds ka record mile, bina baar baar Jenkins ko load kiye.
  - Frontend (`DeploymentsPage.jsx`) pe ek modal setup kiya hai jo Jenkins se build ka live log console (`consoleText`) fetch karke dikhata hai.

## 🚀 Isko Run Kaise Karein?

Docker compose ka use karke pura project ek single command se start ho jata hai:

```bash
docker-compose up --build
```
Yeh command Nginx ko port `80` par start karega:
- **Frontend URL:** `http://localhost`
- **Backend API:** `http://localhost/api`

Sab set hai! Agar aap naye containers ya features add karna chahte hain, to bas code change karke `docker-compose up --build` wapas run karein.
