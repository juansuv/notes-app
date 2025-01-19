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
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <StickyNote2Icon />
        </IconButton>
        <Typography
          variant="h6"
          component={isAuthenticated ? Link : "div"} // Si está autenticado, es un botón con enlace
          to={isAuthenticated ? "/notes" : undefined}
          sx={{
            flexGrow: 1,
            textDecoration: isAuthenticated ? "none" : "inherit",
            color: "inherit",
          }}
        >
          NotaFy
        </Typography>
        {isAuthenticated ? (
          <>
            <Typography
              variant="body1"
              sx={{
                mr: 2,
                color: "white",
                display: "inline-block",
              }}
            >
              {username}
            </Typography>
            <Button
              color="inherit"
              onClick={logoutUser} // Acción para cerrar sesión
            >
              Logout
              <LogoutIcon />
            </Button>
          </>
        ) : (
          <Button component={Link} to="/login" color="inherit">
            Login
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
