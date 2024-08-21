import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from  "./components/Dashboard";
import Profile from "./components/Profile";
import Departments from "./components/Departments";
import Attributes from "./components/Attributes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attributes" element={<Attributes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
