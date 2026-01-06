import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend'e istek atıyoruz (5000 portu)
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Gelen Token'ı tarayıcıya kaydediyoruz
      localStorage.setItem('token', response.data.token);
      alert('Giriş Başarılı!');
      
      // Panale yönlendir
      navigate('/dashboard');
    } catch (error) {
      alert('Giriş başarısız: ' + (error.response?.data?.message || 'Hata oluştu'));
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>EcoCampus Giriş</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-posta Adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default Login;