import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

import Layout from "../../hocs/layouts/Layout";
import Navbar from "../navigation/Navbar";
import { fetchNotes, updateNote } from "../../redux/actions/notes/notes";
import { RootState } from "store";

const EditNote = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notes } = useSelector((state: RootState) => state.notes);
  const note = notes.find((n) => n.id === parseInt(id));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!note) {
      dispatch(fetchNotes()); // Cargar notas si aún no están disponibles
    } else {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [dispatch, note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateNote({ id: id, title: title, content: content })); // Actualiza la nota
    navigate("/notes"); // Redirige a la lista de notas
  };

  if (!note) {
    return <Typography>Cargando nota...</Typography>;
  }

  return (
    <Layout>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px - 64px)", // Espacio para Navbar y Footer
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 600,
            width: "100%",
            padding: 4,
            borderRadius: "16px",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Editar Nota
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
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Guardar Cambios
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default EditNote;
