import { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

type AuthView = "welcome" | "login" | "signUp";

export default function AuthFlow() {
  const [view, setView] = useState<AuthView>("welcome");

  if (view === "login") return <LoginScreen onBack={() => setView("welcome")} onSignUp={() => setView("signUp")} />;
  if (view === "signUp") return <SignUpScreen onBack={() => setView("welcome")} onLogin={() => setView("login")} />;
  return <WelcomeScreen onLogin={() => setView("login")} onSignUp={() => setView("signUp")} />;
}