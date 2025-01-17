import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

import Login from "./containers/pages/Login";
import Error404 from "./containers/errors/Error404";
import Home from "./containers/pages/Home";
import Notes from "./containers/pages/notes/Notes";
import Register from "./containers/pages/Register";
import ProtectedRoute from "./components/routers/ProtectedRoute";
import NewNote from "./containers/pages/notes/NewNote";
import NoteDetails from "./containers/pages/notes/NoteDetails";
import ResolveConflict from "./containers/pages/notes/ResolveConflict";
import { useEffect } from "react";
import { checkSessionValidity } from "./utils/sessionUtils";

function App() {

  useEffect(() => {
    // Ejecuta solo una vez al inicio
    const sessionExpired = checkSessionValidity();
    if (sessionExpired) {
      ("Sesión expirada, cerrando sesión...");
    } else {
      ("Sesión válida, configurando temporizador...");
    }
  }, []);
  
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* error display*/}
          <Route path="*" element={<Error404 />} />
          {/* home display*/}
          <Route path="/" element={<Home />} />
          {/* login display*/}
          <Route path="/login" element={<Login />} />
          {/* register display*/}
          <Route path="/register" element={<Register />} />
          {/* notes display*/}

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-note"
            element={
              <ProtectedRoute>
                <NewNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/resolve-conflict"
            element={
              <ProtectedRoute>
                <ResolveConflict />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
