import { useEffect, useState } from "react";
import axios from "axios";
import "./Inventario.css";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [editarProducto, setEditarProducto] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  /* ===== OBTENER PRODUCTOS ===== */
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos`);
        setProductos(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Error al cargar los productos");
      }
    };

    obtenerProductos();
  }, [API_URL]);

  /* ===== ELIMINAR ===== */
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto definitivamente?")) return;

    try {
      await axios.delete(`${API_URL}/api/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
    } catch {
      alert("Error al eliminar producto");
    }
  };

  /* ===== EDITAR ===== */
  const abrirEditar = (producto) => {
    setEditarProducto(producto);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const actualizarProducto = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/productos/${editarProducto._id}`,
        {
          ...form,
          precio: Number(form.precio),
          stock: Number(form.stock),
        }
      );

      setProductos(
        productos.map((p) =>
          p._id === res.data._id ? res.data : p
        )
      );
      setEditarProducto(null);
    } catch {
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="inventario-container">
      <h2 className="titulo">Inventario</h2>

      {error && <p className="error">{error}</p>}

      {productos.length === 0 ? (
        <p className="empty">No hay productos registrados</p>
      ) : (
        <div className="tabla-wrapper">
          <table className="inventario-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>
                  <td className="acciones">
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditar(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => eliminarProducto(p._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL EDITAR ===== */}
      {editarProducto && (
        <div className="modal" onClick={() => setEditarProducto(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Producto</h3>

            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            />
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button className="btn-save" onClick={actualizarProducto}>
                Guardar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setEditarProducto(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
