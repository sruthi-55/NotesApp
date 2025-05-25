import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import UserMenu from './components/UserMenu';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Home from './pages/Home';

// Wrapper to conditionally show UserMenu
const AppContent = () => {
  const location = useLocation();
  const hideUserMenu = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {!hideUserMenu && <UserMenu />}
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/notes" element={<Home />} />
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
