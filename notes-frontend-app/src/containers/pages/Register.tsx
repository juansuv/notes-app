import Layout from "hocs/layouts/Layout";
import Navbar from "../../components/navigation/Navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import image from "../../assets/img/banner-login.webp"; // Cambia la ruta si es necesario
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { registerUser } from "../../services/userService";




const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);
   
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await registerUser(name, password);




    console.log("Register submitted");
    if (result.success) {
      setMessage("Usuario creado exitosamente");
      setName("");
      setPassword("");
      setSuccess(true);
    } else {
      setMessage(result.message);
      setSuccess(false);
    }
  };
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
        {/* Columna izquierda con la imagen */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden", // Asegura que la imagen no se salga del contenedor
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center left",
              transition: "transform 0.3s ease", // Animación suave al pasar el mouse
              "&:hover": {
                transform: "scale(1.05)", // Amplía la imagen un poco al pasar el mouse
              },
            }}
          ></Box>
        </Grid>

        {/* Columna derecha con el formulario */}
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
              minWidth: 280,
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
              Crear Cuenta en NotaFy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: "text.secondary",
              }}
            >
              Regístrate para empezar a usar NotaFy
            </Typography>

            <Box
              component="form"
              onSubmit={handleRegister}
              sx={{
                mt: 2,
              }}
            >
              {/* Campo de usuario */}
              <TextField
                label="Nombre de Usuario"
                aria-label="nombre de usuario"
                placeholder="Ingrese su nombre de usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />
              {/* Campo de contraseña */}
              <TextField
                label="Contraseña"
                aria-label="contraseña"
                placeholder="Cree una contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />

              {/* Botón de registro */}
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
                Registrarse
              </Button>
            </Box>

            {/* Texto decorativo */}
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: "text.secondary",
              }}
            >
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
            {message && (
              <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Register;
