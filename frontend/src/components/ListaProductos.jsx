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
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // =====================================================
  // OBTENER PRODUCTOS
  // =====================================================
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/productos`
        );

        setProductos(res.data);
        setError("");
      } catch (err) {
        console.error(
          "Error al cargar productos:",
          err
        );

        setError("Error al cargar los productos");
      }
    };

    obtenerProductos();
  }, [API_URL]);

  // =====================================================
  // ELIMINAR PRODUCTO
  // =====================================================
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Desea eliminar este producto definitivamente?"
    );

    if (!confirmar) return;

    try {
      await axios.delete(
        `${API_URL}/api/productos/${id}`
      );

      setProductos((productosActuales) =>
        productosActuales.filter(
          (producto) => producto._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Error al eliminar producto:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Error al eliminar producto"
      );
    }
  };

  // =====================================================
  // ABRIR MODAL PARA EDITAR
  // =====================================================
  const abrirEditar = (producto) => {
    setEditarProducto(producto);

    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
    });
  };

  // =====================================================
  // MANEJAR CAMBIOS DEL FORMULARIO
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((formActual) => ({
      ...formActual,
      [name]: value,
    }));
  };

  // =====================================================
  // ACTUALIZAR INFORMACIÓN DEL PRODUCTO
  // =====================================================
  const actualizarProducto = async () => {
    if (!editarProducto) return;

    const nombre = form.nombre.trim();
    const categoria = form.categoria.trim();
    const precio = Number(form.precio);

    if (!nombre || !categoria) {
      alert(
        "El nombre y la categoría son obligatorios"
      );
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      alert("Ingrese un precio válido mayor que 0");
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/productos/${editarProducto._id}`,
        {
          nombre,
          categoria,
          precio,
        }
      );

      setProductos((productosActuales) =>
        productosActuales.map((producto) =>
          producto._id === res.data._id
            ? res.data
            : producto
        )
      );

      setEditarProducto(null);

      alert("Producto actualizado correctamente");
    } catch (err) {
      console.error(
        "Error al actualizar producto:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Error al actualizar producto"
      );
    }
  };

  // =====================================================
  // REGISTRAR ENTRADA O SALIDA
  // =====================================================
  const ajustarStock = async (producto, tipo) => {
    const mensaje =
      tipo === "entrada"
        ? `¿Cuántas unidades desea AGREGAR a "${producto.nombre}"?`
        : `¿Cuántas unidades desea RETIRAR de "${producto.nombre}"?`;

    const cantidadTexto = window.prompt(mensaje);

    // Si el usuario presiona Cancelar
    if (cantidadTexto === null) {
      return;
    }

    const cantidad = Number(cantidadTexto);
    const stockActual = Number(producto.stock);

    // Validar cantidad
    if (
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      alert(
        "Ingrese una cantidad entera mayor que 0"
      );
      return;
    }

    // Validar que exista stock suficiente
    if (
      tipo === "salida" &&
      cantidad > stockActual
    ) {
      alert(
        `Stock insuficiente.\n\n` +
          `Stock disponible: ${stockActual}\n` +
          `Salida solicitada: ${cantidad}`
      );

      return;
    }

    // Calcular el nuevo stock
    const nuevoStock =
      tipo === "entrada"
        ? stockActual + cantidad
        : stockActual - cantidad;

    try {
      const res = await axios.put(
        `${API_URL}/api/productos/${producto._id}`,
        {
          stock: nuevoStock,
        }
      );

      // Actualizar tabla sin recargar la página
      setProductos((productosActuales) =>
        productosActuales.map((p) =>
          p._id === res.data._id
            ? res.data
            : p
        )
      );

      if (tipo === "entrada") {
        alert(
          `Entrada registrada correctamente.\n\n` +
            `Producto: ${producto.nombre}\n` +
            `Entrada: +${cantidad}\n` +
            `Stock actual: ${nuevoStock}`
        );
      } else {
        alert(
          `Salida registrada correctamente.\n\n` +
            `Producto: ${producto.nombre}\n` +
            `Salida: -${cantidad}\n` +
            `Stock actual: ${nuevoStock}`
        );
      }
    } catch (err) {
      console.error(
        "Error al modificar stock:",
        err
      );

      alert(
        err.response?.data?.msg ||
          "Error al actualizar el inventario"
      );
    }
  };

  return (
    <div className="inventario-container">
      <h2 className="titulo">Inventario</h2>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {productos.length === 0 ? (
        <p className="empty">
          No hay productos registrados
        </p>
      ) : (
        <div className="tabla-wrapper">
          <table className="inventario-tabla">
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
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>
                    {producto.nombre}
                  </td>

                  <td>
                    {producto.categoria}
                  </td>

                  <td>
                    $
                    {Number(
                      producto.precio
                    ).toFixed(2)}
                  </td>

                  <td>
                    {producto.stock}
                  </td>

                  <td className="acciones">
                    {/* ENTRADA */}
                    <button
                      type="button"
                      className="btn-entry"
                      onClick={() =>
                        ajustarStock(
                          producto,
                          "entrada"
                        )
                      }
                    >
                      Entrada
                    </button>

                    {/* SALIDA */}
                    <button
                      type="button"
                      className="btn-exit"
                      onClick={() =>
                        ajustarStock(
                          producto,
                          "salida"
                        )
                      }
                      disabled={
                        Number(producto.stock) <= 0
                      }
                    >
                      Salida
                    </button>

                    {/* EDITAR */}
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() =>
                        abrirEditar(producto)
                      }
                    >
                      Editar
                    </button>

                    {/* ELIMINAR */}
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() =>
                        eliminarProducto(
                          producto._id
                        )
                      }
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

      {/* =================================================
          MODAL PARA EDITAR
      ================================================= */}
      {editarProducto && (
        <div
          className="modal"
          onClick={() =>
            setEditarProducto(null)
          }
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3>Editar Producto</h3>

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
              min="0.01"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="btn-save"
                onClick={
                  actualizarProducto
                }
              >
                Guardar
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  setEditarProducto(null)
                }
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
