import { useEffect, useState } from "react";
import axios from "axios";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/productos`
      );
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los productos");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Lista de productos</h2>

      {productos.length === 0 ? (
        <p>No hay productos registrados</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p._id}>
              {p.nombre} - {p.categoria} - ${p.precio} - Stock: {p.stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
