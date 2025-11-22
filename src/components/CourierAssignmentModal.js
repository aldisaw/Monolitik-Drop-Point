import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost/RPL/logistics_api/api.php"; 
const TARGET_STATUS = 'TERSEDIA'; 

function CourierAssignmentModal({ shipmentId, onClose, onAssignmentSuccess }) {
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Mengambil daftar SEMUA kurir dari backend.
     * Tidak ada filtering di sini agar semua data ditampilkan.
     */
    useEffect(() => {
        const fetchCouriers = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URL + "?resource=couriers"); 
                
                if (!response.ok) {
                    throw new Error(`Gagal memuat data kurir: ${response.status}`);
                }
                
                const data = await response.json();
                
                // BARU: Menyimpan SEMUA kurir, tidak difilter di sini
                setCouriers(data); 

            } catch (error) {
                console.error("Error fetching couriers:", error);
                setCouriers([]);
            } finally {
                setLoading(false);
            }
        };

        if (shipmentId) {
            fetchCouriers();
        }
        
    }, [shipmentId]);

    /**
     * Handler untuk menugaskan kurir yang dipilih ke shipment.
     */
    const handleAssignCourier = async (courierId) => {
        if (!window.confirm(`Tugaskan kurir ini ke shipment #${shipmentId}?`)) return;

        const updateData = { 
            courier_id: courierId, 
            status: "Ready for Pickup" 
        };

        try {
            const response = await fetch(`${API_URL}?id=${shipmentId}&resource=shipments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message || "Kurir berhasil ditugaskan!");
                onAssignmentSuccess(); 
                onClose(); 
            } else {
                alert(result.message || 'Gagal menugaskan kurir.');
            }
        } catch (error) {
            console.error('Error assigning courier:', error);
            alert('Failed to assign courier.');
        }
    };

    if (!shipmentId) return null; 

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Tugaskan Kurir untuk Shipment #{shipmentId}</h3>
                <p>Status Kurir Saat Ini:</p>
                
                {loading ? (
                    <p>Memuat daftar kurir...</p>
                ) : (
                    <div className="courier-list">
                        {couriers.length === 0 && <p>Tidak ada data kurir ditemukan.</p>}
                        
                        {couriers.map(courier => {
                            // LOGIKA PENTING: Tentukan apakah kurir tersedia
                            const isAvailable = courier.status && courier.status.trim().toUpperCase() === TARGET_STATUS;
                            
                            // Tentukan style berdasarkan ketersediaan
                            const itemStyle = {
                                padding: '10px',
                                margin: '5px 0',
                                border: `1px solid ${isAvailable ? '#4CAF50' : '#ccc'}`,
                                backgroundColor: isAvailable ? '#e6ffe6' : '#f9f9f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: '4px'
                            };

                            return (
                                <div key={courier.id} className="courier-item" style={itemStyle}>
                                    <span>
                                        **{courier.name}** ({courier.vehicle_plate}) - Status: <strong style={{color: isAvailable ? 'green' : 'red'}}>{courier.status}</strong>
                                    </span>
                                    
                                    {/* HANYA RENDER TOMBOL JIKA isAvailable ADALAH TRUE */}
                                    {isAvailable ? (
                                        <button
                                            className="btn-assign"
                                            onClick={() => handleAssignCourier(courier.id)}
                                            style={{ backgroundColor: '#4CAF50', color: 'white' }} 
                                        >
                                            Tugaskan
                                        </button>
                                    ) : (
                                        <span style={{ color: '#777', fontSize: '0.9em' }}>
                                            Tidak Dapat Ditugaskan
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                
                <button className="btn-close" onClick={onClose}>
                    Tutup
                </button>
            </div>
        </div>
    );
}

export default CourierAssignmentModal;