import { useDispatch } from "react-redux";
import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
import NoteForm from "../../../components/notes/NoteForm";
import { createNote } from "../../../redux/actions/notes/notes";
import { useNavigate } from "react-router-dom";

const CreateNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = async (note) => {
    const result = await dispatch(createNote(note)); // Despacha la acción para crear la nota
        // Manejar el resultado de la actualización
    if (result.success) {
      navigate("/notes");
    } else if (result.conflict) {
      navigate(`/notes/${result.note_id}/resolve-conflict`);
    } else {
      alert("Error al actualizar la nota.");
    }
    return result // Redirige a la lista de notas
  };

  return (
    <Layout>
      <Navbar />
      <NoteForm onSubmit={handleCreate} mode="create" viewNote="Crear Nota" />
    </Layout>
  );
};

export default CreateNote;
