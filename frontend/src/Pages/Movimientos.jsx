import { useEffect, useState } from "react";
import axios from "axios";
import "./Movimientos.css";

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  // ✅ API URL con fallback para producción
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://ferreteria-alejandra.onrender.com";

  useEffect(() => {
    obtenerMovimientos();
  }, [API_URL]);

  const obtenerMovimientos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/movimientos`);
      setMovimientos(res.data);
      setError("");
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
      setError("Error al cargar los movimientos");
    }
  };

  return (
    <div className="table-card">
      <h3>Movimientos de Inventario</h3>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty">
                No hay movimientos registrados
              </td>
            </tr>
          ) : (
            movimientos.map((m) => (
              <tr key={m._id}>
                <td>{m.producto?.nombre || "Producto eliminado"}</td>

                <td
                  className={
                    m.tipo === "entrada" ? "entrada" : "salida"
                  }
                >
                  {m.tipo}
                </td>

                <td>
                  {m.tipo === "entrada"
                    ? `+${m.cantidad}`
                    : `-${m.cantidad}`}
                </td>

                <td>
                  {new Date(m.fecha).toLocaleDateString("es-EC")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
