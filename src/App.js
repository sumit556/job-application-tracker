import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.js";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddJob />} />
          <Route path="/edit/:id" element={<EditJob />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
