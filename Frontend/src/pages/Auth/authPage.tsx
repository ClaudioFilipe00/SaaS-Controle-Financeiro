import { useState } from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import "./auth.css";
import "../../App.css"

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="auth-container">
      {mode === "login" ? (
        <LoginForm onSwitch={() => setMode("register")} />
      ) : (
        <RegisterForm onSwitch={() => setMode("login")} />
      )}
    </div>
  );
};

export default AuthPage;