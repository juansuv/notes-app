// Función para calcular el color de contraste (claro u oscuro)
export const getContrastColor = (bgColor: string) => {
  if (!bgColor.startsWith("#") || bgColor.length !== 7) return "#000";
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? "#000" : "#fff";
};

// Función para ajustar el color en tonos más claros u oscuros
export const adjustColor = (color: string, amount: number): string => {
  let usePound = false;

  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  return (usePound ? "#" : "") + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};

// función para invertir color
export const getInvertedColor = (hexColor: string): string => {
  // Convierte el color hexadecimal en valores RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calcula la luminosidad relativa (método estándar para determinar contraste)
  const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;

  // Devuelve blanco para colores oscuros y negro para colores claros
  console.log('color es', luminosity, hexColor);
  return luminosity > 128 ? "#000000" : "#ffffff";
};