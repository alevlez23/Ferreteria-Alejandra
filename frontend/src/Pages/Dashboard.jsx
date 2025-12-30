import { useState } from "react";
import Navbar from "../components/Navbar";
import FormProducto from "../components/FormProducto";
import ListaProductos from "../components/ListaProductos";
import Movimientos from "./Movimientos";
import "./Dashboard.css";

export default function Dashboard() {
  const [vista, setVista] = useState("inicio");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="layout">
      <Navbar
        setVista={setVista}
        vista={vista}
        cerrarSesion={cerrarSesion}
      />

      <main className="content">
        {vista === "inicio" && (
          <div className="welcome-container">
           <h1 className="welcome-title">
          <span className="brand-small">Ferretería</span>
          <span className="brand-line"></span>
          <span className="brand-big">Alejandra</span>
      </h1>

            <img
              src="/ferreteria.png"
              alt="Ferretería"
              className="welcome-image"
            />
          </div>
        )}

        {vista === "productos" && (
          <div className="productos-container">
            <FormProducto />
            <ListaProductos />
          </div>
        )}

        {vista === "movimientos" && (
          <div className="movimientos-container">
            <Movimientos />
          </div>
        )}
      </main>
    </div>
  );
}
