import { useEffect, useState } from "react";
import axios from "axios";
import "./Movimientos.css";

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerMovimientos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/movimientos`
        );
        setMovimientos(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Error al cargar los movimientos");
      }
    };

    obtenerMovimientos();
  }, []);

  return (
    <div className="movimientos-container">
      <h2 className="titulo">Movimientos de Inventario</h2>

      {error && <p className="error">{error}</p>}

      <div className="movimientos-table">
        <div className="movimientos-header">
          <span>Producto</span>
          <span>Tipo</span>
          <span>Cantidad</span>
          <span>Fecha</span>
        </div>

        {movimientos.length === 0 ? (
          <p className="empty">No hay movimientos registrados</p>
        ) : (
          movimientos.map((m) => (
            <div
              key={m._id}
              className={`movimientos-row ${
                m.tipo === "entrada" ? "entrada" : "salida"
              }`}
            >
              <span>{m.producto?.nombre || "Producto eliminado"}</span>
              <span className={`tipo ${m.tipo}`}>
                {m.tipo.toUpperCase()}
              </span>
              <span>
                {m.tipo === "entrada"
                  ? `+${m.cantidad}`
                  : `-${m.cantidad}`}
              </span>
              <span>
                {new Date(m.fecha).toLocaleDateString("es-EC")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
