# DevOpsHub AI

[![CI/CD Pipeline](https://github.com/devopshub-user/devopshub-backend/actions/workflows/main.yml/badge.svg)](https://github.com/devopshub-user/devopshub-backend/actions/workflows/main.yml)

DevOpsHub AI is an advanced, AI-driven DevOps automation and monitoring platform. It is engineered with robust data structures, efficient algorithms, and intelligent systems to streamline your CI/CD pipelines, visualize Kubernetes topologies, and automate YAML generation.

---

## 🏗 Architecture

The platform consists of a Node.js Express backend serving APIs for Kubernetes, Docker, Jenkins, and GitHub integrations. It utilizes:
- **Graph & Topological Sort**: For resolving complex deployment dependency graphs.
- **Priority Queues**: To schedule critical production deployments ahead of staging/dev environments.
- **Trie (Prefix Trees)**: For O(m) rapid autocomplete suggestions of CLI commands.
- **LRU Caches**: Optimized with HashMaps and Doubly Linked Lists to cache heavy network requests (Jenkins logs, Pod Info).
- **Segment Trees**: For rapid O(log n) range queries on CPU/Memory telemetry over time.
- **Union Find (DSU)**: To dynamically build node topology networks and detect isolated cluster components.
- **Dynamic Programming (Edit Distance / LCS)**: For precisely generating semantic diffs between Kubernetes YAML manifest iterations.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis (Concepts mapped via Data Structures)
- **AI Engine**: OpenAI API (`gpt-3.5-turbo`)
- **CI/CD**: Jenkins, GitHub Actions
- **Infrastructure**: Kubernetes (MicroK8s), Docker
- **Automation**: Ansible
- **Testing**: Jest, Supertest
- **Documentation**: Swagger / OpenAPI 3.0

## 🚀 Installation

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/devopshub-user/devopshub-backend.git
   cd devopshub-backend/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your `OPENAI_API_KEY`.
4. Run the server:
   ```bash
   npm run dev
   ```

### 🐳 Docker Run
```bash
docker build -t devopshub-backend .
docker run -p 3000:3000 --env-file .env devopshub-backend
```

## 🚢 Deployment

Deployment is fully automated using Ansible and Kubernetes.

1. **Provision the Servers**:
   Navigate to the `ansible/` directory and run the playbooks on your host inventory:
   ```bash
   ansible-playbook -i hosts install-docker.yml
   ansible-playbook -i hosts install-jenkins.yml
   ansible-playbook -i hosts install-kubernetes.yml
   ```
2. **Deploy the App**:
   ```bash
   ansible-playbook -i hosts deploy-devopshub.yml
   ```
   This automatically applies the manifests located in the `k8s/` folder, including Deployments, Services, ConfigMaps, Secrets, Ingress, and the Horizontal Pod Autoscaler.

## 🖼 Screenshots

*(Placeholders for future UI elements)*

- **AI YAML Generator**
  > `[Screenshot of natural language prompt generating K8s YAML]`
- **Monitoring Dashboard**
  > `[Screenshot of CPU/Memory charts powered by the Segment Tree]`
- **Topology Map**
  > `[Screenshot of Union Find derived Node clusters]`

## 📚 API Documentation

Once the backend is running, you can explore and test the endpoints via the integrated Swagger UI:
- **Swagger Dashboard**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🔮 Future Scope

- **Real-time WebSockets**: Push logs from Jenkins and K8s Pods directly to the frontend.
- **Distributed Caching**: Migrate the in-memory LRU Cache to a distributed Redis cluster for multi-node deployments.
- **AI Agent Auto-Remediation**: Use the AI Engine not just for generating YAML, but for diagnosing crash loops and applying patches automatically.
