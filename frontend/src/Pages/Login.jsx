import "../styles/Login.css";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // URL DEL BACKEND
  // =====================================================
  // En Render toma VITE_API_URL de las variables de entorno.
  // En GitHub Pages se agrega durante GitHub Actions.
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://ferreteria-alejandra.onrender.com";

  // =====================================================
  // INICIAR SESIÓN
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const usuarioLimpio = usuario.trim();

    if (!usuarioLimpio || !password) {
      setError("Debe completar todos los campos");
      return;
    }

    try {
      setCargando(true);

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          usuario: usuarioLimpio,
          password,
        }
      );

      // Guardar usuario autenticado
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.usuario)
      );

      // Ir al dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Error al iniciar sesión:",
        err
      );

      setError(
        err.response?.data?.msg ||
          "No se pudo iniciar sesión"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-card"
        onSubmit={handleLogin}
      >
        <h2 className="login-title">
          Ferretería Alejandra
        </h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
          autoComplete="username"
          disabled={cargando}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          autoComplete="current-password"
          disabled={cargando}
        />

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? "Ingresando..."
            : "Ingresar"}
        </button>

        {error && (
          <p className="error">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
