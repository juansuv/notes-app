import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateNote } from "../../../redux/actions/notes/notes";
import { Box, Typography, Button } from "@mui/material";
import NoteForm from "../../../components/notes/NoteForm";
import { useNavigate } from "react-router-dom";
import Layout from "../../../hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";

const ResolveConflict = ({ onResolve }) => {
  const conflict = useSelector((state) => state.notes.conflict);
  const dispatch = useDispatch();
  console.log("conflict", conflict);
  const [selectedVersion, setSelectedVersion] = useState("server"); // Puede ser 'server', 'client', o 'merged'
  const [mergedNote, setMergedNote] = useState({
    title: conflict?.serverVersion.title + conflict?.clientVersion.title || "",
    content: conflict?.serverVersion.content + conflict?.clientVersion.content || "",
    version: conflict?.serverVersion.version
  });

  const navigate = useNavigate();
  console.log("hayconflixt", conflict);
  if (!conflict) return null;

  const handleResolve = () => {
    const noteToSave =
      selectedVersion === "server"
        ? { ...conflict.serverVersion, version: conflict.serverVersion.version }
        : selectedVersion === "client"
        ? { ...conflict.clientVersion, version: conflict.serverVersion.version, id: conflict.serverVersion.id }
        : {
            ...conflict.serverVersion,
            ...mergedNote,
            id: conflict.serverVersion.id,// Aseguramos usar la versión del servidor
          };
    dispatch(updateNote(noteToSave));
    navigate(`/notes`);
  };

  return (
    <Layout>
    <Navbar />
    <Box sx={{ padding: 3, backgroundColor: "#f8d7da", borderRadius: 4 }}>
      <Typography variant="h6" color="error">
        Conflicto detectado
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        La nota ha sido modificada por otro usuario. Por favor, elige una
        versión o combina ambas.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Para hacerlo responsivo
          justifyContent: "space-between",
          gap: 2, // Espaciado entre las versiones
        }}
      >
        {/* Versión del Servidor */}
        <Box
          sx={{
            flex: "1 1 30%", // Flexibilidad y tamaño inicial del contenedor
            minWidth: "300px", // Asegura un tamaño mínimo para cada columna
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Versión del Servidor
          </Typography>
          <NoteForm
            initialData={conflict.serverVersion}
            mode="view"
            onSubmit={() => setSelectedVersion("server")}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setSelectedVersion("server")}
            color={selectedVersion === "server" ? "primary" : "inherit"}
          >
            Usar esta versión
          </Button>
        </Box>

        {/* Versión del Cliente */}
        <Box
          sx={{
            flex: "1 1 30%",
            minWidth: "300px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Versión del Cliente
          </Typography>
          <NoteForm
            initialData={conflict.clientVersion}
            mode="view"
            onSubmit={() => setSelectedVersion("client")}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setSelectedVersion("client")}
            color={selectedVersion === "client" ? "primary" : "inherit"}
          >
            Usar esta versión
          </Button>
        </Box>

        {/* Versión Combinada */}
        <Box
          sx={{
            flex: "1 1 30%",
            minWidth: "300px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Combinar Versiones
          </Typography>
          <NoteForm
            initialData={mergedNote}
            mode="edit"
            autoSave={true}
            onSubmit={(data) => {
              setSelectedVersion("merged");
              setMergedNote(data);
            }}
            showSubmitButton={false}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setSelectedVersion("merged")}
            color={selectedVersion === "merged" ? "primary" : "inherit"}
          >
            Usar versión combinada
          </Button>
        </Box>
      </Box>

      {/* Botón Final para Guardar */}
      <Button
        variant="contained"
        fullWidth
        color="success"
        sx={{ marginTop: 4 }}
        onClick={handleResolve}
      >
        Guardar Cambios
      </Button>
    </Box>
    </Layout>
  );
};

export default ResolveConflict;
