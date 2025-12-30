import { useEffect, useState } from "react";
import axios from "axios";
import "./ListaProductos.css";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [editarProducto, setEditarProducto] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  // 🔹 Usar la URL del backend desde la variable de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  /* ===== OBTENER PRODUCTOS ===== */
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos`);
        setProductos(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los productos");
      }
    };
    obtenerProductos();
  }, [API_URL]);

  /* ===== AGREGAR PRODUCTO ===== */
  const handleAgregarProducto = async () => {
    const { nombre, categoria, precio, stock } = nuevoProducto;

    if (!nombre.trim() || !categoria.trim() || precio === "" || stock === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/productos`, {
        nombre,
        categoria,
        precio: Number(precio),
        stock: Number(stock),
      });

      setProductos([...productos, res.data]);
      setNuevoProducto({ nombre: "", categoria: "", precio: "", stock: "" });
    } catch (err) {
      console.error(err);
      alert("Error al agregar producto");
    }
  };

  /* ===== ELIMINAR PRODUCTO ===== */
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto definitivamente?")) return;

    try {
      await axios.delete(`${API_URL}/api/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    }
  };

  /* ===== ABRIR MODAL EDITAR ===== */
  const abrirEditar = (producto) => {
    setEditarProducto(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  /* ===== INPUTS ===== */
  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  /* ===== GUARDAR CAMBIOS PRODUCTO ===== */
  const actualizarProducto = async () => {
    const { nombre, categoria, precio, stock } = nuevoProducto;

    if (!nombre.trim() || !categoria.trim() || precio === "" || stock === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/api/productos/${editarProducto._id}`, {
        nombre,
        categoria,
        precio: Number(precio),
        stock: Number(stock),
      });

      setProductos(productos.map((p) => (p._id === res.data._id ? res.data : p)));
      setEditarProducto(null);
      setNuevoProducto({ nombre: "", categoria: "", precio: "", stock: "" });
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="card">
      <h2>Inventario</h2>

      {error && <p className="error">{error}</p>}

      {/* ===== FORM AGREGAR PRODUCTO ===== */}
      {!editarProducto && (
        <div className="form-agregar">
          <h3>Agregar producto</h3>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={nuevoProducto.categoria}
            onChange={handleChange}
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={nuevoProducto.stock}
            onChange={handleChange}
          />
          <button onClick={handleAgregarProducto}>Agregar producto</button>
        </div>
      )}

      {/* ===== TABLA DE PRODUCTOS ===== */}
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
                  <button className="btn-edit" onClick={() => abrirEditar(p)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => eliminarProducto(p._id)}>
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
          <div className="form-editar" onClick={(e) => e.stopPropagation()}>
            <h3>Editar producto</h3>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={handleChange}
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={nuevoProducto.categoria}
              onChange={handleChange}
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button className="btn-save" onClick={actualizarProducto}>
                Guardar cambios
              </button>
              <button className="btn-cancel" onClick={() => setEditarProducto(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
