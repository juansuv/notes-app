import React, { useEffect, useState } from "react";
import { TextField, Chip, Box, Typography } from "@mui/material";

interface TagsInputProps {
  currentTags: string[];
  onChange: (tags: string[]) => void;
  textColor: string;
  viewMode: boolean; // Recibe el color de texto dinámico
}

const TagsInput: React.FC<TagsInputProps> = ({
  currentTags,
  onChange,
  textColor,
  viewMode,
}) => {
  const [tags, setTags] = useState<string[]>(currentTags || []);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    setTags(currentTags || []);
  }, [currentTags]);

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue)) {
      const updatedTags = [...tags, inputValue.trim()];
      setTags(updatedTags); // actualiza loca
      onChange(updatedTags); //actualiza estado padre
      setInputValue("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags); //actualiza estado local
    onChange(updatedTags); //actualiza estado padre
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: textColor,
          marginBottom: "4px",
          marginTop: "16px",
          fontFamily: "'Roboto', sans-serif",
        }}
        
        
      >
        Escribe una etiqueta y presiona <b>Enter</b> para añadirla.
      </Typography>
      <TextField
        label="Añadir Etiqueta"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        disabled={viewMode}
        margin="normal"
        sx={{
          marginBottom: "16px",
          borderRadius: "8px",
        }}
        InputLabelProps={{ style: { color: textColor } }}
        InputProps={{
          style: { color: textColor, borderColor: textColor },
        }}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            disabled={viewMode}
            onDelete={() => handleDeleteTag(tag)}
            sx={{
              color: textColor,
              border: `1px solid ${textColor}`,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#1976d2", // Azul predeterminado de MUI (primary.main)
                color: textColor,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsInput;
