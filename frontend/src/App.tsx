import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

import AnimatedRouters from "./AnimatedRouters";

function App() {
  return (
    <Provider store={store}>
      {/* BrowserRouter debe envolver todo el ruteo de la aplicación */}
      <Router>
        <AnimatedRouters />
      </Router>
    </Provider>
  );
}

export default App;
