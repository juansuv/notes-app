import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import { deleteNote } from "../../redux/actions/notes/notes";

const DeleteNote = ({ open, onClose, noteId }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteNote(noteId)); // Despacha la acción para eliminar la nota
    onClose(); // Cierra el cuadro de diálogo
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Nota</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar esta nota? Esta acción no se
          puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNote;
