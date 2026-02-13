import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            alert('Login successful');
            navigate('/map');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md">
                <h2 className="mb-4 text-xl font-bold">Login</h2>
                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        className="w-full p-2 border rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
