import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getContrastColor } from "../../utils/contrastColor";
import { formatDate } from "../../utils/dateFormat";

const NoteCard = ({ note, onView, onDelete }) => {
  const [open, setOpen] = useState(false); // Estado para controlar el diálogo
  const textColor = getContrastColor(note?.color || "#ffffff");

  const handleOpenDialog = (e) => {
    e.stopPropagation(); // Evita que el clic dispare `onView`
    setOpen(true); // Abre el diálogo
  };

  const handleCloseDialog = () => {
    setOpen(false); // Cierra el diálogo
  };

  const handleConfirmDelete = () => {
    onDelete(note.id); // Ejecuta la acción de eliminar
    setOpen(false); // Cierra el diálogo
  };

  return (
    <>
      <Card
        onClick={() => onView(note.id)}
        sx={{
          minHeight: 220,
          background: `linear-gradient(135deg, ${
            note.color || "#f5f5f5"
          } 40%, ${note.color ? `${note.color}b3` : "#e5e5e5"} 100%)`,
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.3s, box-shadow 0.3s",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ícono de eliminar */}
        <IconButton
          onClick={handleOpenDialog}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: textColor,
            "&:hover": {
              color: "red",
              transform: "scale(1.2)",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>

        {/* Contenido de la tarjeta */}
        <CardContent
          sx={{
            padding: "16px",
            "&:last-child": { paddingBottom: "16px" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: textColor,
              marginBottom: 1,
            }}
          >
            {note.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: textColor,
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
        </CardContent>

        {/* Fecha y etiquetas */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: 8,
            right: 8,
            left: 8,
            padding: "0 8px",
            maxWidth: "calc(100% - 16px)",
          }}
        >
          {/* Última modificación */}
          <Typography
            variant="body2"
            sx={{
              color: textColor,
              fontSize: "0.75rem",
            }}
          >
            Últ mod: {formatDate(note.updated_at)}
          </Typography>

          {/* Etiquetas */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "flex-end",
            }}
          >
            {note.tags?.slice(0, 4).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                size="small"
                sx={{
                  fontSize: "0.85rem",
                  borderRadius: "16px",
                  color: textColor,
                  borderColor: textColor,
                  "&:hover": {
                    backgroundColor: textColor,
                    color: note?.color || "#ffffff",
                  },
                }}
              />
            ))}
            {note.tags?.length > 4 && (
              <Typography
                variant="body2"
                sx={{
                  color: textColor,
                  fontSize: "0.8rem",
                }}
              >
                +{note.tags.length - 4} etiquetas
              </Typography>
            )}
          </Box>
        </Box>
      </Card>

      {/* Diálogo de confirmación */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta nota? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteCard;
