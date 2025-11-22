import React, { useState } from 'react';
import './components.css';
import {
	API_ENDPOINT
} from '../config';


function ShipmentForm({ onShipmentAdded, onCancel }) {
  const [formData, setFormData] = useState({
    shipper_name: '',
    weight_item: '',
    shipper_phone: '',
    receiver_phone: '',
    receiver_name: '',
    provinsi: '', 
    kota: '',     
    kecamatan: '', 
    kode_pos: '',
    alamat_lengkap: '',
  });

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = API_ENDPOINT;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        onShipmentAdded();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add shipment.');
    }
  };

  return (
    <div className="component-container">
      <h2>Input New Shipment Data</h2>
      <form onSubmit={handleSubmit} className="shipment-form">
        
        {}
        <div className="form-group">
          <label>Nama Pengirim</label>
          <input type="text" name="shipper_name" value={formData.shipper_name} onChange={handleChange} placeholder="Nama Pengirim" required />
        </div>
        <div className="form-group">
          <label>Nomor Telepon Pengirim</label>
          <input type="text" name="shipper_phone" value={formData.shipper_phone} onChange={handleChange} placeholder="+62" required />
        </div>
        
        {}
        <div className="form-group">
          <label>Nama Penerima</label>
          <input type="text" name="receiver_name" value={formData.receiver_name} onChange={handleChange} placeholder="Nama Penerima" required />
        </div>
        <div className="form-group">
          <label>Nomor Telepon Penerima</label>
          <input type="text" name="receiver_phone" value={formData.receiver_phone} onChange={handleChange} placeholder="+62" required />
        </div>

        {}
        <div className="form-group">
          <label>Provinsi</label>
          <input type="text" name="provinsi" value={formData.provinsi} onChange={handleChange} placeholder="Provinsi" required />
        </div>

        <div className="form-group">
          <label>Kota / Kabupaten</label>
          <input type="text" name="kota" value={formData.kota} onChange={handleChange} placeholder="Kota / Kabupaten" required />
        </div>

        <div className="form-group">
          <label>Kecamatan</label>
          <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Kecamatan" required />
        </div>

        <div className="form-group">
          <label>Kode Pos</label>
          <input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleChange} placeholder="Kode Pos" required />
        </div>

        {}
        <div className="form-group full-width">
          <label>Berat Barang (kg)</label>
          <input type="text" name="weight_item" value={formData.weight_item} onChange={handleChange} placeholder="Berat Barang (kg)" required />
        </div>
        
        <div className="form-group full-width">
          <label>Alamat Lengkap</label>
          <textarea name="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleChange} placeholder="Nama jalan, nomor rumah, RT/RW, etc." required />
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="btn-save">Save Shipment</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ShipmentForm;