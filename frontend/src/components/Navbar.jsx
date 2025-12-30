import "./Navbar.css";
import {
  FaHome,
  FaBox,
  FaExchangeAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar({ setVista, vista, cerrarSesion }) {
  return (
    <aside className="sidebar">
      <h2>Sistema de Inventario</h2>

      <nav>
        <button
          className={vista === "inicio" ? "active" : ""}
          onClick={() => setVista("inicio")}
        >
          <FaHome />
          <span>Inicio</span>
        </button>

        <button
          className={vista === "productos" ? "active" : ""}
          onClick={() => setVista("productos")}
        >
          <FaBox />
          <span>Productos</span>
        </button>

        <button
          className={vista === "movimientos" ? "active" : ""}
          onClick={() => setVista("movimientos")}
        >
          <FaExchangeAlt />
          <span>Movimientos</span>
        </button>
      </nav>

      <button className="logout" onClick={cerrarSesion}>
        <FaSignOutAlt />
        <span>Salir</span>
      </button>
    </aside>
  );
}
