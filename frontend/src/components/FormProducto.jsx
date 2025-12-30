import { useState } from "react";
import axios from "axios";
import "./FormProducto.css";

/* ===== URL DEL BACKEND ===== */
const API_URL = import.meta.env.VITE_API_URL;

export default function FormProducto() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ===== VALIDACIONES ===== */
    if (
      !form.nombre.trim() ||
      !form.categoria.trim() ||
      !form.precio ||
      !form.stock
    ) {
      setError("Todos los campos son obligatorios");
      setMensaje("");
      return;
    }

    if (Number(form.precio) <= 0 || Number(form.stock) < 0) {
      setError("Precio y stock deben ser valores válidos");
      setMensaje("");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/productos`, {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });

      setMensaje("Producto registrado correctamente");
      setError("");

      /* Limpiar formulario */
      setForm({
        nombre: "",
        categoria: "",
        precio: "",
        stock: "",
      });
    } catch (err) {
      setError("Error al registrar el producto");
      setMensaje("");
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Registrar Producto</h2>

      {error && <p className="error">{error}</p>}
      {mensaje && <p className="success">{mensaje}</p>}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />

      <input
        type="text"
        name="categoria"
        placeholder="Categoría"
        value={form.categoria}
        onChange={handleChange}
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />

      <button type="submit">Guardar</button>
    </form>
  );
}
