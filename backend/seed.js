const axios = require('axios');

async function seed() {
    const API_URL = 'http://localhost:3000';
    let token;

    console.log('🌱 Seeding database...');

    // 1. Try to Login first
    try {
        console.log('Attempting to login as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'password123'
        });
        token = loginRes.data.access_token;
        console.log('✅ Logged in successfully.');
    } catch (error) {
        // If login fails, try to register
        console.log('Login failed, creating Admin User...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username: 'admin',
                password: 'password123',
                role: 'admin'
            });
            console.log('✅ Admin user created.');

            // Login again
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin',
                password: 'password123'
            });
            token = loginRes.data.access_token;
            console.log('✅ Logged in successfully.');
        } catch (createError) {
            console.error('❌ Failed to create user or login:', createError.response ? createError.response.data : createError.message);
            return;
        }
    }

    // 2. Create Territory (Plaza Murillo, La Paz)
    try {
        console.log('Creating Test Territory (Plaza Murillo, La Paz)...');

        // Coordinates around Plaza Murillo
        const territoryData = {
            name: 'Plaza Murillo - La Paz',
            description: 'Area histórica de La Paz, Bolivia.',
            polygon: {
                type: 'Polygon',
                coordinates: [[
                    [-68.1305, -16.4955],
                    [-68.1290, -16.4955],
                    [-68.1290, -16.4965],
                    [-68.1305, -16.4965],
                    [-68.1305, -16.4955]
                ]]
            }
        };

        await axios.post(`${API_URL}/territories`, territoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Territory created: Plaza Murillo');

    } catch (error) {
        console.error('❌ Error creating territory:', error.response ? error.response.data : error.message);
    }
}

seed();
