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

    // 2. Create Territory
    try {
        console.log('Creating Test Territory (Central Park)...');

        // Counter-Clockwise Order (Right Hand Rule)
        const territoryData = {
            name: 'Central Park Test',
            description: 'A test polygon representing a park area.',
            polygon: {
                type: 'Polygon',
                coordinates: [[
                    [-73.9819, 40.7681], // SW
                    [-73.9731, 40.7648], // SE
                    [-73.9493, 40.7968], // NE
                    [-73.9580, 40.8003], // NW
                    [-73.9819, 40.7681]  // SW (Close Loop)
                ]]
            }
        };

        await axios.post(`${API_URL}/territories`, territoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Territory created. ID: Central Park');

    } catch (error) {
        console.error('❌ Error creating territory:', error.response ? error.response.data : error.message);
    }
}

seed();
