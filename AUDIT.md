# SendCoins Dashboard — Codebase Audit

**Date**: 2026-04-12
**Auditor**: Claude Code (Sonnet 4.6)
**Scope**: Full frontend audit — architecture, security, performance, code quality, testing, dependencies

---

## Table of Contents

1. [Architecture & Structure](#1-architecture--structure)
2. [Code Quality](#2-code-quality)
3. [Security](#3-security)
4. [Performance](#4-performance)
5. [Error Handling](#5-error-handling)
6. [API Design](#6-api-design)
7. [Database](#7-database)
8. [Testing](#8-testing)
9. [Dependency Hygiene](#9-dependency-hygiene)
10. [DevEx & Maintainability](#10-devex--maintainability)
11. [Summary](#summary)

---

## 1. Architecture & Structure

### God File — `authApi.tsx`
- **Location**: `src/api/authApi.tsx`
- **Severity**: 🔴 High
- **Problem**: Authentication, survey submission, crypto sends, fiat transfers, passcode creation/verification, and password reset are all crammed into one 255-line module. It is already the catch-all for every API interaction.
- **Fix**: Split into domain modules: `src/api/auth.ts`, `src/api/wallet.ts`, `src/api/survey.ts`, `src/api/passcode.ts`.

---

### Unprotected Onboarding Routes
- **Location**: `src/App.tsx:40-48`
- **Severity**: 🔴 High
- **Problem**: Routes `/verify`, `/country`, `/personal-info`, `/password` have zero protection. Anyone can navigate directly to `/country` without having gone through email verification. There is no session token requirement for these steps.
- **Fix**: Use a lightweight step-guard (e.g., check for a short-lived `authHash` in state before rendering each step) or push the full multi-step flow behind a single protected route with local state.

---

### Dual Data-Fetching Patterns
- **Location**: `src/query/` directory
- **Severity**: 🟡 Medium
- **Problem**: React Query is installed and configured, but `useUserQuery.ts` appears unused. The codebase mixes two data-fetching patterns (Redux thunks + React Query) without a clear ownership boundary.
- **Fix**: Pick one. Given the Redux-heavy architecture already in place, either migrate all async data fetching to React Query fully, or remove it and the devtools.

---

### Dead File — `selectors.ts`
- **Location**: `src/store/user/selectors.ts`
- **Severity**: 🟢 Low
- **Problem**: File is 100% commented out. A dead file sitting in the codebase.
- **Fix**: Delete it.

---

## 2. Code Quality

### Duplicate Interface Declarations
- **Location**: `src/store/auth/slice.ts:14-48`
- **Severity**: 🔴 High
- **Problem**: `AuthToken`, `User`, `Result`, and `AuthState` interfaces are each declared **twice** in the same file. TypeScript silently merges some; others are redundant.
- **Fix**: Remove the duplicate declarations (lines 38–48 repeat lines 14–36).

---

### 248 Lines of Commented-Out Dead Code
- **Location**: `src/pages/dashboard/Home/Components/Send/EnterPasscode.tsx:1-248`
- **Severity**: 🟡 Medium
- **Problem**: The entire previous implementation of the component sits commented out at the top of the file.
- **Fix**: Delete the commented block. Git history exists for a reason.

---

### Abandoned Feature — `notes` Field
- **Location**: `src/pages/dashboard/Home/Components/Send/Send.tsx:40`
- **Severity**: 🟡 Medium
- **Problem**: `const [notes, _setNotes] = useState<string>("");` — underscore prefix suppresses the unused-variable lint warning. The setter is never called. `narration: notes` will always be an empty string sent to the API.
- **Fix**: Either implement the notes field in the UI or remove it.

---

### Debug Log in Production
- **Location**: `src/pages/onboarding/Login.tsx:30`
- **Severity**: 🟡 Medium
- **Problem**: `console.log(token)` prints the auth token object to the browser console in production.
- **Fix**: Remove it.

---

### Delete Account is a Stub
- **Location**: `src/components/DashboardLayout.tsx:56`
- **Severity**: 🔴 High
- **Problem**: `handleDeleteAccount` does only `console.log("Deleting account...")`. The UI presents a "Delete Account" button. Nothing happens when a user confirms. This is a broken, potentially legally-required feature (GDPR right to erasure).
- **Fix**: Implement the API call or remove the UI button until it is implemented.

---

### Magic String localStorage Keys
- **Location**: Throughout (`"token"`, `"user"`, `"azertoken"`, `"result"`, `"email"`, `"verifyEmail"`, `"purpose"`)
- **Severity**: 🟡 Medium
- **Problem**: Magic string localStorage keys are scattered across 10+ files with no central definition. One typo creates a silent auth bug.
- **Fix**: Create `src/constants/storage.ts` with exported constants for every key.

---

### Hardcoded Greeting
- **Location**: `src/components/DashboardLayout.tsx:240`
- **Severity**: 🟢 Low
- **Problem**: `"Good Morning 👋"` is hardcoded. It says "Good Morning" at 11 PM.
- **Fix**: Derive greeting from `new Date().getHours()`.

---

## 3. Security

### Google OAuth Client ID Hardcoded in Source
- **Location**: `src/main.tsx:18`
- **Severity**: 🚨 Critical
- **Problem**: Google OAuth Client ID is hardcoded in source code:
  ```
  420603153609-qcuu08bi474a8a6factcdigh9jno8p5k.apps.googleusercontent.com
  ```
  This is committed to the repo and ships in the JS bundle. While OAuth client IDs are semi-public, hardcoding prevents rotation and exposes the exact OAuth application to abuse (consent phishing, token stuffing).
- **Fix**: Move to `VITE_GOOGLE_CLIENT_ID` environment variable.

---

### `.env` Committed with Real Credentials
- **Location**: `.env:2-3`
- **Severity**: 🚨 Critical
- **Problem**: `.env` is committed to the repository with what appear to be real MetaMap KYC credentials:
  ```
  VITE_METAMAP_CLIENT_ID=6978d840381ed86895150e8f
  VITE_METAMAP_FLOW_ID=6978d840e853a7a0093a6e20
  ```
- **Fix**: Add `.env` to `.gitignore` immediately. Add `.env.example` with placeholder values. Rotate the MetaMap credentials if this repo is or ever was accessible outside the team.

---

### Auth Token Transmitted in Request Body
- **Location**: `src/store/user/asyncRequests/fetchUser.ts:25-28`, `src/api/authApi.tsx:153`, `src/api/authApi.tsx:260-262`, `src/api/authApi.tsx:284-286`
- **Severity**: 🚨 Critical
- **Problem**: Auth token is passed as a **FormData body field**, not an `Authorization` header. Tokens in request bodies are logged by every proxy, load balancer, and API gateway in the chain.
  ```typescript
  // Current — token in body (wrong)
  formData.append("token", data.token);

  // Correct — token in header
  headers: { Authorization: `Bearer ${token}` }
  ```
- **Fix**: Add a request interceptor to axios that reads the token from Redux store and attaches it as an `Authorization: Bearer` header on every request. Remove all manual `formData.append("token", ...)` calls.

---

### No Token Expiry Validation
- **Location**: `src/store/auth/slice.ts:59-62`
- **Severity**: 🔴 High
- **Problem**: `expires_at` is stored in `AuthToken` but **never checked** before making API requests. Expired tokens are silently sent, resulting in opaque 401 errors with no user feedback or automatic token refresh.
- **Fix**: Add an axios response interceptor that catches 401s and dispatches `logout()`. Add a pre-request expiry check.

---

### Nuclear `localStorage.clear()` on Logout
- **Location**: `src/store/auth/slice.ts:93`
- **Severity**: 🔴 High
- **Problem**: `localStorage.clear()` wipes everything, including data stored by third-party libraries, the `purpose` key used for OTP routing, and any in-progress state.
- **Fix**: Enumerate and clear only the specific keys your app owns.

---

### Mixed Content Types — Inconsistent API Security Surface
- **Location**: `src/api/authApi.tsx` — mixed FormData and JSON
- **Severity**: 🔴 High
- **Problem**: `requestPasswordReset`, `verifyPasswordResetOtp`, `updatePasswordWithOtp`, and `changePasscode` send JSON. Everything else sends `multipart/form-data`. This is fragile and signals ad hoc API design.
- **Fix**: Standardize on JSON for all API calls unless actual file uploads are involved.

---

### Same Endpoint, Two Content Types
- **Location**: `src/api/authApi.tsx:175-182`
- **Severity**: 🟡 Medium
- **Problem**: `verifyPasswordResetOtp` and `verifyOtp` both hit `/auth/otp/verify`. `verifyOtp` uses FormData; `verifyPasswordResetOtp` uses JSON. Same endpoint, two formats.
- **Fix**: Use the same format for both.

---

### Unvalidated API Response in Google Login
- **Location**: `src/pages/onboarding/Login.tsx:56-81`
- **Severity**: 🟡 Medium
- **Problem**: `handleGoogleSuccess` uses `error: any` and accesses `data.data.token` / `data.data.result` without null checks. If the backend response shape changes, this silently navigates nowhere or crashes.
- **Fix**: Add type guards and validate the response shape before dispatching credentials.

---

## 4. Performance

### Polling Interval Memory Leak
- **Location**: `src/pages/dashboard/Home/Components/Send/Send.tsx:199-212`
- **Severity**: 🔴 High
- **Problem**: `pollTransferStatus()` returns a cleanup function but **the return value is discarded**. The `setInterval` inside runs every 3 seconds for up to 3 minutes (60 attempts × 3s). When the component unmounts (user navigates away), the polling continues firing API calls and calling `showDanger`/`showSuccess` on an unmounted component.
  ```typescript
  // Current — interval leaks on unmount
  pollTransferStatus(reference, onUpdate, onError);

  // Should be — inside useEffect
  const cleanup = pollTransferStatus(reference, onUpdate, onError);
  return () => cleanup();
  ```
- **Fix**: Store the cleanup function and call it when the component unmounts via `useEffect`.

---

### `window.innerWidth` in Render Path
- **Location**: `src/components/DashboardLayout.tsx:84, 254`
- **Severity**: 🟡 Medium
- **Problem**: `window.innerWidth < 640` is accessed directly in JSX on every render. It does not respond to window resize events and causes unnecessary layout reads.
- **Fix**: Use a `useWindowSize` hook with a resize event listener, or use CSS/Tailwind responsive classes instead.

---

### React Query Devtools Shipping to Production
- **Location**: `src/main.tsx:21`
- **Severity**: 🟡 Medium
- **Problem**: `<ReactQueryDevtools initialIsOpen={false} />` is included unconditionally, adding ~80KB to the production bundle.
- **Fix**: Wrap in `{import.meta.env.DEV && <ReactQueryDevtools />}`.

---

### Redundant Balance API Calls
- **Location**: `src/store/wallet/asyncThunks/getBalances.ts`
- **Severity**: 🟡 Medium
- **Problem**: Individual thunks for BTC, ETH, BNB, USDT, and USDC balances exist alongside `getAllBalanceThunk`. If all individual thunks fire alongside the aggregate call, that is 6 parallel requests for the same data.
- **Fix**: Use only `getAllBalanceThunk`. Remove the individual balance thunks if the backend supports the aggregate endpoint.

---

### `JSON.parse` in Render Without Memoization
- **Location**: `src/pages/onboarding/Survey.tsx:73`
- **Severity**: 🟡 Medium
- **Problem**: `JSON.parse(currentQuestion.question_options)` is called on every render without memoization.
- **Fix**: Wrap in `useMemo`.

---

## 5. Error Handling

### Survey Failure is Silently Swallowed
- **Location**: `src/pages/onboarding/Survey.tsx:57-59`
- **Severity**: 🔴 High
- **Problem**: Survey fetch failure shows only `console.error`. The UI freezes on "Loading surveys..." indefinitely with no user feedback or retry path.
  ```typescript
  } catch (err) {
    console.error("Failed to load surveys:", err); // no user feedback
  }
  ```
- **Fix**: Show an error state with a retry button.

---

### No React Error Boundary
- **Location**: Entire codebase
- **Severity**: 🔴 High
- **Problem**: Any unhandled exception in any component crashes the entire application with a blank white screen. For a fintech app handling crypto transfers, this is unacceptable.
- **Fix**: Wrap the app in an `ErrorBoundary` component at the root level. Add route-level boundaries for critical paths like `SendFlow`.

---

### Stale Closure in Auto-Submit Effect
- **Location**: `src/pages/dashboard/Home/Components/Send/EnterPasscode.tsx:327-331`
- **Severity**: 🟡 Medium
- **Problem**: `useEffect` auto-submits when `passcode.length === 4` but `handleSubmit` is not in the dependency array, capturing a stale closure with potentially stale `token` or `loading` values.
  ```typescript
  useEffect(() => {
    if (isComplete && !loading) {
      handleSubmit(); // stale closure risk
    }
  }, [passcode]); // missing: handleSubmit, loading
  ```
- **Fix**: Add `handleSubmit` and `loading` to the dependency array, or wrap `handleSubmit` in `useCallback`.

---

## 6. API Design

### No Axios Interceptors
- **Location**: `src/api/axios.ts`
- **Severity**: 🚨 Critical
- **Problem**: The axios instance has zero interceptors — no auth header injection, no 401 handling, no token refresh, no global error normalization. Every component manually handles auth and errors differently.
  ```typescript
  // The entire axios config — 9 lines, no interceptors
  const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
  ```
- **Fix**: Add a request interceptor (inject `Authorization: Bearer <token>`) and a response interceptor (catch 401 → dispatch logout; normalize error format).

---

### Inconsistent URL Namespacing
- **Location**: `src/api/authApi.tsx:46`
- **Severity**: 🟡 Medium
- **Problem**: `resendOtp` calls `/user/auth/resendOTP` but OTP send is at `/auth/otp/send`. Some routes are under `/user/auth/`, others under `/auth/`. No consistent pattern.
- **Fix**: Align with backend and document the URL convention.

---

### Profile Fetch is a POST
- **Location**: `src/store/user/asyncRequests/fetchUser.ts:28`
- **Severity**: 🟡 Medium
- **Problem**: User profile fetch is a `POST` to `/user/profile` with a token in the body. Profile fetching should be a `GET` request with the token in an `Authorization` header. `POST` implies creating a resource.
- **Fix**: Change to `GET /user/profile` with `Authorization: Bearer` header.

---

## 7. Database

Frontend only — no direct database access. Not applicable.

---

## 8. Testing

### Zero Test Coverage
- **Severity**: 🚨 Critical
- **Problem**: No test framework is installed (`vitest`, `jest`, `@testing-library/react` — none present in `package.json`). No test files exist anywhere in the repository.

  This is a **fintech application** that:
  - Handles cryptocurrency transfers
  - Processes fiat bank transfers
  - Manages KYC identity verification
  - Stores and processes auth tokens

  **Critical paths with zero coverage:**
  - Login flow and OTP verification
  - Send crypto (passcode verification → API call → polling)
  - Send fiat (bank details → amount → confirmation)
  - Token expiry and logout handling
  - Registration multi-step flow

- **Fix**: Install Vitest + @testing-library/react. Start with unit tests for auth thunks and integration tests for the login and send flows. Prioritize `sendCrypto`, `verifyPasscode`, and the polling logic.

---

## 9. Dependency Hygiene

### `next-themes` in a Vite Project
- **Location**: `package.json:22`
- **Severity**: 🔴 High
- **Problem**: `"next-themes": "^0.4.6"` is installed. This is a **Next.js** toolkit. This project is React + Vite — not Next.js. `next-themes` has Next.js-specific internals and appears unused (`ThemeProvider` is not present in the codebase).
- **Fix**: Remove it. Use a Vite-compatible theme solution if dark mode is needed.

---

### `@types/yup` Conflict with Yup 1.x
- **Location**: `package.json:15`
- **Severity**: 🟡 Medium
- **Problem**: `"@types/yup": "0.29.14"` is the DefinitelyTyped package for Yup **0.x**. Yup **1.x** ships its own TypeScript types. Having both causes type conflicts.
- **Fix**: Remove `@types/yup`. Yup 1.x types are built-in.

---

### `iconsax-react` Hard-Pinned at Ancient Alpha
- **Location**: `package.json:27`
- **Severity**: 🟡 Medium
- **Problem**: `"iconsax-react": "0.0.8"` is hard-pinned at an early alpha with no caret. Security patches will not auto-apply.
- **Fix**: Test compatibility with a recent version and upgrade.

---

### Three PDF/Image Generation Libraries
- **Location**: `package.json`
- **Severity**: 🟡 Medium
- **Problem**: `dom-to-image-more`, `html2canvas`, and `jspdf` are all installed — likely 300KB+ in the bundle for receipt generation. Verify all three are used and not duplicates of each other.
- **Fix**: Audit usage. Pick one approach.

---

## 10. DevEx & Maintainability

### `.env` with Real Credentials in Git
- **Location**: `.gitignore` (missing `.env` entry)
- **Severity**: 🚨 Critical
- **Problem**: `.env` with live MetaMap KYC credentials is committed to the repository. This is permanent in git history even if the file is later deleted.
- **Fix**: Add `.env` to `.gitignore`. Use `git filter-repo` to purge from history. Rotate all exposed credentials.

---

### No `.env.example`
- **Location**: Project root
- **Severity**: 🔴 High
- **Problem**: No `.env.example` file exists. A new developer cloning the repository has no documentation of required environment variables.
- **Fix**: Create `.env.example`:
  ```env
  VITE_API_BASE_URL=https://your-api-url.com
  VITE_METAMAP_CLIENT_ID=your-metamap-client-id
  VITE_METAMAP_FLOW_ID=your-metamap-flow-id
  VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
  ```

---

## Summary

### Top 5 — Fix Immediately

| # | Issue | Location |
|---|-------|----------|
| 1 | `.env` committed with real credentials — rotate keys, purge git history | `.env` |
| 2 | Auth token in request body — add axios interceptor with `Authorization: Bearer` header | `src/api/axios.ts` |
| 3 | Google OAuth Client ID hardcoded in source | `src/main.tsx:18` |
| 4 | Polling interval memory leak — store and call cleanup on unmount | `Send.tsx:199` |
| 5 | Delete account is a stub — implement the API call or remove the UI | `DashboardLayout.tsx:56` |

---

### Top 5 — Will Hurt at Scale

| # | Issue | Why It Hurts |
|---|-------|--------------|
| 1 | No auth interceptor / no token refresh | Every 401 silently fails. Users get stuck with expired sessions. Generates massive support tickets at scale. |
| 2 | Zero test coverage | Any refactor of `sendCrypto` or `verifyPasscode` is a minefield. A single logic bug can drain user wallets. |
| 3 | `authApi.tsx` god file | Every new endpoint lands here. Merge conflicts become constant. New developers cannot navigate it. |
| 4 | Mixed content types with no interceptor | Each new endpoint is a coin flip on how auth and content-type works. Bugs will compound. |
| 5 | No error boundary + silent failures | A crash in the Send flow shows a blank screen. Survey failures silently freeze onboarding. Drop-off is invisible without monitoring. |

---

### Overall Health Score: 3.5 / 10

> A fintech app handling real crypto and fiat transfers with credentials in git, zero tests, an auth token transmitted in request bodies instead of headers, a non-functional delete account button, and no error boundaries is not production-ready. The folder structure and UI implementation are reasonable — the security and reliability foundations are critically weak.
