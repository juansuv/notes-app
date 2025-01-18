// Función para formatear la fecha
export const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha"; // Devuelve "Sin fecha" si no hay fecha
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };