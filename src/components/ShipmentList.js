import React, { useEffect, useState } from 'react';
import './components.css';
import { API_ENDPOINT } from '../config';

function ShipmentList({ refreshTrigger, onSelectShipment, refreshShipmentList }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}?resource=shipments`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Data shipments:", data);
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [refreshTrigger]);

  const handleRequestPickup = (id) => {
    onSelectShipment(id);
  };

  const handleCancelPickup = async (shipmentId, courierId) => {
    if (!window.confirm("Yakin batalkan penugasan kurir? Status akan dikembalikan ke 'At Drop Point'.")) return;

    try {
      const response = await fetch(`${API_ENDPOINT}?id=${shipmentId}&resource=shipments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "At Drop Point",
          cancel_courier_id: courierId
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Penugasan kurir berhasil dibatalkan.");
        refreshShipmentList();
      } else {
        alert(result.message || 'Gagal membatalkan penugasan.');
      }
    } catch (error) {
      console.error('Error canceling pickup:', error);
      alert('Gagal membatalkan penugasan.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengiriman ini?")) return;
    try {
      const response = await fetch(`${API_ENDPOINT}?id=${id}&resource=shipments`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Pengiriman berhasil dihapus.");
        refreshShipmentList();
      } else {
        alert(result.message || 'Gagal menghapus pengiriman.');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus pengiriman.');
    }
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="component-container">
      <h2>Data Pengiriman</h2>

      <table className="shipment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Waktu Input</th>
            <th>Pengirim</th>
            <th>Berat (kg)</th>
            <th>Penerima</th>
            <th>Alamat Penerima</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length === 0 ? (
            <tr><td colSpan="8">Tidak ada pengiriman ditemukan.</td></tr>
          ) : (
            shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id ?? '-'}</td>
                <td>{shipment.created_at ? new Date(shipment.created_at).toLocaleString() : '-'}</td>

                {/* Pengirim */}
                <td>
                  <strong>{shipment.shipper_name ?? '-'}</strong>
                  <small>{shipment.shipper_phone ?? '-'}</small>
                </td>

                <td>{shipment.weight_item ?? '-'}</td>

                {/* Penerima */}
                <td>
                  <strong>{shipment.receiver_name ?? '-'}</strong>
                  <small>{shipment.receiver_phone ?? '-'}</small>
                </td>

                <td>
                  {[
                    shipment.alamat_lengkap,
                    shipment.kecamatan,
                    shipment.kota,
                    shipment.provinsi,
                    shipment.kode_pos
                  ].map((x) => x ?? '-').join(', ')}
                </td>

                <td>
                  <span className={`status status-${(shipment.status ?? 'unknown').replace(/\s+/g, '-')}`}>
                    {shipment.status ?? '-'}
                  </span>
                </td>

                <td className="actions">
                  {shipment.status === 'At Drop Point' && (
                    <>
                      <button className="btn-request" onClick={() => handleRequestPickup(shipment.id)}>Request Pickup</button>
                      <button className="btn-delete" onClick={() => handleDelete(shipment.id)}>Hapus</button>
                    </>
                  )}
                  {shipment.status === 'Ready for Pickup' && shipment.courier_id && (
                    <button className="btn-cancel" onClick={() => handleCancelPickup(shipment.id, shipment.courier_id)}>Batal</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentList;
