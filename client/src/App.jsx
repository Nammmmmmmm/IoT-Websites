import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import  DataSensor from "./pages/DataSensor";
import ActionHistory from "./pages/ActionHistory";
import NewBoard from "./pages/NewBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="datasensor" element={<DataSensor />} />
          <Route path="actionhistory" element={<ActionHistory />} />
          <Route path="newboard" element={<NewBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
