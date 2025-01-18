import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

// Este componente representa el pie de página de la aplicación.
// Aquí incluyo enlaces de navegación, secciones informativas y derechos de autor.

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        // Configuro estilos usando el sistema de diseño de Material-UI.
        // Esto me permite hacer que el pie de página sea responsivo y visualmente atractivo.
        background: "linear-gradient(135deg, #2196f3 30%, #21cbf3 90%)", // Fondo con un degradado atractivo.
        color: "white", // Color del texto para garantizar un buen contraste.
        py: { xs: 2, sm: 4 }, // Padding dinámico dependiendo del tamaño de la pantalla.
        mt: "auto", // Empuja el pie de página al final de la página.
        textAlign: "center", // Centra el texto.
        position: "fixed", // Mantengo el pie de página fijo en la parte inferior.
        bottom: 0,
        width: "100%", // Ocupa todo el ancho de la ventana.
        height: 180, // Altura fija para consistencia.
        fontSize: { xs: "0.8rem", sm: "1rem" } // Tamaño de fuente dinámico según la pantalla.
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {/* Sección de enlaces sobre nosotros */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Sobre Nosotros
          </Typography>
          {/* Enlace a la página "Quiénes somos" */}
          <Link href="#" color="inherit" underline="hover">
            Quiénes somos
          </Link>
          <br />
          {/* Enlace a la página de contacto */}
          <Link href="#" color="inherit" underline="hover">
            Contáctanos
          </Link>
        </Grid>

        {/* Sección de recursos adicionales */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Recursos
          </Typography>
          {/* Enlace al blog */}
          <Link href="#" color="inherit" underline="hover">
            Blog
          </Link>
          <br />
          {/* Enlace a la página de soporte */}
          <Link href="#" color="inherit" underline="hover">
            Soporte
          </Link>
        </Grid>

        {/* Derechos de autor */}
        <Grid item xs={12} sm={12}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {/* Inserto automáticamente el año actual */}
            © {new Date().getFullYear()} NotaFy Tu Aplicación de Notas. Todos los derechos reservados.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
