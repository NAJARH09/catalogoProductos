export interface Product {
  idproducto: number;
  tipoProducto: string;
  imagenUrl: string;
  codigoKusa: string;
  nombre: string;
  Categoria: string;
  enStock: boolean;
  presentacion: string;
}

export interface Equivalente {
  idEquivalencia: number;
  marcaEquivalente: string;
  codigoEquivalente: string;
  producto_id: number;
}


export interface Aplicacion {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
}

export interface DetalleMedidas {
  id: number;
  product_id: number;
  altura: string;
  largo: string;
  ancho: string;
  presentación: string;
}