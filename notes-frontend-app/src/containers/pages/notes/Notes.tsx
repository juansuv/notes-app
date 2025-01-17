import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";

import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
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
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            width: "100%",
            paddingTop: "64px", // Ajusta según la altura de tu Navbar
          }}
        >
          <Typography variant="h4" gutterBottom>
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
          spacing={3}
          sx={{
            minHeight: "calc(100vh - 200px)", // Asegura que haya espacio suficiente
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
              <Grid item xs={12} sm={6} md={4} key={`placeholder-${index}`}>
                <Box sx={{ height: 200 }} />
              </Grid>
            ))}
        </Grid>

        {!loading && !error && notes.length === 0 && (
          <Typography>No tienes notas creadas.</Typography>
        )}
      </Box>
    </Layout>
  );
};

export default Notes;
