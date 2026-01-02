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
