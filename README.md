# MyTaxAssist — Registration & Authentication Module

A tax assistance application that collects client data for ITR filing.
Built with React Native, Node.js Fastify, and Firebase.

---

## Architecture
React Native (Frontend)
↓
Node.js Fastify (Backend)
↓
Firebase Admin SDK
↓
Firestore / Firebase Auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native + Expo + NativeWind |
| Backend | Node.js + Fastify + TypeScript |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Validation | Zod (backend) + Yup (frontend) |
| State | Zustand |
| Agent System | Kilo CLI |

---

## Project Structure
/frontend         → React Native app
/backend          → Fastify server
/firebase         → Firestore rules, emulator config
/shared-types     → Shared TypeScript types
/backend-api-contracts → API contracts
/design           → UI/UX mockups
/docs             → Architecture documentation
/.kilo            → Agent configuration

---

## Features Completed

- Email/Password Registration
- Google Sign-In Registration
- User profile stored in Firestore via backend
- Frontend → Backend → Firebase architecture enforced

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- Firebase project with email/password and Google Sign-In enabled
- Firebase Admin SDK service account key

### Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and fill in your Firebase credentials:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"
PORT=3001

Run backend:
```bash
npm run dev
```

### Frontend Setup
```bash
npm install
```

Create `.env.development` from `.env.example` and fill in your Firebase config:
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001

Run frontend:
```bash
npx expo start --clear
```

---

## Agent Architecture

This project uses Kilo CLI with dedicated agents for each layer:

| Agent | Responsibility |
|---|---|
| Backend Architect | Approves all design decisions |
| Backend Developer | Fastify API + business logic |
| Firebase Developer | Firestore rules + Auth config |
| Frontend Developer | React Native screens + API integration |
| Code Reviewer | Code quality enforcement |
| Testing | Unit + integration tests |

---

## Security

- No direct Firestore writes from frontend
- All credentials via environment variables
- Firebase Admin SDK on backend only
- Zod validates all API inputs
- Firestore rules deny all client writes

---

## Testing

- Backend: Jest + Supertest
- Frontend: React Native Testing Library
- End-to-End: Playwright

---

## Contributing

Contributions are welcome! Please review the agent architecture above and submit pull requests through the appropriate agent channels.

---

## License

This project is licensed under the MIT License.