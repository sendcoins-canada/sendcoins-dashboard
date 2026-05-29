import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css"
import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools }))
);
import { queryClient } from "./query/client";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId="420603153609-qcuu08bi474a8a6factcdigh9jno8p5k.apps.googleusercontent.com">
        <App />
        <Toaster />
        {import.meta.env.DEV && <Suspense fallback={null}><ReactQueryDevtools initialIsOpen={false} /></Suspense>}
         </GoogleOAuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>
);
