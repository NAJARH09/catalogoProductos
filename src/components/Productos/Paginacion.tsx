
import "./Paginacion.css";

// Definimos los datos y las funciones que recibirá el componente.
type PaginacionProps = {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
};

// Componente encargado de mostrar los controles de paginación.
export function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  // Si no hay páginas que mostrar, no renderizamos la paginación.
  if (totalPaginas <= 1) {
    return null;
  }

  // Creamos una lista con los números de todas las páginas.
  const paginas = Array.from(
    { length: totalPaginas },
    (_, indice) => indice + 1
  );

  return (
    <nav
      className="paginacion"
      aria-label="Paginación de productos"
    >
      {/* Botón para retroceder una página. */}
      <button
        type="button"
        className="paginacion-boton"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {/* Generamos un botón por cada número de página. */}
      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          className={`paginacion-numero ${
            pagina === paginaActual ? "activo" : ""
          }`}
          aria-current={
            pagina === paginaActual ? "page" : undefined
          }
          onClick={() => onCambiarPagina(pagina)}
        >
          {pagina}
        </button>
      ))}

      {/* Botón para avanzar una página. */}
      <button
        type="button"
        className="paginacion-boton"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </nav>
  );
}
