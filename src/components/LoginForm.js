import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ganti URL ini sesuai dengan lokasi file api.php Anda
  const API_URL = 'http://localhost/RPL/logistics_api/api.php'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Username dan Password wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && response.status === 200) {
        // Login Berhasil
        onLoginSuccess(data.user);
      } else if (response.status === 401) {
        // Login Gagal (dari PHP status 401)
        setError(data.message || 'Username atau Password salah.');
      } else {
        // Kesalahan server atau respons tidak terduga
        setError(data.message || 'Gagal login. Periksa server API.');
      }
    } catch (err) {
      // Gagal koneksi
      setError('Gagal terhubung ke server API.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>🔑 Login Drop Point</h2>
        <form onSubmit={handleSubmit}>
          {/* Tampilkan pesan error dengan styling .error-message */}
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;