import React from "react";
import { Box } from "@mui/material";
import NoteForm from "./NoteForm"; // Importa tu NoteForm

interface SelectableBoxProps {
  initialData: any;
  selected: boolean;
  onSubmit: (data: any) => void;
  onClick: () => void;
  mode?: "view" | "edit";
  autoSave?: boolean;
  showSubmitButton?: boolean;
  viewNote?: string;
}

const SelectableBox: React.FC<SelectableBoxProps> = ({
  initialData,
  selected,
  onSubmit,
  onClick,
  mode = "view",
  autoSave = false,
  viewNote = "",
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: "1 1 30%", // Ajuste flexible
        minWidth: "280px",
        maxWidth: "450px",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: selected ? "#6bb7fa" : "#ffffff",
        boxShadow: selected
          ? "0 4px 8px rgba(31, 135, 221, 0.57)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, background-color 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 8px rgba(33, 100, 243, 0.96)",
        },
        cursor: "pointer",
        display: "flex", // Flex para controlar el tamaño interno
        flexDirection: "column",
        alignItems: "stretch",
        height: "auto", // Altura dinámica
        overflow: "hidden", // Prevenir desbordamiento
      }}
    >
      <NoteForm
        initialData={initialData}
        mode={mode}
        autoSave={autoSave}
        showSubmitButton={false}
        onSubmit={onSubmit}
        viewNote={viewNote}
        sx={{
          flexGrow: 1, // Permite que NoteForm se ajuste
          height: "100%", // Toma el tamaño completo del contenedor
          "& .MuiTextField-root": {
            marginBottom: 2,
          },
          "& textarea": {
            maxHeight: "60px", // Limita la altura del área de texto
          },
          "& .tags-container": {
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          },
        }}
      />
    </Box>
  );
};

export default SelectableBox;
