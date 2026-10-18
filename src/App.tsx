// Componente que muestra los botones de paginación.
import { Paginacion } from "./components/Productos/Paginacion";
import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Importamos la lista única de categorías y la función
// que unifica nombres como "FILTRO AIRE" y "FILTRO DE AIRE".
import {
  normalizarCategoria,
  categorias,
} from "./utils/Categorias";

// Hook que obtiene todos los productos desde Supabase.
import { useProduct } from "./hooks";

// Componente que muestra la cuadrícula de productos.
import { ProductGrid } from "./components/Productos/ProductoGrid";

// Página con el detalle de cada producto.
import ProductoDetalle from "./components/Productos/ProductoDetalle";

// Estilos del catálogo.
import "./App.css";

function Catalogo() {
  // Guarda la página que está seleccionada.
const [paginaActual, setPaginaActual] = useState(1);

// Cantidad máxima de productos por página.
const productosPorPagina = 12;

// Categoría seleccionada.

  // Categoría seleccionada en los botones y el panel lateral.
  const [categoria, setCategoria] = useState("Todas");

  // Texto escrito en el buscador.
  const [busqueda, setBusqueda] = useState("");

  // Obtenemos todos los productos de Supabase.
  const {
    products: todosLosProductos,
    isLoading: cargandoTodos,
    error: errorTodos,
  } = useProduct();

  // Evitamos errores si todavía no se han cargado los productos.
  const productos = todosLosProductos ?? [];

  // FILTRAR POR CATEGORÍA
  //
  // Primero comparamos la categoría normalizada de cada producto.
  // Ejemplo:
  // "FILTRO AIRE"     -> "AIRE"
  // "FILTRO DE AIRE" -> "AIRE"
  //
  // No consultamos Supabase nuevamente al cambiar de categoría.
  const productosFiltrados = productos.filter((producto) => {
    // "Todas" permite visualizar todos los productos.
    if (categoria === "Todas") {
      return true;
    }

    // Comparamos el nombre uniforme con la categoría seleccionada.
    return normalizarCategoria(producto.Categoria) === categoria;
  });

  // BUSCADOR
  //
  // Eliminamos los espacios de los extremos y convertimos
  // el texto a minúsculas para facilitar la búsqueda.
  const textoBusqueda = busqueda.trim().toLowerCase();

  // Filtramos los productos por código, categoría o presentación.
  const productosVisibles = productosFiltrados.filter((producto) => {
    // Si el buscador está vacío, conservamos todos los resultados
    // de la categoría seleccionada.
    if (!textoBusqueda) {
      return true;
    }

    // Valores donde se buscará el texto ingresado.
    const valoresBusqueda = [
      producto.codigoKusa,
      normalizarCategoria(producto.Categoria),
      producto.presentacion,
    ];

    // Si al menos uno de los valores coincide, mostramos el producto.
    return valoresBusqueda.some((valor) =>
      String(valor ?? "").toLowerCase().includes(textoBusqueda)
    );
  });
  // Calcula cuántas páginas necesita el resultado filtrado.
const totalPaginas = Math.ceil(
  productosVisibles.length / productosPorPagina
);

// Evita mantener una página fuera del rango disponible.
const paginaSegura = Math.min(
  paginaActual,
  Math.max(1, totalPaginas)
);

// Calcula el índice del primer producto de esta página.
const indiceInicial = (paginaSegura - 1) * productosPorPagina;

// Obtiene solamente los 12 productos de la página actual.
const productosPaginados = productosVisibles.slice(
  indiceInicial,
  indiceInicial + productosPorPagina
);

  // ESTADO DE CARGA
  //
  // Mostramos un indicador mientras se obtienen los productos.
  if (cargandoTodos) {
    return (
      <main className="estado-pagina">
        <div className="carga-indicador" />
        <p>Cargando catálogo KUSA...</p>
      </main>
    );
  }

  // ESTADO DE ERROR
  //
  // Si Supabase no devuelve los productos correctamente,
  // mostramos un mensaje y permitimos volver a intentarlo.
  if (errorTodos) {
    return (
      <main className="estado-pagina">
        <h2>No se pudo cargar el catálogo</h2>

        <p>Comprueba tu conexión e inténtalo nuevamente.</p>

        <button
          type="button"
          className="boton-secundario"
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </button>
      </main>
    );
  }

  

  // DISEÑO PRINCIPAL DEL CATÁLOGO
  return (
    <main className="catalogo">

      {/* ENCABEZADO */}

      <header className="catalogo-header">
        <a className="logo-kusa" href="/">
          KUSA<span>.</span>
        </a>

        <span className="header-descripcion">
          FILTROS AUTOMOTRICES
        </span>

        <a className="header-contacto" href="#contacto">
          ¿Necesitas ayuda?
        </a>
      </header>

      {/* BUSCADOR Y CATEGORÍAS HORIZONTALES */}

      <section className="catalogo-toolbar">

        {/* Buscador de productos */}
        <form
          className="buscador"
          onSubmit={(evento) => evento.preventDefault()}
          role="search"
        >
          <span
            className="buscador-icono"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </span>

          {/* Campo controlado por el estado busqueda */}
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar por código KUSA o categoría..."
            aria-label="Buscar productos"
          />

          {/* Botón para borrar el texto de búsqueda */}
          {busqueda && (
            <button
              type="button"
              className="limpiar-busqueda"
              onClick={() => setBusqueda("")}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}

          <button
            className="buscador-boton"
            type="submit"
          >
            Buscar <span aria-hidden="true">→</span>
          </button>
        </form>

        {/* Botones superiores.
            Usamos la lista centralizada para evitar categorías repetidas. */}
        <nav
          className="categorias-horizontal"
          aria-label="Categorías de productos"
        >
          {categorias.map((nombreCategoria) => (
            <button
              key={nombreCategoria}
              type="button"
              className={`categoria-tab ${
                categoria === nombreCategoria
                  ? "categoria-tab-activa"
                  : ""
              }`}
              onClick={() => setCategoria(nombreCategoria)}
              aria-pressed={categoria === nombreCategoria}
            >
              <span
                className="categoria-tab-icono"
                aria-hidden="true"
              >
                {nombreCategoria === "Todas" ? "▦" : "◇"}
              </span>

              {nombreCategoria}
            </button>
          ))}
        </nav>
      </section>

      {/* PANEL LATERAL Y RESULTADOS */}

      <section className="catalogo-layout">

        {/* PANEL LATERAL DE FILTROS */}

        <aside className="filtros-panel">

          <div className="filtros-titulo">
            <div>
              <p className="panel-etiqueta">
                ENCUENTRA
              </p>

              <h2>Filtrar productos</h2>
            </div>

            {/* Restablece la categoría y el buscador */}
            <button
              type="button"
              className="limpiar-filtros"
              onClick={() => {
                setCategoria("Todas");
                setBusqueda("");
              }}
            >
              Limpiar
            </button>
          </div>

          {/* Lista de categorías del panel lateral */}

          <div className="filtros-grupo">
            <h3>Categorías</h3>

            <nav
              className="lista-categorias"
              aria-label="Filtrar por categoría"
            >
              {categorias.map((nombreCategoria) => (
                <button
                  key={nombreCategoria}
                  type="button"
                  className={`categoria-item ${
                    categoria === nombreCategoria
                      ? "categoria-activa"
                      : ""
                  }`}
                  onClick={() => setCategoria(nombreCategoria)}
                  aria-pressed={categoria === nombreCategoria}
                >
                  <span>{nombreCategoria}</span>

                  {/* Marca visual de la categoría seleccionada */}
                  {categoria === nombreCategoria && (
                    <span
                      className="categoria-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Mensaje de ayuda */}

          <div className="panel-ayuda" id="contacto">
            <span
              className="ayuda-icono"
              aria-hidden="true"
            >
              ?
            </span>

            <h3>¿Buscas una equivalencia?</h3>

            <p>
              Entra al detalle de cada producto para consultar
              sus referencias compatibles.
            </p>
          </div>
        </aside>

        {/* SECCIÓN DE PRODUCTOS */}

        <section className="productos-seccion">

          {/* Título y contador de resultados */}

          <div className="productos-encabezado">
            <div>
              <p className="productos-eyebrow">
                CATÁLOGO DE PRODUCTOS
              </p>

              <h2>
                {categoria === "Todas"
                  ? "Todos los productos"
                  : categoria}
              </h2>

              <p className="productos-subtitulo">
                Encuentra la referencia que necesitas.
              </p>
            </div>

            {/* El contador refleja los resultados después de filtrar */}
            <span className="contador-productos">
              <strong>{productosVisibles.length}</strong>{" "}
              {productosVisibles.length === 1
                ? "producto"
                : "productos"}
            </span>
          </div>
          
          {/* CUADRÍCULA DE PRODUCTOS Y PAGINACIÓN */}
          {productosVisibles.length > 0 ? (
            <>
              {/* Mostramos los 12 productos de la página actual. */}
              <ProductGrid products={productosPaginados} />

              {/* Mostramos los controles debajo de los productos. */}
              <Paginacion
                paginaActual={paginaSegura}
                totalPaginas={totalPaginas}
                onCambiarPagina={setPaginaActual}
              />
            </>
          ) : (
            /* Mensaje cuando no hay productos disponibles. */
            <div className="sin-productos">
              <span
                className="sin-productos-icono"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="34"
                  height="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" />
                </svg>
              </span>

              <h3>No encontramos productos</h3>

              <p>
                Prueba con otro código o selecciona una categoría
                diferente.
              </p>

              {/* Permite volver a visualizar todos los productos. */}
              <button
                type="button"
                className="boton-secundario"
                onClick={() => {
                  setBusqueda("");
                  setCategoria("Todas");
                }}
              >
                Ver todos los productos
              </button>
            </div>
          )}

          
        </section>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route
          path="/producto/:idproducto"
          element={<ProductoDetalle />}
        />
      </Routes>
    </BrowserRouter>
  );
}

