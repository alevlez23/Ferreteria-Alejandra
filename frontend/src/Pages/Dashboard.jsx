import { useState } from "react";
import Navbar from "../components/Navbar";
import FormProducto from "../components/FormProducto";
import ListaProductos from "../components/ListaProductos";
import Movimientos from "./Movimientos";
import "./Dashboard.css";

export default function Dashboard() {
  const [vista, setVista] = useState("inicio");

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Compatible con Render y GitHub Pages
    window.location.href = import.meta.env.BASE_URL;
  };

  return (
    <div className="layout">
      {/* MENÚ LATERAL */}
      <Navbar
        setVista={setVista}
        vista={vista}
        cerrarSesion={cerrarSesion}
      />

      {/* CONTENIDO */}
      <main className="content">
        {/* INICIO */}
        {vista === "inicio" && (
          <section className="welcome-container">
            <div className="welcome-brand">
              <span className="brand-small">
                Ferretería
              </span>

              <span className="brand-line" />

              <h1 className="brand-big">
                Alejandra
              </h1>

              <p className="welcome-subtitle">
                Gestión de inventario, entradas y salidas
                en un solo lugar.
              </p>
            </div>

            <div className="welcome-image-frame">
              <img
                src={`${import.meta.env.BASE_URL}ferreteria.png`}
                alt="Ferretería Alejandra"
                className="welcome-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </section>
        )}

        {/* PRODUCTOS */}
        {vista === "productos" && (
          <section className="productos-container">
            <FormProducto />
            <ListaProductos />
          </section>
        )}

        {/* MOVIMIENTOS */}
        {vista === "movimientos" && (
          <Movimientos />
        )}
      </main>
    </div>
  );
}
