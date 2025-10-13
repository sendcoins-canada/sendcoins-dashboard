import "./App.css";
import Signup from "./components/onboarding/Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/onboarding/Login";
import Verify from "./pages/onboarding/Verify";
import Country from "./pages/onboarding/Country";
import PersonalInfo from "./pages/onboarding/PersonalInfo";
import Password from "./pages/onboarding/Password";
import Survey from "./pages/onboarding/Survey";
import Welcome from "./pages/onboarding/Welcome";
import Passcode from "./pages/onboarding/Passcode";
import CTA from "./pages/onboarding/CTA";
import Address from "./pages/kyc/Address";
import ProtectedRoute from "./components/ProtectedRoutes";
import Home from "./pages/dashboard/Home/Home";
import Recipients from "./pages/dashboard/Recipients";
import Transactions from "./pages/dashboard/Transactions";
import CreateWallet from "./pages/dashboard/Home/Components/CreateWallet";
import SendFlow from "./pages/dashboard/Home/Components/Send/Send";
import EnterConvertAmount from "./pages/dashboard/Home/Components/Convert/EnterConvertAmount";
// import ConvertFlow from "./pages/dashboard/Home/Components/Convert/EnterConvertAmount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/verify" element={<Verify />} />
        <Route path="/country" element={<Country />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/password" element={<Password />} />
        {/* 
        <Route path="/survey" element={<Survey />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/setup-passcode" element={<Passcode />} />
        <Route path="/cta" element={<CTA />} />
        <Route path="/address" element={<Address />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} /> */}
        {/* Protected routes */}


        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <Survey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup-passcode"
          element={
            <ProtectedRoute>
              <Passcode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cta"
          element={
            <ProtectedRoute>
              <CTA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/recipients"
          element={
            <ProtectedRoute>
              <Recipients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/create-wallet"
          element={
            <ProtectedRoute>
              <CreateWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/send"
          element={
            <ProtectedRoute>
              <SendFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/convert"
          element={
            <ProtectedRoute>
              <EnterConvertAmount />
            </ProtectedRoute>
          }
        />


        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
