import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

import Login from "./containers/pages/Login";
import Error404 from "./containers/errors/Error404";
import Home from "./containers/pages/Home";
import Notes from "./containers/pages/Notes";
import Register from "./containers/pages/Register";
import ProtectedRoute from "./components/routers/ProtectedRoute";

function App() {
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
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
