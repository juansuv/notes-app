import Layout from "hocs/layouts/Layout"; // Ajusta según la ubicación exacta
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import { Box } from "@mui/material";
import backgroundImage from "../../assets/img/banner.jpeg";

function Home() {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Asegura que ocupe toda la altura del viewport
        }}
      >
        <Navbar />

        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat", // Hace que la imagen cubra todo
            backgroundPosition: "center", // Centra la imagen
            width: "100vw", // Ocupa todo el ancho de la ventana
            height: "100vh", // Usa todo el alto de la ventana
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Asegura que el contenido respete el Navbar y Footer
            boxSizing: "border-box", // Asegura que los paddings no desborden
            marginTop: "64px", // Altura exacta del Navbar
            marginBottom: "100px", // Altura exacta del Footer
            overflow: "hidden", // Asegura que el Box respete su posición
          }}
        >
          
        </Box>
        <Footer />
      </Box>
    </Layout>
  );
}
export default Home;
