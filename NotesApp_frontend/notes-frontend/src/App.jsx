import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Notes from "./pages/Notes";
import UserMenu from "./components/UserMenu";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ViewNote from "./pages/ViewNote";
import TrashPage from "./pages/TrashPage";
import SidebarLayout from "./components/SidebarLayout";
import "./app.css";

// Wrapper to conditionally show UserMenu
const AppContent = () => {
  const location = useLocation();
  const hideUserMenu =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {/* {!hideUserMenu && <UserMenu />} */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout-wrapped private pages */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
          <Route path="/view/:id" element={<ViewNote />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
