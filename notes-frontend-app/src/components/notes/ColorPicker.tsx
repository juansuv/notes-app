import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateNoteColor } from "../../redux/actions/notes/notes";

interface ColorPickerProps {
  noteId: number;
  currentColor: string;
  onChange: (color: string) => void;
  textColor: string; // Nuevo prop para el color de texto dinámico
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  noteId,
  currentColor,
  onChange,
  textColor,
}) => {
  const [color, setColor] = useState<string>(currentColor);
  const dispatch = useDispatch();

  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
    dispatch(updateNoteColor(noteId, newColor));
    onChange(newColor); // Comunica el cambio al padre
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <TextField
        type="color"
        value={color}
        onChange={(e) => handleChangeColor(e.target.value)}
        fullWidth
        label="Seleccionar Color"
        InputLabelProps={{
          style: { color: textColor }, // Cambia el color dinámico de la etiqueta
        }}
        InputProps={{
          style: {
            color: textColor, // Cambia el color dinámico del texto
            borderColor: textColor, // Cambia el borde dinámico
          },
        }}
      />
    </Box>
  );
};

export default ColorPicker;
