import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Departments from "./pages/Departments";
import Attributes from "./pages/Attributes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="departments" element={<Departments />} />
          <Route path="attributes" element={<Attributes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
