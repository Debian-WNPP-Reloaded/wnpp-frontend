import { Route, Routes } from "react-router-dom";
import "./App.css";
import Packages from "./pages/Packages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Packages />} />
    </Routes>
  );
}

export default App;
