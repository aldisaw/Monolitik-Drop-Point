import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import LoginForm from './components/LoginForm';
// 1. Import komponen modal baru
import CourierAssignmentModal from './components/CourierAssignmentModal'; 

Modal.setAppElement('#root');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 

  const [refreshList, setRefreshList] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal untuk input form baru

  // STATE BARU untuk penugasan kurir
  const [selectedShipmentId, setSelectedShipmentId] = useState(null); // ID shipment yang dipilih untuk ditugaskan

  // LOGIKA PERSISTENSI SESI: MEMERIKSA LOCALSTORAGE SAAT APLIKASI DIMUAT
  useEffect(() => {
    const storedUser = localStorage.getItem('userSession');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Pulihkan state login
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // --- Fungsi untuk Modal Input Form Baru (ADD NEW) ---
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleFormSubmit = () => {
    setRefreshList(prev => prev + 1);
    closeModal();
  };

  // --- Fungsi untuk Modal Penugasan Kurir (ASSIGN COURIER) ---
  const handleOpenAssignCourierModal = (shipmentId) => {
    setSelectedShipmentId(shipmentId);
  };

  const handleCloseAssignCourierModal = () => {
    setSelectedShipmentId(null);
  };
  
  // Fungsi untuk refresh data yang dipicu setelah sukses submit atau assign
  const handleRefreshData = () => {
    setRefreshList(prev => prev + 1);
  };

  // --- Login/Logout Handlers ---
  const handleLoginSuccess = (userData) => {
    // SIMPAN SESI KE LOCAL STORAGE SAAT LOGIN BERHASIL
    localStorage.setItem('userSession', JSON.stringify(userData));
    
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // HAPUS SESI DARI LOCAL STORAGE SAAT LOGOUT DILAKUKAN
    localStorage.removeItem('userSession');
    
    setUser(null);
    setIsLoggedIn(false);
  };


  if (!isLoggedIn) {
    return (
      <div className="app-login-container">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Konten Dashboard
  return (
    <div className="app-layout">
      
      <Sidebar onAddNew={openModal} />
      
      <div className="main-content-wrapper">
        {/* Mengakses nama_lengkap dari objek user yang tersimpan */}
        <Header userName={user?.nama_lengkap || 'Pegawai'} onLogout={handleLogout} /> 
        
        <main className="page-content">
          <DashboardPage 
            refreshTrigger={refreshList}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            onFormSubmit={handleFormSubmit}
            
            // PROP BARU untuk ShipmentList di dalam DashboardPage
            onSelectShipment={handleOpenAssignCourierModal} // Dioper ke ShipmentList
            refreshShipmentList={handleRefreshData}          // Dioper ke ShipmentList
          />
        </main>
      </div>
      
      {/* 2. Render Modal Penugasan Kurir di sini */}
      <CourierAssignmentModal
        shipmentId={selectedShipmentId} // Jika null, modal tidak akan dirender
        onClose={handleCloseAssignCourierModal}
        onAssignmentSuccess={handleRefreshData} // Panggil refresh list saat sukses
      />

    </div>
  );
}

export default App;