export const API_BASE = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || 'http://localhost/logistics_api';
export const API_ENDPOINT = `${API_BASE}/api.php`;