# Avoza Premium E-Commerce Platform

Avoza is a modern, full-stack aesthetic e-commerce platform built to prioritize minimalism, performance, and highly intuitive user experiences.

## 🏛 Architecture overview
Avoza is structured around a typical MERN (MongoDB, Express, React, Node) multi-tier architecture separated into clean frontend and backend microservices:

1. **Frontend**: Vite-powered React application. Global state is completely managed by `Zustand` rather than Redux for minimal boilerplate. UI is styled with Tailwind CSS v3 and animated flawlessly with `Framer Motion`. 
2. **Backend**: Express API running Node.js 20+. Integrated seamlessly with MongoDB Atlas via Mongoose. Features JWT stateless authentication logic encapsulated via dedicated Middlewares.
3. **Continuous Integration**: Managed securely through GitHub Actions across three primary workflows (CI/CD, PR Checks, and EC2 Auto-Deployments). E2E integrity is tracked automatically via Cypress. Tests handle mocking through MongoDB-in-memory to provide lightning-fast executions.

## 🛠 Design Decisions
- **Modularity:** Controllers and Route handlers were cleanly separated in the backend to ensure maximum reusability and isolated Unit/Integration tests.
- **Micro-Interactions over Overlays:** We avoided popups or aggressive modals (which cheapen aesthetics). Actions like adding to bag are built into native flows.
- **Idempotency:** Deployment pipelines were built cleanly (`pm2 restart || pm2 start`), guaranteeing the GitHub runner can apply deployments dynamically without fearing broken pre-existing states.

## ⚡ Challenges Overcome
- MacOS Port Hijacking: Standard development ports like 5000 are often occupied by internal OS mechanics (like Airplay Receiver). Avoza dynamically mitigates this by rerouting its Vite proxy rules to dynamically open Node clusters on safe ports (5001).
- React Context Hell: Instead of heavily nesting providers for Cart, User, and Wishlist context, we adopted `zustand` to inject deeply integrated component states universally while minimizing unnecessary re-renders.

## Testing Methodologies 
1. **Unit Testing:** Verified via `Jest` (Backend logic parsing) and `Vitest` with React Testing Library (Frontend logic parsing).
2. **Integration Testing:** Verified using `Supertest` hooked directly to Express and `MongoDB Memory Server` to simulate genuine persistence without littering local or remote clusters. 
3. **E2E Testing:** Handled by Cypress headless nodes tracking actual pathing heuristics.
