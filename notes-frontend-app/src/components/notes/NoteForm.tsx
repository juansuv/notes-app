import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoteForm = ({
  initialData = { title: "", content: "", version: "" },
  onSubmit,
  mode = "edit", // Modo predeterminado: editar
  autoSave = false, //solo activado para combinar notas
  showSubmitButton = true, 
  viewNote = "Ver Nota",
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [version, setVersion] = useState(initialData.version);
  const navigate = useNavigate();

  //actualiza input con los datos de la nota inicial
  useEffect(() => {
    if (mode !== "create") {
      console.log("actualizando datos iniciales", initialData);
      setTitle(initialData.title);
      setContent(initialData.content);
      setVersion(initialData.version);
    }
  }, [initialData, mode]);

  //maneja el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }
    console.log(
      "Enviando datos del formulario con version",
      title,
      content,
      version
    );
    const result = await onSubmit({ title, content, version });
    if (result?.conflict) {
      navigate(`/notes/${result.note_id}/resolve-conflict`); // Redirige inmediatamente
    } else if (result?.success) {
      navigate(`/notes`); // Redirige a la lista de notas
    } else {
      alert("Error al actualizar la nota.");
    } // Llama al callback `onSubmit`
  };

  const isViewMode = mode === "view"; // Verifica si el modo es 'view'

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        width: "100vw", // 100% del viewport
        maxWidth: "100%",
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
          {viewNote}
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
            onChange={(e) => {
              setTitle(e.target.value);
              if (autoSave) {
                const updatedData = { ...initialData, title: e.target.value };
                onSubmit(updatedData);
              }
            }}
            required
            disabled={isViewMode} // Deshabilitado si está en modo 'view'
          />
          <TextField
            label="Contenido"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (autoSave) {
                const updatedData = { ...initialData, content: e.target.value };
                onSubmit(updatedData);
              }
            }}
            required
            disabled={isViewMode} // Deshabilitado si está en modo 'view'
          />
          {!isViewMode && showSubmitButton && (
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              {mode === "create" ? "Guardar Nota" : "Guardar Cambios"}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NoteForm;
