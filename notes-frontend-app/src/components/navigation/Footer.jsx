import { connect } from 'react-redux';
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2196f3 30%, #21cbf3 90%)",
        color: "white",
        py: { xs: 2, sm: 4 },
        mt: "auto",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: 180,
        fontSize: { xs: "0.8rem", sm: "1rem" }
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {/* Sección de enlaces */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Sobre Nosotros
          </Typography>
          <Link href="#" color="inherit" underline="hover">
            Quiénes somos
          </Link>
          <br />
          <Link href="#" color="inherit" underline="hover">
            Contáctanos
          </Link>
        </Grid>

        {/* Sección de links adicionales */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Recursos
          </Typography>
          <Link href="#" color="inherit" underline="hover">
            Blog
          </Link>
          <br />
          <Link href="#" color="inherit" underline="hover">
            Soporte
          </Link>
        </Grid>

        {/* Derechos de autor */}
        <Grid item xs={12} sm={12}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            © {new Date().getFullYear()} NotaFy Tu Aplicación de Notas. Todos los derechos reservados.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  
}); 
export default connect(mapStateToProps,{

})(Footer);