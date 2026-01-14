import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.js";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";   // ✅ ADD THIS IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddJob />} />
        <Route path="/edit/:id" element={<EditJob />} />  ✅ ADD THIS LINE
      </Routes>
    </BrowserRouter>
  );
}

export default App;
