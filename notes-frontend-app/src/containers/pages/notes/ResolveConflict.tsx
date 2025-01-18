import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearConflict, updateNote } from "../../../redux/actions/notes/notes";
import { Box, Typography, Button, colors } from "@mui/material";
import SelectableBox from "../../../components/notes/SelectableBox"; // Importa tu nuevo componente
import Layout from "hocs/layouts/Layout";
import Navbar from "../../../components/navigation/Navbar";
import { useNavigate, useParams } from "react-router-dom";

const ResolveConflict = () => {
  const [conflict, setConflict] = useState(null);
  const conflictFromState = useSelector((state: any) => state.notes.conflict);
  const { id: noteId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [selectedVersion, setSelectedVersion] = useState("server");
  const [mergedNote, setMergedNote] = useState({
    title: "",
    content: "",
    version: "",
    tags: [],
    color: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedConflict = JSON.parse(localStorage.getItem("conflict"));

    if (conflictFromState) {
      setConflict(conflictFromState);
    } else if (
      storedConflict &&
      parseInt(storedConflict.serverVersion.id, 10) === parseInt(noteId, 10)
    ) {
      setConflict(storedConflict);
    } else {
      setConflict(null);
    }
  }, [conflictFromState, noteId]);

  useEffect(() => {
    if (conflict) {
      setMergedNote({
        title:
          conflict?.serverVersion.title + conflict?.clientVersion.title || "",
        content:
          conflict?.serverVersion.content + conflict?.clientVersion.content ||
          "",
        version: conflict?.serverVersion.version,
        tags: [
          ...new Set([
            ...conflict?.serverVersion?.tags,
            ...conflict?.clientVersion?.tags,
          ]),
        ],
        color: conflict?.serverVersion.color,
      });
    }
  }, [conflict]);

  const handleResolve = () => {
    const noteToSave =
      selectedVersion === "server"
        ? { ...conflict.serverVersion, version: conflict.serverVersion.version }
        : selectedVersion === "client"
        ? {
            ...conflict.clientVersion,
            version: conflict.serverVersion.version,
            id: conflict.serverVersion.id,
          }
        : {
            ...conflict.serverVersion,
            ...mergedNote,
            id: conflict.serverVersion.id,
          };
    dispatch(updateNote(noteToSave));
    dispatch(clearConflict());
    setConflict(null);
    navigate(`/notes`);
  };

  if (!conflict) {
    return <div>No hay conflictos para esta nota.</div>;
  }

  return (
    <Layout>
      <Navbar />
      <Box
        sx={{
          padding: 3,
          paddingTop: "80px",
          width: "100vw", // Asegura el ancho completo
          minHeight: "100vh", // Ocupa toda la altura disponible
          backgroundColor: "#f0f4f8", // Fondo claro
          boxSizing: "border-box",
        }}
      >
       

        <Typography
          variant="h4"
          textAlign="center"
          color = "error"
          sx={{
            fontWeight: "bold",
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)", // Sombra del texto
            marginBottom: "8px",
          }}
        >
          Conflicto detectado
        </Typography>
        <Typography
          textAlign="center"
          sx={{
            fontSize: "1rem",
            
            color: "rgba(73, 61, 61, 0.9)", // Color más claro para contraste
            textShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
            marginBottom: "20px" // Sombra ligera para el texto secundario
          }}
        >
          Se ha detectado un conflicto. Selecciona una versión o combina las
          dos.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap", // Permite que las tarjetas se ajusten a múltiples líneas
            justifyContent: "center", // Centra las tarjetas horizontalmente
            gap: 4, // Espaciado uniforme entre tarjetas
          }}
        >
          {/* Información Guardada */}
          <SelectableBox
            viewNote="Información Guardada"
            initialData={conflict.serverVersion}
            selected={selectedVersion === "server"}
            onSubmit={() => setSelectedVersion("server")}
            onClick={() => setSelectedVersion("server")}
          />

          {/* Cambios Recientes */}
          <SelectableBox
            viewNote="Cambios Recientes"
            initialData={conflict.clientVersion}
            selected={selectedVersion === "client"}
            onSubmit={() => setSelectedVersion("client")}
            onClick={() => setSelectedVersion("client")}
          />

          {/* Mezclar Información */}
          <SelectableBox
            viewNote="Mezclar Información"
            initialData={mergedNote}
            mode="edit"
            autoSave={true}
            selected={selectedVersion === "merged"}
            onSubmit={(data) => {
              setSelectedVersion("merged");
              console.log("Merged desde onSubmit data", data);
              setMergedNote(data);
            }}
            onClick={() => {
              setSelectedVersion("merged");
            }}
          />
        </Box>

        {/* Botón Final para Guardar */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            marginTop: 4,
            backgroundColor: "#4caf50",
            color: "white",
            "&:hover": { backgroundColor: "#45a047" },
          }}
          onClick={handleResolve}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Layout>
  );
};

export default ResolveConflict;
