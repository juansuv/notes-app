import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const NoteForm = ({ initialData = { title: "", content: "", version:"" }, onSubmit, mode }) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const version = initialData.version;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onSubmit({ title, content, version }); // Llama al callback `onSubmit`
  };

  useEffect(() => {
    if (initialData.title || initialData.content) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px - 64px)", // Resta el espacio del Navbar y Footer
        padding: 2,
        width: "100vw", // 100% del viewport
        maxWidth: "100%"
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
          {mode === "create" ? "Crear Nueva Nota" : "Editar Nota"}
        </Typography>

        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          { `version: ${initialData.version}` }
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
            sx={{ marginTop: 2 }}
          >
            {mode === "create" ? "Guardar Nota" : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NoteForm;
