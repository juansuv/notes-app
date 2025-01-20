import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./containers/pages/Login";
import Error404 from "./containers/errors/Error404";
import Home from "./containers/pages/Home";
import Notes from "./containers/pages/notes/Notes";
import Register from "./containers/pages/Register";
import ProtectedRoute from "./components/routers/ProtectedRoute";
import NewNote from "./containers/pages/notes/NewNote";
import NoteDetails from "./containers/pages/notes/NoteDetails";
import ResolveConflict from "./containers/pages/notes/ResolveConflict";

import { AnimatePresence } from "framer-motion";

function AnimatedRouters() {
  const location = useLocation();
  return (
    <AnimatePresence>
    <Routes location={location} key={location.pathname}>
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
    </AnimatePresence>
  );
}

export default AnimatedRouters;