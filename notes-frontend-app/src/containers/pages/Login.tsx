import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "hocs/layouts/Layout"; // Ajusta según la ubicación exacta
import Navbar from "../../components/navigation/Navbar";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import image from "../../assets/img/banner-login.jpeg"; // Cambia la ruta si es necesario
import { Link } from "react-router-dom";
import { loginUser } from "../../redux/actions/users/userLogin"; // Importa la acción de login
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña
  
  const dispatch = useDispatch(); // Hook para despachar acciones
  const { token, error } = useSelector((state: any) => state.auth); // Accede al estado global de Redux

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(username, password)); // Despacha la acción para iniciar sesión
  };

  const navigate = useNavigate();

  if (token) {
    
    navigate("/notes");
  }

  return (
    <Layout>
      <Navbar />
      <Grid
        container
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: "linear-gradient(135deg, #2196f3 30%, #21cbf3 90%)",
        }}
      >
        {/* Columna izquierda con el formulario */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              maxWidth: 400,
              width: "100%",
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Bienvenido a NotaFy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: "text.secondary",
              }}
            >
              Inicia sesión para continuar
            </Typography>

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                mt: 2,
              }}
            >
              {/* Campo de usuario */}
              <TextField
                label="Nombre de Usuario"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Actualiza el estado de username
              />
              {/* Campo de contraseña */}
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de password
              />

              {/* Botón de inicio de sesión */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  background: "linear-gradient(90deg, #2196f3, #21cbf3)",
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>

            {/* Mostrar token o error */}
            {token && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "green",
                }}
              >
                Sesión iniciada.
              </Typography>
            )}
            {error && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "red",
                }}
              >
                {error}
              </Typography>
            )}

            {/* Texto decorativo */}
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: "text.secondary",
              }}
            >
              ¿No tienes cuenta?{" "}
              <Link to="/register" color="primary">
                Regístrate aquí
              </Link>
            </Typography>
          </Paper>
        </Grid>

        {/* Columna derecha con la imagen */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center right",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          ></Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Login;
