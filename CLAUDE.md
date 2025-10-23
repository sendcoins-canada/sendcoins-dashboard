# SendCoins Dashboard - Complete Codebase Documentation

## Project Overview
SendCoins Dashboard is a React-based cryptocurrency/financial services dashboard application with user authentication, KYC onboarding, and wallet management capabilities. Built with React 19, TypeScript, Vite, and TailwindCSS.

## Tech Stack
- **Framework**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 4.1.12 with class-variance-authority
- **State Management**: Redux Toolkit 2.8.2 with React-Redux 9.2.0
- **Routing**: React Router DOM 7.8.2
- **API Client**: Axios 1.11.0 with React Query 5.85.6
- **Authentication**: Google OAuth (@react-oauth/google)
- **Form Handling**: Formik 2.4.6 with Yup validation
- **UI Components**: Radix UI (dialogs, slots), Lucide React icons, Iconsax icons
- **Notifications**: Sonner toast library

## Project Structure
```
sendcoins-dashboard/
├── src/
│   ├── api/                    # API layer
│   │   ├── axios.ts            # Axios instance with base URL config
│   │   ├── authApi.tsx         # Authentication API endpoints
│   │   └── user.tsx            # User API endpoints
│   ├── assets/                 # Static assets (images, icons)
│   ├── components/             
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx      
│   │   │   ├── dialog.tsx      
│   │   │   ├── input.tsx       
│   │   │   ├── form.tsx        
│   │   │   ├── Modal.tsx       
│   │   │   ├── sonner.tsx      # Toast notifications
│   │   │   └── ...
│   │   ├── onboarding/         # Onboarding flow components
│   │   │   └── Signup.tsx      
│   │   ├── DashboardLayout.tsx # Main dashboard wrapper with sidebar
│   │   ├── Metamap.tsx         # KYC integration component
│   │   └── ProtectedRoutes.tsx # Auth guard component
│   ├── fonts.css               # Custom font definitions
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── Home/
│   │   │   │   ├── Home.tsx   # Main dashboard page
│   │   │   │   └── Components/
│   │   │   │       ├── CreateWallet.tsx
│   │   │   │       ├── Send/   # Send money flow
│   │   │   │       ├── Convert/ # Currency conversion
│   │   │   │       └── Fund/   # Fund wallet flow
│   │   │   ├── Recipients.tsx  # Recipients management
│   │   │   └── Transactions.tsx # Transaction history
│   │   ├── kyc/
│   │   │   └── Address.tsx     # KYC address verification
│   │   └── onboarding/
│   │       ├── Login.tsx        # Login page
│   │       ├── Verify.tsx       # Email/OTP verification
│   │       ├── Country.tsx      # Country selection
│   │       ├── PersonalInfo.tsx # Personal details
│   │       ├── Password.tsx     # Password setup
│   │       ├── Survey.tsx       # User survey
│   │       ├── Welcome.tsx      # Welcome screen
│   │       ├── Passcode.tsx     # Passcode setup
│   │       └── CTA.tsx          # Call to action
│   ├── query/
│   │   ├── client.ts           # React Query client config
│   │   └── hooks/
│   │       └── useUserQuery.ts # User query hooks
│   ├── store/                  # Redux store
│   │   ├── index.ts           # Store configuration
│   │   ├── auth/              
│   │   │   └── slice.ts       # Auth state management
│   │   ├── registration/
│   │   │   └── slice.ts       # Registration state
│   │   └── user/
│   │       ├── slice.ts       # User state
│   │       ├── selectors.ts   # User selectors
│   │       └── asyncRequests/ 
│   ├── types/
│   │   ├── onboarding.ts      # Onboarding type definitions
│   │   └── user.ts            # User type definitions
│   ├── App.tsx                # Main app component with routes
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles
├── public/                    # Public assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
└── vercel.json                # Vercel deployment config
```

## Authentication Flow
1. **Entry Points**: `/login` or `/signup`
2. **Email Verification**: User enters email → OTP sent → Verify OTP
3. **Registration**: Country selection → Personal info → Password creation
4. **Post-Registration**: Survey → Welcome → Passcode setup → CTA → Address (KYC)
5. **Protected Routes**: All dashboard routes require authentication token
6. **Token Storage**: JWT stored in localStorage as `token` and `azertoken`

### Survey Implementation Notes
- Survey gets user email from Redux store (most reliable) with localStorage fallbacks
- Email storage varies by flow: login uses `"email"`, signup uses `"verifyEmail"`
- Survey only requires email parameter (azerid requirement removed)
- Backend API `/user/survey/submit` expects: email, configid, questionid, answers

## Key Features

### 1. User Onboarding
- Multi-step registration with email verification
- Country selection with currency support
- Personal information collection
- Password and passcode setup
- User survey for personalization
- KYC integration via Metamap

### 2. Dashboard Features
- **Home**: Wallet balance, quick actions (Send, Convert, Fund)
- **Recipients**: Manage payment recipients
- **Transactions**: View transaction history
- **Settings**: User preferences and account settings

### 3. Wallet Operations
- Create new wallet
- Send money/crypto
- Convert between currencies
- Fund wallet

### 4. Security
- JWT-based authentication
- Protected route implementation using Redux state
- Passcode for transaction security
- Google OAuth integration

## API Integration

### Base Configuration
```typescript
// API base URL from environment
baseURL: import.meta.env.VITE_API_BASE_URL
```

### Main API Endpoints
- `/user/auth/email/verify` - Email verification
- `/user/auth/verifyOTP` - OTP verification
- `/user/auth/registerWithPassword` - User registration
- `/user/auth/loginWithPassword` - User login
- `/user/auth/create/passcode` - Passcode creation
- `/active/survey` - Get active survey
- `/user/survey/submit` - Submit survey
- `/currency/all` - Get supported countries/currencies

## Environment Variables Required
```env
VITE_API_BASE_URL=<your-api-base-url>
VITE_METAMAP_CLIENT_ID=<metamap-client-id-for-kyc>
VITE_METAMAP_FLOW_ID=<metamap-flow-id-for-kyc>
```

**Note**: Google OAuth Client ID is hardcoded in main.tsx:
`420603153609-qcuu08bi474a8a6factcdigh9jno8p5k.apps.googleusercontent.com`

## State Management

### Redux Store Structure
- **auth**: Authentication state (token, user, loading, error)
- **registration**: Registration flow state
- **user**: User profile and preferences

### Local Storage
- `token`: JWT authentication token object
- `user`: User profile object
- `azertoken`: Azer service token

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## API Keys & External Services

### Required API Keys:
1. **VITE_API_BASE_URL**: Backend API endpoint (required)
2. **VITE_METAMAP_CLIENT_ID**: Metamap KYC service client ID (required for KYC)
3. **VITE_METAMAP_FLOW_ID**: Metamap KYC flow identifier (required for KYC)

### Integrated Services:
- **Google OAuth**: Authentication (client ID embedded in code)
- **Metamap**: KYC/Identity verification service

## Important Notes
1. The app uses multipart/form-data for all API requests
2. Token refresh/expiry handling needs implementation
3. Protected routes check for token presence in Redux store
4. Dashboard layout includes persistent sidebar navigation
5. The app supports dark mode via next-themes package
6. All forms use Formik with Yup validation schemas

## TailwindCSS v4 Configuration
- **Custom colors** are defined in `src/App.css` using `@theme inline` block, NOT in tailwind.config.ts
- **Available custom colors**: 
  - `primaryblue` (#57B5FF)
  - `textgray` (#D2D2D2)
- **Usage**: `bg-primaryblue`, `text-primaryblue`, `text-textgray`
- **Note**: TailwindCSS v4 uses CSS-based configuration instead of JS config for custom colors

## Build & Deployment
- Configured for Vercel deployment (vercel.json present)
- Uses Vite for fast HMR and optimized builds
- TypeScript strict mode for type safety
- ESLint configured for code quality

## Security Considerations
- Tokens stored in localStorage (consider more secure alternatives)
- Google OAuth client ID is exposed in source code
- API endpoints use HTTPS (ensure VITE_API_BASE_URL uses https://)
- Implement proper token refresh mechanism
- Add request interceptors for expired token handling