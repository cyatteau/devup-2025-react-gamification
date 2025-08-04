import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={handleProfileClick}>Profile</button>
          {user && (
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
