import express from 'express';
import mongoose from 'mongoose';
import socioRoutes from './routes/socioRoutes.js';
import cuotaRoutes from './routes/cuotaRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que el servidor entienda datos JSON que vengan del Frontend
app.use(express.json());

app.use('/api/socios', socioRoutes);
app.use('/api/cuotas', cuotaRoutes); 
app.use('/api/auth', authRoutes);

// Conexión limpia a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gymDB')
    .then(() => console.log('✅ Conectado a MongoDB con éxito'))
    .catch((error) => console.error('❌ Error de conexión:', error));

// Ruta de bienvenida para probar en el navegador
app.get('/', (req, res) => {
    res.send('🏋️ API del Gimnasio lista');
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));