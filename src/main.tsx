import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css"
import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./query/client";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId="420603153609-qcuu08bi474a8a6factcdigh9jno8p5k.apps.googleusercontent.com">
        <App />
        <Toaster richColors position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} />
         </GoogleOAuthProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>
);
