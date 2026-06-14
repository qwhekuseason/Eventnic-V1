// @ts-nocheck
import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

const Header = memo(function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'NOMINEE') return '/nominee';
    if (user?.role === 'ORGANIZER') return '/dashboard';
    return '/my-tickets';
  };

  const dashboardLabel = user?.role === 'ATTENDEE' ? 'My Tickets' : 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed w-full top-0 z-50 px-margin py-md">
      <div className="glass-panel max-w-container-max mx-auto rounded-full px-lg flex justify-between items-center h-[72px]">
        <div className="flex items-center gap-xl">
          <Link to="/" className="flex items-center">
            <Logo variant="white" />
          </Link>
          <nav className="hidden md:flex items-center gap-lg ml-xl">
            <Link className="text-white/90 font-medium hover:text-tertiary transition-colors duration-200 font-label-md" to="/explore">Explore</Link>
            <Link className="text-white/90 font-medium hover:text-tertiary transition-colors duration-200 font-label-md" to="/pricing">Pricing</Link>
            <Link className="text-white/90 font-medium hover:text-tertiary transition-colors duration-200 font-label-md" to="/about">About</Link>
            <Link className="text-white/90 font-medium hover:text-tertiary transition-colors duration-200 font-label-md" to="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          {isAuthenticated ? (
            <>
              <Link 
                to={getDashboardLink()}
                className="px-md py-sm text-white/90 font-medium font-label-md hover:text-tertiary transition-colors duration-200"
              >
                {dashboardLabel}
              </Link>
              <button 
                onClick={handleLogout}
                className="px-lg py-[10px] bg-gradient-premium text-white rounded-full font-bold font-label-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.99] transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="px-md py-sm text-white/90 font-medium font-label-md hover:text-tertiary transition-colors duration-200"
              >
                Log in
              </Link>
              <Link 
                to="/signup"
                className="px-lg py-[10px] bg-gradient-premium text-white rounded-full font-bold font-label-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.99] transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
