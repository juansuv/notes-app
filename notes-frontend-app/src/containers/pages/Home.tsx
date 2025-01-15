import Layout from "hocs/layouts/Layout"; // Ajusta según la ubicación exacta
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import { Box } from "@mui/material";
import backgroundImage from "../../assets/img/banner.webp";

function Home(){
    return (
        <Layout>
            <Navbar />
            <Box
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover", // Hace que la imagen cubra todo
                    backgroundPosition: "center", // Centra la imagen
                    width: "100vw", // Ocupa todo el ancho de la ventana
                    height: "calc(100vh - 120px)", 
                    position: "relative",
                    paddingBottom: "120px",
                    // Ocupa todo el alto de la ventana
                }}
                >
                {/* Aquí puedes agregar cualquier contenido adicional */}
                </Box>
            <Footer />
        </Layout>
    )
}
export default Home