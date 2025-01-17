import React from "react";
import { Box, Typography } from "@mui/material";
import NoteForm from "./NoteForm"; // Importa tu NoteForm

interface SelectableBoxProps {
  title: string;
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
  title,
  initialData,
  selected,
  onSubmit,
  onClick,
  mode = "view",
  autoSave = false,
  showSubmitButton = false,
  viewNote = "",
}) => {
  return (
    <Box
      onClick={onClick} // Maneja el clic
      sx={{
        flex: "1 1 30%",
        minWidth: "280px",
        maxWidth: "450px",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: selected ? "#e3f2fd" : "#ffffff",
        boxShadow: selected
          ? "0 4px 8px rgba(33, 150, 243, 0.3)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, background-color 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 8px rgba(33, 150, 243, 0.3)",
        },
        cursor: "pointer",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          marginBottom: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      <NoteForm
        initialData={initialData}
        mode={mode}
        autoSave={autoSave}
        showSubmitButton={showSubmitButton}
        onSubmit={onSubmit}
        sx={{
          backgroundColor: selected ? "#dceefb" : "#ffffff",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        viewNote={viewNote}
      />
    </Box>
  );
};

export default SelectableBox;
