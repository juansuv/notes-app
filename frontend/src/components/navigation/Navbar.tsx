import { connect } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/actions/users/userLogout"; // Acción de logout

interface NavbarProps {
  isAuthenticated: boolean;
  username: string;
  logoutUser: () => void;
}

interface RootState {
  auth: {
    success: boolean;
    username: string;
  };
}

function Navbar({ isAuthenticated, username, logoutUser }: NavbarProps) {
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          background: "linear-gradient(135deg, #2196f3 30%, #21cbf3 90%)",
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            mr: 3,
            "@media (max-width: 600px)": {
              fontSize: "1.3rem",
              paddingRight: 2,
              mr: 0,
            },
          }}
          component={Link}
          to="/"
        >
          <StickyNote2Icon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: "flex", // Para centrar el contenido si es necesario
            alignItems: "center",
            justifyContent: "left",
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)", // Sombra más pronunciada
            fontSize: "1.7rem", // Ajusta el tamaño de la fuente
            "@media (max-width: 600px)": {
              fontSize: "1.3rem",
              paddingRight: 2,
            },
          }}
        >
          {isAuthenticated ? (
            <div>
              <Link
                to="/notes"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "inline-block", // Limita el área clickeable
                }}
              >
                NotaFy
              </Link>
            </div>
          ) : (
            "NotaFy"
          )}
        </Typography>
        {isAuthenticated ? (
          <>
            <Typography
              variant="h5"
              sx={{
                mr: 4,
                color: "white", // Color del texto
                display: "inline-block",
                fontWeight: "bold", // Texto en negrita
                textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)", // Sombra más pronunciada
                fontSize: "1.5rem", // Ajusta el tamaño de la fuente
                letterSpacing: "0.05em", // Espaciado entre letras
                "@media (max-width: 600px)": {
                  fontSize: "1.3rem", // Tamaño de fuente más pequeño
                  flexDirection: "column", // Alinea el texto y el ícono en columnas
                  alignItems: "center",
                  paddingRight: 16,
                },
              }}
            >
              {username}
            </Typography>
            <Button
              color="inherit"
              onClick={logoutUser}
              sx={{
                fontWeight: "bold", // Negrita para que destaque
                fontSize: "1rem", // Tamaño del texto del botón
                color: "white", // Color blanco para el texto
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)", // Sombra para resaltar
                display: "flex", // Alinea el texto y el icono horizontalmente
                alignItems: "center", // Centra verticalmente
                textTransform: "uppercase", // Convierte el texto en mayúsculas
                padding: "8px 16px", // Espaciado interno del botón
                borderRadius: "8px", // Bordes redondeados
                background: "linear-gradient(135deg, #21cbf3 30%, #2196f3 90%)", // Fondo con degradado
                boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.3)", // Sombra para el botón
                transition: "transform 0.2s, box-shadow 0.2s", // Animación suave al pasar el mouse
                "&:hover": {
                  transform: "scale(1.05)", // Aumenta ligeramente el tamaño al pasar el mouse
                  boxShadow: "3px 6px 12px rgba(0, 0, 0, 0.5)", // Sombra más pronunciada al hacer hover
                },
                "@media (max-width: 600px)": {
                  fontSize: "0.75rem", // Tamaño de fuente más pequeño
                  padding: "4px 8px", // Padding reducido
                  position: "absolute", // Quita el botón del flujo del layout
                  top: "10px", // Posición en la parte superior del Navbar
                  right: "10px", // Posición en la parte derecha
                  borderRadius: "6px",
                  "& .MuiSvgIcon-root": {
                    marginLeft: 0, // Quita el margen izquierdo del ícono
                    marginTop: "4px", // Añade espacio superior al ícono
                  },
                },
              }} // Acción para cerrar sesión
            >
              Cerrar Sesión
              <LogoutIcon sx={{ marginLeft: 2 }} />
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            to="/login"
            color="inherit"
            sx={{
              fontWeight: "bold", // Negrita para que destaque
              fontSize: "1rem", // Tamaño del texto del botón
              color: "white", // Color blanco para el texto
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)", // Sombra para resaltar
              display: "flex", // Alinea el texto y el icono horizontalmente
              alignItems: "center", // Centra verticalmente
              textTransform: "uppercase", // Convierte el texto en mayúsculas
              padding: "8px 16px", // Espaciado interno del botón
              borderRadius: "8px", // Bordes redondeados
              background: "linear-gradient(135deg, #21cbf3 30%, #2196f3 90%)", // Fondo con degradado
              boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.3)", // Sombra para el botón
              transition: "transform 0.2s, box-shadow 0.2s", // Animación suave al pasar el mouse
              "&:hover": {
                transform: "scale(1.05)", // Aumenta ligeramente el tamaño al pasar el mouse
                boxShadow: "3px 6px 12px rgba(0, 0, 0, 0.5)", // Sombra más pronunciada al hacer hover
              },
              "@media (max-width: 600px)": {
                fontSize: "0.75rem", // Tamaño de fuente más pequeño
                padding: "4px 8px", // Padding reducido
                position: "absolute", // Quita el botón del flujo del layout
                top: "10px", // Posición en la parte superior del Navbar
                right: "10px", // Posición en la parte derecha
                borderRadius: "6px",
                "& .MuiSvgIcon-root": {
                  marginLeft: 0, // Quita el margen izquierdo del ícono
                  marginTop: "4px", // Añade espacio superior al ícono
                },
              },
            }}
          >
            Iniciar Sesión
            <LoginIcon />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.success, // Verifica si el usuario está autenticado
  username: state.auth.username, // Recupera el nombre de usuario
});

const mapDispatchToProps = {
  logoutUser, // Vincula la acción de logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
