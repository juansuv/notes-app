import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";

import Layout from "hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar.tsx";
import NoteCard from "../../../components/notes/NoteCard.tsx";
import { fetchNotes, deleteNote } from "../../../redux/actions/notes/notes";

const Notes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notes, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleView = (id) => {
    navigate(`/notes/${id}`); // Redirige al detalle de la nota
  };

  const handleEdit = (id) => {
    navigate(`/notes/${id}/edit`); // Redirige al editor de la nota
  };

  const handleDelete = (id) => {
    dispatch(deleteNote(id)); // Despacha la acción para eliminar la nota
  };

  const handleCreateNewNote = () => {
    navigate("/new-note"); // Redirige al formulario de creación de notas
  };

  return (
    <Layout>
      <Navbar />
      <Box
        sx={{
          padding: 3,
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: "#f0f4f8",
          overflowX: "hidden", // Evita scroll lateral
          width: "100%", // Asegura que ocupe todo el ancho del dispositivo
          boxSizing: "border-box", // Incluye el padding en el cálculo del ancho
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            paddingTop: "64px", // Ajusta según la altura de tu Navbar
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: "'Poppins', sans-serif", // Tipografía moderna
              fontWeight: 600, // Peso de fuente para destacar
              background: "linear-gradient(90deg, #2196f3, #21cbf3)", // Gradiente suave
              WebkitBackgroundClip: "text", // Hace que el gradiente afecte solo al texto
              WebkitTextFillColor: "transparent", // Deja el fondo del texto transparente
              textAlign: "center", // Centrado
              marginBottom: "20px", // Espaciado inferior
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Sombra sutil
              letterSpacing: "0.05em", // Espaciado entre letras
            }}
          >
            Tus Notas
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateNewNote}
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#388E3C" },
            }}
          >
            Crear Nueva Nota
            
          </Button>
        </Box>

        {loading && <Typography>Cargando notas...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <Grid
          container
          spacing={2}
          sx={{
            width: "100%", // Asegura que el contenedor ocupe todo el ancho
            margin: "0 auto", // Centra el contenido
            boxSizing: "border-box", // Incluye padding en el cálculo del ancho
            overflowX: "hidden",
            overflowYs: "hidden",
            paddingBottom: 20,
            paddingRight: 2,
            // Evita scroll lateral en el Grid
          }}
        >
          {notes
            .slice() // Crea una copia del array para no mutar el estado original
            .sort((a, b) => a.id - b.id) // Ordenar por ID
            .map((note) => (
              <Grid
                item
                xs={12} // 1 columna en pantallas pequeñas
                sm={6} // 2 columnas en pantallas medianas
                md={4} // 3 columnas en pantallas grandes
                key={note.id}
                sx={{
                  boxSizing: "border-box", // Asegura que respete los márgenes y paddings
                }}
              >
                <NoteCard
                  note={note}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}

          {/* Relleno de columnas faltantes para mantener siempre 3 columnas */}
          {notes.length < 3 &&
            Array.from({ length: 3 - notes.length }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`placeholder-${index}`}
                sx={{
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    backgroundColor: "transparent",
                  }}
                />
              </Grid>
            ))}
        </Grid>

        {!loading && !error && notes.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            textAlign="center"
          >
            <NoteAddOutlinedIcon onClick={handleCreateNewNote} fontSize="large" color="disabled" />
            <Typography variant="h6" color="textSecondary">
              No tienes notas creadas.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Crea tu primera nota para comenzar a organizar tus ideas.
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Notes;
