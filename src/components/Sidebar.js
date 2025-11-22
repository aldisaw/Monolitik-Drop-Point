import React from 'react';
import './components.css';

import { 
  FiPackage, 
  FiPlus     
} from 'react-icons/fi';


function Sidebar({ onAddNew }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        Dashboard
      </div>

      {}
      <div className="sidebar-add-new">
        <button className="add-shipment-button-sidebar" onClick={onAddNew}>
          <FiPlus /> Add Shipment
        </button>
      </div>

      <nav className="sidebar-nav">
        {}
        <a href="#" className="nav-item active">
          <FiPackage /> Data Pengiriman
        </a>
        
        {}
      </nav>
    </div>
  );
}

export default Sidebar;