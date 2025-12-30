import "../styles/Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Debe completar todos los campos");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", {
        usuario,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.usuario));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.msg || "Usuario o contraseña incorrectos"
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Ferretería Alejandra</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Ingresar</button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
