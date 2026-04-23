import { Router } from 'express';
import { Socio } from '../models/Socio.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router(); // El 'Router' es como un mini-jefe que maneja solo las rutas de socios

// RUTA PARA CREAR UN SOCIO (Método POST)
router.post('/registrar',verificarToken ,async (req, res) => {
    try {
        // req.body es donde llega la información que enviamos desde afuera
        const nuevoSocio = new Socio(req.body); 
        
        await nuevoSocio.save();
        
        // Respondemos con éxito y el objeto que se guardó
        res.status(201).json({ mensaje: "Socio registrado!", socio: nuevoSocio });
    } catch (error) {
        // Si hay error (como DNI duplicado), respondemos con el error
        res.status(400).json({ mensaje: "Error al registrar", detalle: error });
    }
});

// RUTA PARA VER TODOS LOS SOCIOS (Método GET)
router.get('/todos', verificarToken, async (req, res) => {
    try {
        // .find() es la función de Mongoose para "buscar". 
        // Si lo dejás vacío (), trae TODO lo que hay en la colección.
        const listaSocios = await Socio.find();
        
        // Respondemos con un status 200 (OK) y la lista
        res.status(200).json(listaSocios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los socios", detalle: error });
    }
});

// RUTA PARA EDITAR UN SOCIO (Método PUT)
// El ':id' en la URL es un parámetro dinámico (un espacio vacío que llenaremos con el ID real)
router.put('/editar/:id', async (req, res) => {
    try {
        const idSocio = req.params.id; // Extraemos el ID de la URL
        const datosNuevos = req.body;  // Los nuevos datos que vienen de Thunder Client

        // Buscamos por ID y actualizamos. 
        // { new: true } sirve para que nos devuelva el socio YA editado y no el viejo.
        const socioEditado = await Socio.findByIdAndUpdate(idSocio, datosNuevos, { new: true });

        res.status(200).json({ mensaje: "Socio actualizado!", socio: socioEditado });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al editar", detalle: error });
    }
});

// RUTA PARA ELIMINAR UN SOCIO (Método DELETE)
router.delete('/eliminar/:id',verificarToken, async (req, res) => {
    try {
        const idSocio = req.params.id;

        // Buscamos por ID y lo borramos de la colección
        const socioEliminado = await Socio.findByIdAndDelete(idSocio);

        if (!socioEliminado) {
            return res.status(404).json({ mensaje: "Socio no encontrado" });
        }

        res.status(200).json({ mensaje: "Socio eliminado correctamente", socio: socioEliminado });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar", detalle: error });
    }
});

export default router;