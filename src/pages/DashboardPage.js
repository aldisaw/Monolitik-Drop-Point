import React from 'react'; 
import Modal from 'react-modal';
import ShipmentForm from '../components/ShipmentForm';
import ShipmentList from '../components/ShipmentList';
import '../App.css';


function DashboardPage({ 
  refreshTrigger, 
  modalIsOpen, 
  closeModal, 
  onFormSubmit,
  // PROP BARU DITERIMA DI SINI:
  onSelectShipment, 
  refreshShipmentList 
}) {

  return (
    <div className="dashboard-page">
      {/* Meneruskan props onSelectShipment dan refreshShipmentList ke ShipmentList.
        ShipmentList akan menggunakan onSelectShipment untuk membuka modal kurir di App.js.
      */}
      <ShipmentList 
        refreshTrigger={refreshTrigger} 
        onSelectShipment={onSelectShipment}
        refreshShipmentList={refreshShipmentList}
      />
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add New Shipment"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <ShipmentForm 
          onShipmentAdded={onFormSubmit} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}

export default DashboardPage;