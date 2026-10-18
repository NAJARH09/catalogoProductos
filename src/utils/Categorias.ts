export const categorias = [
  "Todas",
  "AIRE",
  "ACEITE",
  "CABINA",
  "GASOLINA",
  "PETRÓLEO",
  "ELEMENTOS",
];

export function normalizarCategoria(
  categoria: string | null | undefined
): string {
  if (!categoria) return "OTROS";

  const texto = categoria
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

  // Primero identificamos categorías específicas.
  if (texto.includes("CABINA")) return "CABINA";
  if (texto.includes("PETROLEO")) return "PETRÓLEO";
  if (texto.includes("GASOLINA")) return "GASOLINA";
  if (texto.includes("ELEMENTO")) return "ELEMENTOS";
  if (texto.includes("ACEITE")) return "ACEITE";
  if (texto.includes("AIRE")) return "AIRE";

  return "OTROS";
}