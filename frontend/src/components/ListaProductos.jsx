import { useEffect, useState } from "react";
import axios from "axios";
import "./ListaProductos.css";

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

  // Obtener productos
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/productos`
        );
        setProductos(res.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los productos");
      }
    };
    obtenerProductos();
  }, []);

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto definitivamente?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`);
      setProductos(productos.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar producto");
    }
  };

  // Abrir edición
  const abrirEditar = (producto) => {
    setEditarProducto(producto);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  // Inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Actualizar producto
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
        `${import.meta.env.VITE_API_URL}/api/productos/${editarProducto._id}`,
        {
          ...form,
          precio: Number(form.precio),
          stock: Number(form.stock),
        }
      );
      setProductos(productos.map((p) => (p._id === res.data._id ? res.data : p)));
      setEditarProducto(null);
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="inventario-container">
      <h2 className="titulo">Inventario de Productos</h2>

      {error && <p className="error">{error}</p>}

      <div className="productos-grid">
        {productos.length === 0 ? (
          <p className="empty">No hay productos registrados</p>
        ) : (
          productos.map((p) => (
            <div className="producto-card" key={p._id}>
              <div className="producto-info">
                <h3>{p.nombre}</h3>
                <p><strong>Categoría:</strong> {p.categoria}</p>
                <p><strong>Precio:</strong> ${p.precio}</p>
                <p><strong>Stock:</strong> {p.stock}</p>
              </div>
              <div className="producto-actions">
                <button className="btn-edit" onClick={() => abrirEditar(p)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => eliminarProducto(p._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Editar */}
      {editarProducto && (
        <div className="modal" onClick={() => setEditarProducto(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Producto</h3>
            <input name="nombre" value={form.nombre} onChange={handleChange} />
            <input name="categoria" value={form.categoria} onChange={handleChange} />
            <input type="number" name="precio" value={form.precio} onChange={handleChange} />
            <input type="number" name="stock" value={form.stock} onChange={handleChange} />
            <div className="modal-actions">
              <button className="btn-save" onClick={actualizarProducto}>Guardar</button>
              <button className="btn-cancel" onClick={() => setEditarProducto(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
