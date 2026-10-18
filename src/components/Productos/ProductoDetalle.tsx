
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useProduct } from "../../hooks";

import {
  getDescripcionProducto,
  getMedidasProducto,
  getEquivalenciasProducto,
} from "../../actions/product";

import "./ProductoDetalle.css";

type MedidaItem = {
  nombre: string;
  valor: string;
};

function obtenerListaMedidas(
  medidas: {
    altura?: string | number | null;
    largo?: string | number | null;
    ancho?: string | number | null;
    especificaciones?: string | null;
  } | null | undefined
): MedidaItem[] {
  if (!medidas) return [];

  const resultado: MedidaItem[] = [];

  // Agrega una medida si todavía no existe con el mismo nombre y valor.
  function agregar(nombre: string, valor: string) {
    const valorLimpio = valor.trim();

    if (!valorLimpio) return;

    const valorConUnidad =
      nombre.toLowerCase() !== "rosca" &&
      !/\bmm\b/i.test(valorLimpio) &&
      !/\bcm\b/i.test(valorLimpio)
        ? `${valorLimpio} mm`
        : valorLimpio;

    const duplicada = resultado.some(
      (item) =>
        item.nombre === nombre &&
        item.valor.toLowerCase() === valorConUnidad.toLowerCase()
    );

    if (!duplicada) {
      resultado.push({
        nombre,
        valor: valorConUnidad,
      });
    }
  }

  // Primero incorporamos las columnas estructuradas.
  if (medidas.altura != null && String(medidas.altura).trim()) {
    agregar("Altura", String(medidas.altura));
  }

  if (medidas.largo != null && String(medidas.largo).trim()) {
    agregar("Largo", String(medidas.largo));
  }

  if (medidas.ancho != null && String(medidas.ancho).trim()) {
    agregar("Ancho", String(medidas.ancho));
  }

  // Después interpretamos las especificaciones adicionales.
  const lineas = (medidas.especificaciones ?? "")
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  for (const linea of lineas) {
    const separador = linea.indexOf(":");

    if (separador === -1) continue;

    const etiquetaOriginal = linea.slice(0, separador).trim();
    const valor = linea.slice(separador + 1).trim();

    if (!etiquetaOriginal || !valor) continue;

    const etiqueta = etiquetaOriginal
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    let nombre = etiquetaOriginal
      .replace(/\s*\(mm\)/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (/^altura\b/.test(etiqueta)) {
      nombre = "Altura";
    } else if (/^(diam|diametro)\s*(ext|exterior)\b/.test(etiqueta)) {
      nombre = "Diámetro exterior";
    } else if (/^(diam|diametro)\s*(int|interior)\b/.test(etiqueta)) {
      nombre = "Diámetro interior";
    } else if (/^emp\s*\(di\)/.test(etiqueta)) {
      nombre = "Empaque (di)";
    } else if (/^emp\s*\(de\)/.test(etiqueta)) {
      nombre = "Empaque (de)";
    } else if (/^largo\b/.test(etiqueta)) {
      nombre = "Largo";
    } else if (/^ancho\b/.test(etiqueta)) {
      nombre = "Ancho";
    } else if (/^rosca\b/.test(etiqueta)) {
      nombre = "Rosca";
    }

    // No repetimos una medida idéntica que ya vino en una columna.
    const mismoValor = resultado.some(
      (item) =>
        item.nombre === nombre &&
        item.valor.replace(/\s+/g, "").toLowerCase() ===
          valor.replace(/\s+/g, "").toLowerCase()
    );

    if (mismoValor) continue;

    // Si hay varios diámetros interiores, distinguimos cada uno.
    if (nombre === "Diámetro interior") {
      const existentes = resultado.filter(
        (item) =>
          item.nombre === "Diámetro interior" ||
          /^Diámetro interior \d+$/.test(item.nombre)
      );

      nombre =
        existentes.length > 0
          ? `Diámetro interior ${existentes.length + 1}`
          : nombre;
    }

    agregar(nombre, valor);
  }

  return resultado;
}


export default function ProductoDetalle() {
  const { idproducto } = useParams();

  //const productId = Number(idproducto);
  const productId = Number(idproducto);

  // Obtener el catálogo de productos
  const {
    products,
    isLoading,
    error,
  } = useProduct();

  // Obtener la descripción larga
  const {
    data: descripcion,
    isLoading: cargandoDescripcion,
  } = useQuery({
    queryKey: ["descripcion", productId],
    queryFn: () => getDescripcionProducto(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });

  // Obtener las medidas y especificaciones
  const {
    data: medidas,
    isLoading: cargandoMedidas,
  } = useQuery({
    queryKey: ["medidas", productId],
    queryFn: () => getMedidasProducto(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });

  // Obtener las equivalencias
  const {
    data: equivalencias,
    isLoading: cargandoEquivalencias,
  } = useQuery({
    queryKey: ["equivalencias", productId],
    queryFn: () => getEquivalenciasProducto(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });
  const listaMedidas = obtenerListaMedidas(medidas);
   // Mostrar resultados en la consola para depurar
  console.log("ID de la URL:", idproducto);
  console.log("ID convertido:", productId);
  console.log("Medidas recibidas:", medidas);
  console.log("Equivalencias recibidas:", equivalencias);

  // Estado de carga del catálogo
  if (isLoading) {
    return (
      <main className="detalle-estado">
        Cargando información del producto...
      </main>
    );
  }

  // Error al consultar los productos
  if (error) {
    return (
      <main className="detalle-estado">
        <p>No se pudo cargar el producto.</p>
        <Link to="/">Volver al catálogo</Link>
      </main>
    );
  }

  // Buscar el producto según el identificador de la URL
  const producto = products.find(
    (item) => item.idproducto === productId
  );

  // Producto inexistente
  if (!producto) {
    return (
      <main className="detalle-estado">
        <h1>Producto no encontrado</h1>
        <p>Verifica el código o regresa al catálogo.</p>
        <Link to="/">← Volver al catálogo</Link>
      </main>
    );
  }

  return (
    <main className="detalle-pagina">
      {/* Encabezado */}
      <header className="detalle-header">
        <Link to="/" className="detalle-logo">
          KUSA<span>.</span>
        </Link>

        <span className="detalle-header-texto">
          CATÁLOGO DE FILTROS
        </span>
      </header>

      <div className="detalle-contenedor">
        {/* Ruta de navegación */}
        <nav className="detalle-migas" aria-label="Ruta">
          <Link to="/">Catálogo</Link>
          <span>/</span>
          <span>Detalle del producto</span>
        </nav>

        <Link to="/" className="detalle-volver">
          <span aria-hidden="true">←</span>
          Volver a productos
        </Link>

        {/* Información principal */}
        <section className="detalle-principal">
          <div className="detalle-imagen-panel">
            <span className="detalle-imagen-etiqueta">
              PRODUCTO KUSA
            </span>

            {producto.imagenUrl ? (
              <img
                className="detalle-imagen"
                src={producto.imagenUrl}
                alt={producto.codigoKusa || "Producto KUSA"}
              />
            ) : (
              <div className="detalle-sin-imagen">
                Imagen no disponible
              </div>
            )}

            <p className="detalle-imagen-pie">
              Imagen referencial del producto
            </p>
          </div>

          <div className="detalle-resumen">
            <p className="detalle-eyebrow">
              INFORMACIÓN DEL PRODUCTO
            </p>

            <span className="detalle-categoria">
              {producto.Categoria || "Sin categoría"}
            </span>

            <h1 className="detalle-codigo">
              {producto.codigoKusa || "Código no disponible"}
            </h1>

            <h2 className="detalle-nombre">
              {producto.Categoria || "Filtro automotriz"}
            </h2>

            <p className="detalle-descripcion">
              {descripcion?.descripcion_larga ||
                (cargandoDescripcion
                  ? "Cargando descripción..."
                  : "Descripción técnica no disponible.")}
            </p>

            <div className="detalle-datos">
              <div className="detalle-dato">
                <span>Presentación</span>
                <strong>
                  {producto.presentacion || "No especificada"}
                </strong>
              </div>
            </div>

            <div className="detalle-nota">
              <span className="detalle-nota-icono">i</span>
              <p>
                Utiliza el código del producto para identificar
                la referencia que necesitas.
              </p>
            </div>
          </div>
        </section>

        {/* 01. Descripción */}
        <section className="detalle-seccion">
          <div className="detalle-seccion-titulo">
            <span className="detalle-seccion-icono">01</span>

            <div>
              <h2>Descripción del producto</h2>
              <p>Información general y características</p>
            </div>
          </div>

          <div className="detalle-descripcion-card">
            <span className="detalle-mini-etiqueta">
              DESCRIPCIÓN
            </span>

            <p>
              {descripcion?.descripcion_larga ||
                (cargandoDescripcion
                  ? "Cargando descripción..."
                  : "No hay una descripción registrada para este producto.")}
            </p>

            <div className="detalle-descripcion-meta">
              <span>Código de referencia</span>
              <strong>
                {producto.codigoKusa || "Código no disponible"}
              </strong>
            </div>
          </div>
        </section>

        {/* 02. Medidas */}
       <section className="detalle-seccion">
  <div className="detalle-seccion-titulo">
    <div>
      <h2>Medidas del catálogo</h2>
      <p>
        Especificaciones técnicas registradas para este producto.
      </p>
    </div>
  </div>

  {cargandoMedidas ? (
    <p>Cargando medidas...</p>
  ) : listaMedidas.length > 0 ? (
    <div className="detalle-medidas-grid">
      {listaMedidas.map((medida, index) => (
        <article
          className="detalle-medida-card"
          key={`${medida.nombre}-${index}`}
        >
          <span
            className="detalle-medida-icono"
            aria-hidden="true"
          >
            ↔
          </span>

          <span className="detalle-medida-label">
            {medida.nombre}
          </span>

          <strong>{medida.valor}</strong>

          <small>Registrada</small>
        </article>
      ))}
    </div>
  ) : (
    <p className="detalle-aclaracion">
      No hay medidas registradas para este producto.
    </p>
  )}
</section>

        {/* 03. Equivalencias */}
        <section className="detalle-seccion">
          <div className="detalle-seccion-titulo">
            <span className="detalle-seccion-icono">03</span>

            <div>
              <h2>Equivalencias</h2>
              <p>Códigos alternativos de otras marcas</p>
            </div>
          </div>

          <div className="detalle-equivalencias">
            <div className="detalle-tabla-cabecera">
              <h3>Códigos equivalentes</h3>

              <span className="detalle-total">
                {cargandoEquivalencias
                  ? "Cargando..."
                  : `${equivalencias?.length ?? 0} referencias`}
              </span>
            </div>

            <div className="detalle-tabla-scroll">
              <table className="detalle-tabla">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Código equivalente</th>
                  </tr>
                </thead>

                <tbody>
                  {cargandoEquivalencias ? (
                    <tr>
                      <td colSpan={2}>
                        Cargando equivalencias...
                      </td>
                    </tr>
                  ) : equivalencias && equivalencias.length > 0 ? (
                    equivalencias.map((equivalencia) => (
                      <tr key={equivalencia.idEquivalencia}>
                        <td>
                          {equivalencia.marcaEquivalente}
                        </td>
                        <td>
                          {equivalencia.codigoEquivalente || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2}>
                        <div className="detalle-tabla-vacia">
                          <span className="detalle-vacio-icono">
                            ↔
                          </span>

                          <strong>
                            Sin equivalencias registradas
                          </strong>

                          <p>
                            Este producto todavía no tiene códigos
                            equivalentes disponibles.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
       
        {/* Pie de página */}
        <footer className="detalle-footer">
          <Link to="/" className="detalle-boton-volver">
            ← Volver al catálogo
          </Link>

          <span>KUSA · Catálogo de filtros</span>
        </footer>
      </div>
    </main>
  );
}

