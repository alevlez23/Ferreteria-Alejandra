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
    // Eliminamos cualquier información de sesión guardada.
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    /*
      BASE_URL permite que la redirección funcione tanto en:

      Render:
      /

      GitHub Pages:
      /Ferreteria_Alejandra/
    */
    window.location.href = import.meta.env.BASE_URL;
  };

  return (
    <div className="layout">
      {/* ================================================
          MENÚ LATERAL
      ================================================ */}
      <Navbar
        setVista={setVista}
        vista={vista}
        cerrarSesion={cerrarSesion}
      />

      {/* ================================================
          CONTENIDO PRINCIPAL
      ================================================ */}
      <main className="content">
        {/* ==============================================
            INICIO
        ============================================== */}
        {vista === "inicio" && (
          <section className="welcome-container">
            {/* Logo / nombre de la ferretería */}
            <div className="welcome-brand">
              <span className="brand-small">
                Ferretería
              </span>

              <span className="brand-line" />

              <h1 className="brand-big">
                Alejandra
              </h1>

              <p className="welcome-subtitle">
                Gestión de inventario, entradas y
                salidas en un solo lugar.
              </p>
            </div>

            {/* Imagen principal */}
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

        {/* ==============================================
            PRODUCTOS
        ============================================== */}
        {vista === "productos" && (
          <section className="productos-container">
            <FormProducto />

            <ListaProductos />
          </section>
        )}

        {/* ==============================================
            MOVIMIENTOS
        ============================================== */}
        {vista === "movimientos" && (
          <Movimientos />
        )}
      </main>
    </div>
  );
}
