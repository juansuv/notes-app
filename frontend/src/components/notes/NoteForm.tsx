import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import TagsInput from "./TagsInput";
import ColorPicker from "./ColorPicker";
import { adjustColor, getContrastColor } from "../../utils/contrastColor";

interface NoteFormProps {
  initialData: {
    title: string;
    content: string;
    version: string;
    tags?: string[];
    color?: string;
  };

  onSubmit: (data: {
    title: string;
    content: string;
    version: string;
    tags?: string[];
    color?: string;
  }) => void;

  mode?: "edit" | "view" | "create";
  autoSave?: boolean;
  showSubmitButton?: boolean;
  viewNote: string;
  nameCard?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
  initialData = {
    title: "",
    content: "",
    version: "",
    tags: [],
    color: "#ffffff",
  },
  onSubmit,
  mode = "edit",
  showSubmitButton = true,
  viewNote = "Ver Nota",
  autoSave = false,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [version, setVersion] = useState(initialData.version);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [color, setColor] = useState<string>(initialData.color || "#ffffff");

  const textColor = getContrastColor(color); // Calcula el color de contraste dinámico

  useEffect(() => {
    if (mode !== "create") {
      setTitle(initialData.title);
      setContent(initialData.content);
      setVersion(initialData.version);
      setTags(initialData.tags || []);
      setColor(initialData.color || "#ffffff");
    }
  }, [initialData, mode]);

  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      case "tags":
        setTags(value);
        break;
      case "color":
        setColor(value);
        break;
      default:
        break;
    }
    if (autoSave) {
      const updatedData = {
        title,
        content,
        version,
        tags,
        color,
        [field]: value, // Sobrescribe el campo modificado
      };
      onSubmit(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Por favor completa los campos titulo y contenido");
      return;
    }
    onSubmit({ title, content, version, tags, color });
  };

  const isViewMode = mode === "view";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        width: "100vw",
        maxWidth: "100%",
        height: "100%",
        boxShadow: adjustColor(color, 200),
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: "100%",
          minHeight: 300, // Altura mínima uniforme para todas las tarjetas
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Asegura que el botón esté visible
          padding: 3,
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${color || "#f5f5f5"} 40%, ${
            color ? `${color}b3` : "#e5e5e5"
          } 100%)`,

          color: textColor,
          gap: 2,
        }}
      >
        {/* Título de la nota */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textShadow: `0px 0px 4px ${textColor === "#000" ? "#fff" : "#000"}`,
            textAlign: "center",
          }}
        >
          {viewNote}
        </Typography>

        {/* Formulario de la nota */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Campo del título */}
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            required
            disabled={isViewMode}
            InputLabelProps={{
              style: { color: textColor },
            }}
            InputProps={{
              style: { color: textColor, borderColor: textColor },
            }}
          />

          {/* Campo del contenido */}
          <TextField
            label="Contenido"
            variant="outlined"
            fullWidth
            multiline
            rows={4} // Reduce las filas visibles para compactar
            value={content}
            onChange={(e) => handleFieldChange("content", e.target.value)}
            required
            disabled={isViewMode}
            InputLabelProps={{
              style: { color: textColor },
            }}
            InputProps={{
              style: { color: textColor, borderColor: textColor },
            }}
          />

          {/* Componente para las etiquetas */}
          <TagsInput
            currentTags={tags}
            onChange={(updatedTags) => handleFieldChange("tags", updatedTags)}
            textColor={textColor}
            viewMode={isViewMode}
          />

          {/* Selector de color, solo visible si no está en modo de vista */}
          {!isViewMode && (
            <ColorPicker
              currentColor={color}
              onChange={(updatedColor) =>
                handleFieldChange("color", updatedColor)
              }
              textColor={textColor}
              viewMode={isViewMode}
            />
          )}

          {/* Botón de guardar, visible solo si no está en modo de vista */}
          {!isViewMode && showSubmitButton && (
            <Button
              type="submit"
              variant="outlined"
              sx={{
                marginTop: 2,
                color: textColor,
                backgroundColor: adjustColor(color, 50),
                border: `2px solid ${textColor}`,
                "&:hover": {
                  backgroundColor:
                    color === "#000000" ? "#333333" : adjustColor(color, -50),
                  border: `2px solid ${textColor}`,
                },
              }}
            >
              {mode === "create" ? "Guardar Nota" : "Guardar Cambios"}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NoteForm;
