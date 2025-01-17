import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getContrastColor } from "../../utils/contrastColor";

const NoteCard = ({ note, onView, onDelete }) => {
  const textColor = getContrastColor(note?.color || "#ffffff");

  return (
    <Card
      onClick={() => onView(note.id)}
      sx={{
        minHeight: 220,
        backgroundColor: note?.color || "#ffffff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ícono de eliminar */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation(); // Evita que el clic en el ícono dispare `onView`
          onDelete(note.id);
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: textColor,
          transition: "color 0.3s",
          "&:hover": {
            color: textColor === "#000" ? "#333" : "#ddd",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>

      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: textColor,
            textShadow: `0px 0px 4px ${
              textColor === "#000" ? "#fff" : "#000"
            }`, // Sombra de color contrario
            marginBottom: 1,
          }}
        >
          {note.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: textColor,
            textShadow: `0px 0px 2px ${
              textColor === "#000" ? "#fff" : "#000"
            }`, // Sombra de color contrario
            marginBottom: 2,
            maxHeight: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {note.content.length > 100
            ? `${note.content.substring(0, 100)}...`
            : note.content}
        </Typography>

        {/* Sección de etiquetas */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {note.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                fontSize: "0.85rem",
                color: textColor,
                borderColor: textColor,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: textColor,
                  color: note?.color || "#ffffff",
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
