# Catálogo KUSA

Aplicación web desarrollada para organizar y consultar el catálogo de productos de KUSA, enfocado en filtros automotrices y sus equivalencias.

El proyecto busca facilitar la búsqueda de productos mediante una interfaz visual, filtros por categoría y páginas de detalle que reúnen información técnica relevante para la identificación de cada producto.

## Características principales

- **Catálogo de productos:** visualización de productos registrados en la base de datos.
- **Filtrado por categoría:** permite organizar y consultar productos según su tipo.
- **Paginación:** distribuye los resultados en páginas para facilitar la navegación.
- **Detalle del producto:** muestra información individual de cada producto.
- **Código KUSA:** identificación de productos mediante su código correspondiente.
- **Imágenes de productos:** visualización de fotografías almacenadas en Supabase Storage.
- **Descripciones técnicas:** consulta de descripciones detalladas cuando están disponibles.
- **Medidas y especificaciones:** visualización de información técnica registrada para cada producto.
- **Equivalencias:** consulta de códigos equivalentes y referencias de otras marcas.
- **Integración con Supabase:** consulta de los datos almacenados en la base de datos.

## Tecnologías utilizadas

- **React:** construcción de la interfaz mediante componentes reutilizables.
- **TypeScript:** tipado estático para mejorar la organización y el mantenimiento del código.
- **Vite:** entorno de desarrollo y herramienta de compilación.
- **Supabase:** base de datos y almacenamiento de imágenes.
- **React Query (TanStack Query):** gestión de consultas y estados de carga de datos.
- **CSS:** estilos y presentación visual de la aplicación.
- **Git y GitHub:** control de versiones y alojamiento del código fuente.

## Modelo de datos

La aplicación trabaja con información organizada en tablas relacionadas:

- `Producto`: datos principales del producto, como código KUSA, categoría, presentación e imagen.
- `descripcion_producto`: descripciones detalladas asociadas a los productos.
- `detalle_medidas`: medidas y especificaciones técnicas.
- `Equivalente`: códigos equivalentes y marcas relacionadas.
- `aplicacion`: información de aplicación por marca, modelo y año.
- `import_kusa_raw`: tabla utilizada para almacenar datos originales durante el proceso de importación.

Las relaciones entre tablas permiten separar la información principal de los detalles técnicos y las equivalencias.

## Estructura general

El proyecto se organiza en componentes, hooks, utilidades y páginas para mantener separadas las responsabilidades.

- `components/Productos/`: componentes relacionados con el catálogo, las tarjetas, la cuadrícula y la paginación.
- `hooks/`: lógica reutilizable para consultar productos y filtrar resultados.
- `utils/`: funciones auxiliares, como la normalización de categorías.
- `ProductoDetalle`: vista dedicada a la información de un producto.
- `App.tsx`: componente principal que organiza la vista del catálogo, los filtros y la navegación por páginas.

La estructura exacta puede variar según los cambios realizados durante el desarrollo.

## Instalación y ejecución local

### Requisitos

- Node.js y npm.
- Una cuenta y un proyecto de Supabase configurado.
- Las variables de entorno necesarias para conectar la aplicación con Supabase.

### Pasos

1. Clonar el repositorio.
2. Instalar las dependencias.
3. Crear un archivo `.env` en la raíz del proyecto.
4. Configurar las variables de entorno.
5. Ejecutar el servidor de desarrollo.

```bash
git clone https://github.com/NAJARH09/catalogoProductos.git
cd catalogoProductos
npm install
```

Crear el archivo `.env` con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publicable
```

Iniciar la aplicación:

```bash
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
```

## Configuración y seguridad

El archivo `.env` contiene la configuración local y debe permanecer fuera del repositorio. Las variables de entorno de producción deben configurarse en la plataforma de despliegue.

La clave publicable de Supabase está diseñada para uso en el cliente, pero el acceso a los datos debe protegerse con políticas adecuadas de Row Level Security (RLS). Nunca se debe incluir una clave secreta o `service_role` en el frontend.

## Objetivo del proyecto

Desarrollar un catálogo web que centralice la información de productos KUSA y facilite la consulta de sus códigos, fotografías, medidas, descripciones y equivalencias desde una interfaz accesible.

El proyecto también permite poner en práctica conocimientos de desarrollo frontend, consumo de datos, diseño de componentes reutilizables, modelado relacional y gestión de versiones con Git.

## Estado del proyecto

En desarrollo. Las funcionalidades disponibles dependen de los datos registrados y de la configuración actual de Supabase.

## Autora

Desarrollado como proyecto de desarrollo de software y aplicación práctica de tecnologías web modernas.
