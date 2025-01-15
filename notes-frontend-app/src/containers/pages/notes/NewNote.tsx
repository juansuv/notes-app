import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";

import Layout from "../../../hocs/layouts/Layout"; // Ajusta según la ubicación exacta
import Navbar from "../../../components/navigation/Navbar";
import { createNote } from "../../../redux/actions/notes/notes"; // Acción para crear una nota

const NewNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    dispatch(createNote({ title: title, content: content, shared_width: [] })); // Despacha la acción para crear la nota
    navigate("/notes"); // Redirige a la página de notas
  };

  return (
    <Layout>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Centra horizontalmente
          alignItems: "center", // Centra verticalmente
          height: "100vh", // Ocupa toda la altura de la ventana
          width: "100vw", // Ocupa todo el ancho de la ventana
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 600,
            width: "90%",
            padding: 4,
            borderRadius: "16px",
            backgroundColor: "#FFEB3B",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Crear Nueva Nota
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Contenido"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#FF9800",
                "&:hover": { backgroundColor: "#F57C00" },
                fontWeight: "bold",
              }}
            >
              Guardar Nota
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default NewNote;
