import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SoundReady from "./pages/SoundReady";
import Sergio from "./pages/Sergio";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookieConsentBanner from "./components/CookieConsentBanner";
import Contact from "./pages/Contact";

function Router() {
  return (
    <>
      <CookieConsentBanner />
      <Switch>
        <Route path={"/"} component={SoundReady} />
        <Route path={"/sergio"} component={Sergio} />
        <Route path={"/privacy-policy"} component={PrivacyPolicy} />
        <Route path={"/terms-of-service"} component={TermsOfService} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
