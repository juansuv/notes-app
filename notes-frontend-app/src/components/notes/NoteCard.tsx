import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

const NoteCard = ({ note, onView, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        minHeight: 200, // Altura mínima para mantener los botones visibles
        backgroundColor: "#FFF9C4",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {note.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", marginTop: 1 }}
        >
          {note.content.length > 100
            ? `${note.content.substring(0, 200)}...`
            : note.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => onView(note.id)}
          sx={{ color: "#2196F3" }}
        >
          Ver
        </Button>
        <Button
          size="small"
          onClick={() => onDelete(note.id)}
          sx={{ color: "#F44336" }}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default NoteCard;
