import { useState } from "react";
import { register } from "../../services/api";
import logoBg from "../../assets/logo.png";
import "./auth.css";

interface Props {
  onSwitch: () => void;
}

const RegisterForm = ({ onSwitch }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await register(name, email, password);
      setSuccess("Cadastro realizado com sucesso!");

      setTimeout(() => {
        onSwitch();
      }, 1500);
    } catch (err: any) {
      if (err.status === 409) {
        setError("O email informado já está cadastrado!");
      } else if (err.status === 400) {
        setError("Preencha todos os campos corretamente!");
      } else {
        setError("Erro ao cadastrar usuário. Tente novamente.");
      }

      console.error("Erro capturado:", err.status, err.message);
    } finally {

      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <img src={logoBg} className="auth-logo" alt="Logo" />

        <div className="auth-modal">
          <h2 className="auth-title">CADASTRO</h2>

          <form className="auth-form" onSubmit={handleRegister}>
            <input
              className="auth-input"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              required
            />

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
            {success && <p className="auth-success">{success}</p>}

            <button
              className="auth-button"
              type="submit"
              disabled={isLoading || !!success}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="auth-text">
            Já possui conta?{" "}
            <span className="auth-link" onClick={onSwitch}>
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;