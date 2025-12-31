import { useEffect, useState } from "react";
import axios from "axios";
import "./Movimientos.css";

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  // Obtener movimientos
  useEffect(() => {
    const obtenerMovimientos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/movimientos`
        );
        setMovimientos(res.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar movimientos:", err);
        setError("Error al cargar los movimientos");
      }
    };
    obtenerMovimientos();
  }, []);

  return (
    <div className="movimientos-container">
      <h2 className="titulo">Movimientos de Inventario</h2>

      {error && <p className="error">{error}</p>}

      <div className="movimientos-grid">
        {movimientos.length === 0 ? (
          <p className="empty">No hay movimientos registrados</p>
        ) : (
          movimientos.map((m) => (
            <div
              className={`movimiento-card ${
                m.tipo === "entrada" ? "entrada" : "salida"
              }`}
              key={m._id}
            >
              <div className="mov-info">
                <h3>{m.producto?.nombre || "Producto eliminado"}</h3>
                <p>
                  <strong>Tipo:</strong> {m.tipo}
                </p>
                <p>
                  <strong>Cantidad:</strong>{" "}
                  {m.tipo === "entrada" ? `+${m.cantidad}` : `-${m.cantidad}`}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(m.fecha).toLocaleDateString("es-EC")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
