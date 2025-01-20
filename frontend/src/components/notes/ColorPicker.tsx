import React, { useState } from "react";
import { Box, TextField } from "@mui/material";

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
  textColor: string;
  viewMode: boolean; // Nuevo prop para el color de texto dinámico
}

const ColorPicker: React.FC<ColorPickerProps> = ({

  currentColor,
  onChange,
  textColor,
  viewMode,
}) => {
  const [color, setColor] = useState<string>(currentColor);


  const handleChangeColor = (newColor: string) => {
    setColor(newColor);
    onChange(newColor); // Comunica el cambio al padre
  };

  return (

    
    <Box sx={{ marginTop: 2 }}>
      <TextField
        type="color"
        value={color}
        onChange={(e) => handleChangeColor(e.target.value)}
        fullWidth
        disabled={viewMode}
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
