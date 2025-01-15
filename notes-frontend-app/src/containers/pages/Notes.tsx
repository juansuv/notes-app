import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

import Layout from "../../hocs/layouts/Layout"; // Ajusta según la ubicación exacta
import Navbar from "../../components/navigation/Navbar";
import { fetchNotes } from "../../redux/actions/notes/notesFetch"; // Acción para obtener notas

const Notes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado global de notas
  const { notes, loading, error } = useSelector((state) => state.notes);

  // Cargar las notas al montar el componente
  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  return (
    <Layout>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tus Notas
        </Typography>
        <Button variant="contained" onClick={() => navigate("/new-note")} sx={{ mb: 2 }}>
          Crear Nueva Nota
        </Button>

        {/* Manejo de estado de carga */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Manejo de errores */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Lista de notas */}
        {!loading && !error && notes.length > 0 && (
          <List>
            {notes.map((note) => (
              <ListItem
                key={note.id}
                button
                onClick={() => navigate(`/notes/${note.id}`)} // Navegar al componente de detalle de nota
              >
                <ListItemText primary={note.title} secondary={note.content} />
              </ListItem>
            ))}
          </List>
        )}

        {/* Mensaje si no hay notas */}
        {!loading && !error && notes.length === 0 && (
          <Typography>No tienes notas creadas.</Typography>
        )}
      </Box>
    </Layout>
  );
};

export default Notes;
