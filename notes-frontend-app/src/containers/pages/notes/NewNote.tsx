import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
import NoteForm from "../../../components/notes/NoteForm";
import { createNote } from "../../../redux/actions/notes/notes";

const CreateNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = (note) => {
    dispatch(createNote(note)); // Despacha la acción para crear la nota
    navigate("/notes"); // Redirige a la lista de notas
  };

  return (
    <Layout>
      <Navbar />
      <NoteForm onSubmit={handleCreate} mode="create" />
    </Layout>
  );
};

export default CreateNote;
