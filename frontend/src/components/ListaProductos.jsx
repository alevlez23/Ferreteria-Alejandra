import { useEffect, useState } from "react";
import axios from "axios";
import "./ListaProductos.css";

const API_URL = "http://192.168.1.23:3000";

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

  /* ===== OBTENER PRODUCTOS ===== */
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      setError("Error al cargar los productos");
    }
  };

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

  /* ===== ABRIR MODAL ===== */
  const abrirEditar = (producto) => {
    setEditarProducto(producto);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  /* ===== INPUTS ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== GUARDAR CAMBIOS ===== */
  const actualizarProducto = async () => {
    if (
      !form.nombre.trim() ||
      !form.categoria.trim() ||
      form.precio === "" ||
      form.stock === ""
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

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
    <div className="card">
      <h2>Inventario</h2>

      {error && <p className="error">{error}</p>}

      {productos.length === 0 ? (
        <p className="empty">No hay productos registrados</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>
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
      )}

      {/* ===== MODAL EDITAR ===== */}
      {editarProducto && (
        <div className="modal" onClick={() => setEditarProducto(null)}>
          <div
            className="form-editar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Editar producto</h3>

            <label>
              Nombre
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </label>

            <label>
              Categoría
              <input
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              />
            </label>

            <label>
              Precio
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
              />
            </label>

            <div className="modal-actions">
              <button className="btn-save" onClick={actualizarProducto}>
                Guardar cambios
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
