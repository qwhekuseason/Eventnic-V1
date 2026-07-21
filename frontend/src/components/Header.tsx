// @ts-nocheck
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { memo, useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = memo(function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'NOMINEE') return '/nominee';
    if (user?.role === 'ORGANIZER') return '/dashboard';
    return '/my-tickets';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Ticketing', path: '/ticketing' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? '' : 'py-md px-margin'}`}>
      <div className={`mx-auto flex justify-between items-center transition-all duration-300 ${
        isScrolled
          ? 'w-full px-margin h-[64px] bg-[#140d23]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'max-w-container-max rounded-2xl px-lg h-[72px] bg-[#140d23]/80 backdrop-blur-md border border-white/10 shadow-xl'
      }`}>
        <div className="flex items-center gap-xl">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo variant="white" />
          </Link>
          <nav className="hidden md:flex items-center gap-lg ml-xl">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className="text-white/90 font-medium hover:text-tertiary transition-colors duration-200 font-label-md relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tertiary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-md">
          <button 
            onClick={toggleTheme} 
            className="p-xs text-white/90 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center mr-2"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-sm bg-white/10 hover:bg-white/20 border border-white/20 px-sm py-xs rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-white font-medium font-label-sm max-w-[100px] truncate">{user?.name}</span>
                <span className="material-symbols-outlined text-white/70 text-[20px]">expand_more</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-sm w-56 bg-surface rounded-2xl shadow-xl border border-outline-variant overflow-hidden"
                  >
                    <div className="p-md border-b border-outline-variant bg-surface-container-lowest">
                      <p className="font-bold text-on-surface truncate">{user?.name}</p>
                      <p className="text-xs text-secondary truncate">{user?.email}</p>
                      <span className="inline-block mt-xs px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold tracking-wider">
                        {user?.role || 'VOTER'}
                      </span>
                    </div>
                    <div className="p-xs">
                      <Link to="/settings" className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-high rounded-xl text-on-surface transition-colors font-label-md">
                        <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                      </Link>
                      <Link to={getDashboardLink()} className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-high rounded-xl text-on-surface transition-colors font-label-md">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-sm px-md py-sm hover:bg-error-container hover:text-error rounded-xl text-on-surface transition-colors font-label-md text-left">
                        <span className="material-symbols-outlined text-[20px]">logout</span> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-md py-sm text-white/90 font-medium font-label-md hover:text-tertiary transition-colors duration-200">
                Log in
              </Link>
              <Link to="/signup" className="px-lg py-[10px] bg-primary text-white rounded-full font-bold font-label-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.99] transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-xs rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-[28px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[72px] left-0 w-full bg-surface h-[calc(100vh-72px)] overflow-y-auto"
          >
            <div className="p-margin flex flex-col gap-lg">
              {isAuthenticated && (
                <div className="p-md bg-surface-container-low rounded-2xl flex items-center gap-md border border-outline-variant">
                  <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{user?.name}</p>
                    <p className="text-sm text-secondary">{user?.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-sm">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-sm p-md font-headline-sm font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors text-left"
                >
                  <span className="material-symbols-outlined">
                    {isDark ? 'light_mode' : 'dark_mode'}
                  </span>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className="p-md font-headline-sm font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="h-px w-full bg-outline-variant my-xs"></div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-sm">
                  <Link to={getDashboardLink()} className="p-md font-headline-sm font-bold text-primary bg-primary/10 rounded-xl text-center">
                    Go to Dashboard
                  </Link>
                  <button onClick={handleLogout} className="p-md font-label-md font-bold text-error border border-error/30 rounded-xl text-center">
                    Logout
                  </button>
              <Link to="/settings" className="p-md font-headline-sm font-bold text-primary bg-primary/10 rounded-xl text-center">
                    Settings
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  <Link to="/login" className="p-md font-headline-sm font-bold text-on-surface border border-outline-variant rounded-xl text-center">
                    Log In
                  </Link>
                  <Link to="/signup" className="p-md font-headline-sm font-bold text-white bg-primary rounded-xl text-center">
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
