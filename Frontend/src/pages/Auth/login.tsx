import { useState } from "react";
import { login } from "../../services/api";
import { useNavigate } from "react-router-dom";
import logoBg from "../../assets/logo.png";
import "./auth.css";

interface Props {
  onSwitch: () => void;
}

const LoginForm = ({ onSwitch }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      const nameToStore = data.user?.name || data.name || "Usuário";
      localStorage.setItem("userName", nameToStore);


      navigate("/home");
      
    } catch {

      setError("E-mail ou senha incorretos!"); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <img src={logoBg} className="auth-logo" alt="Logo" />

        <div className="auth-modal">
          <h2 className="auth-title">ACESSE SUA CONTA</h2>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              className="auth-input"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); 
              }}
              required
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
            />
            {error && <p className="auth-error">{error}</p>}

            <button 
              className="auth-button" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-text">
            Não tem conta?{" "}
            <span className="auth-link" onClick={onSwitch}>
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;