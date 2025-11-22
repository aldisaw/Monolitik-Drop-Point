import React, { useState, useRef, useEffect } from 'react'; 
// Asumsi styling header ada di App.css
// import './components.css'; 

function Header({ userName, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  // Logic untuk menutup dropdown saat user klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };
  
  return (
    <header className="header">
      {/* Container Dropdown dengan ref */}
      <div className="dropdown-wrapper" ref={dropdownRef}>
        
        {/* Trigger/Pemicu Dropdown */}
        <div className="user-info-trigger" onClick={toggleDropdown}>
          <span className="welcome-text">Halo, {userName || 'Pegawai'}</span>
          {/* Ikon panah yang berputar saat dropdown terbuka */}
          <span className={`dropdown-arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
        </div>
        
        {/* Menu Dropdown */}
        {isOpen && (
          <div className="dropdown-menu">
            <button 
              onClick={handleLogoutClick} 
              className="dropdown-item btn-delete" 
            >
              Keluar (Logout)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;