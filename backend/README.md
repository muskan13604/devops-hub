# Backend API (DevOps Hub)

Yeh hamara backend hai jo Express.js aur MongoDB use karta hai. Isme JWT authentication, Role-Based Access Control (RBAC), GitHub API integration, aur abhi Docker APIs bhi add kiye gaye hain!

## Hum Kya Use Kar Rahe Hain?
- **Node.js & Express**: Fast aur simple APIs banane ke liye.
- **MongoDB**: Data (Users, Projects) store karne ke liye.
- **JWT (JSON Web Tokens)**: Secure login aur access control ke liye.
- **Docker**: Containerization aur command execution ke liye.

## Hum Kaise Run Karte Hain?
Naya update ke baad, aap isko easily Docker Compose ke zariye run kar sakte hain. Docker Compose frontend, backend, MongoDB aur Nginx sab ek sath run karega!

Terminal me root folder (`devopss hub`) me jaakar type karein:
```bash
docker-compose up --build
```
Yeh command Nginx ko port 80 pe start kar dega, aur aapka frontend automatically waha serve ho jayega!

## Naye Docker APIs
Ab hamara backend directly aapke host Docker se baat kar sakta hai (Socket mount ki wajah se). Naye API endpoints:
- `GET /api/docker/images` - Sabhi Docker images list karta hai.
- `POST /api/docker/images/pull` - Naya image pull karta hai (`imageName` body me pass karna hoga).
- `POST /api/docker/images/build` - Dockerfile se naya image build karta hai.
- `DELETE /api/docker/images/:imageId` - Image delete karta hai.

*(Note: Yeh sab Docker APIs role-based hain, yani sirf `Admin` aur `Developer` hi inhe access kar sakte hain!)*
