import { useEffect, useState } from "react";
import axios from "axios";
import "../components/Inventario.css"; // 

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState("");

  /* ===== OBTENER MOVIMIENTOS ===== */
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
    <div className="card">
      <h2>Movimientos de Inventario</h2>

      {error && <p className="error">{error}</p>}

      {movimientos.length === 0 ? (
        <p className="empty">No hay movimientos registrados</p>
      ) : (
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
            {movimientos.map((m) => (
              <tr key={m._id}>
                <td>{m.producto?.nombre || "Producto eliminado"}</td>
                <td className={m.tipo === "entrada" ? "entrada" : "salida"}>
                  {m.tipo}
                </td>
                <td>
                  {m.tipo === "entrada" ? `+${m.cantidad}` : `-${m.cantidad}`}
                </td>
                <td>{new Date(m.fecha).toLocaleDateString("es-EC")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
