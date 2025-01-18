import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
import NoteForm from "../../../components/notes/NoteForm"; // Reutilizamos NoteForm
import { fetchNotes, updateNote } from "../../../redux/actions/notes/notes";

const NoteDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notes, loading } = useSelector((state) => state.notes);
  const note = notes.find((note) => note.id === parseInt(id)); // Buscamos la nota específica

  const [initialData, setInitialData] = useState({
    title: "",
    content: "",
    version: "",
    tags: [],
    color: "#ffffff",
  });

  useEffect(() => {
    if (!notes.length) {
      dispatch(fetchNotes()); // Si no hay notas cargadas, las buscamos
    } else if (note) {
      // Actualizamos initialData con los datos de la nota específica
      setInitialData({
        title: note.title,
        content: note.content,
        version: note.version,
        tags: note.tags,
        color: note.color,
      });
    }
  }, [dispatch, notes, note]);

  const handleSubmit = async (updatedNote) => {
    // Incluimos todos los campos en la actualización
    const result = await dispatch(
      updateNote({
        ...note, // Incluimos los campos existentes de la nota
        ...updatedNote, // Sobrescribimos los campos actualizados
        id, // Incluimos el ID
        version: note.version, // Usamos la versión actual
      })
    );

    // Manejar el resultado de la actualización
    if (result.success) {
      navigate("/notes");
    } else if (result.conflict) {
      navigate(`/notes/${result.note_id}/resolve-conflict`);
    } else {
      alert("Error al actualizar la nota.");
    }


    return result;
  };

  if (loading || !note) {
    return (
      <Layout>
        <Navbar />
        <p>Cargando nota...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      <NoteForm
        initialData={initialData}
        onSubmit={handleSubmit}
        mode="edit"
        id={id}
      />
    </Layout>
  );
};

export default NoteDetails;
