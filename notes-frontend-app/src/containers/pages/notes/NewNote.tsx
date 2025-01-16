import React from "react";
import { useDispatch } from "react-redux";
import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
import NoteForm from "../../../components/notes/NoteForm";
import { createNote } from "../../../redux/actions/notes/notes";

const CreateNote = () => {
  const dispatch = useDispatch();

  const handleCreate = async (note) => {
    const result = await dispatch(createNote(note)); // Despacha la acción para crear la nota
    return result // Redirige a la lista de notas
  };

  return (
    <Layout>
      <Navbar />
      <NoteForm onSubmit={handleCreate} mode="create" />
    </Layout>
  );
};

export default CreateNote;
