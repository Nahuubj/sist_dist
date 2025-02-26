import { pool } from "../db.js";

export const getClient = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM client;");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).send("Error al obtener clientes");
    }
};

export const getClientByID = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM client WHERE id = $1;",[req.params.id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).send("Error al obtener clientes");
    }
};
export const insertClient = async (req, res) => {
    try {
        const { id,ip, status, mac } = req.body; // Captura los datos desde la petición

        const result = await pool.query(`
            INSERT INTO client (id, ip, created_at, name, updated_at, status, deleted, mac, password) 
            VALUES ($4, $1, NOW(),'Desconocido', NOW(), $2, FALSE, $3, 'hola') 
            RETURNING *;
        `, [ip, status, mac, id]);

        res.status(201).json({
            message: "Cliente insertado con éxito",
            client: result.rows[0]
        });
    } catch (error) {
        console.error("Error al insertar cliente:", error);
        res.status(500).send("Error al insertar cliente");
    }
};

export const putClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { ip, status,  mac } = req.body;

        const result = await pool.query(
            "UPDATE client SET ip = $1, status = $2,  mac = $3, updated_at = NOW() WHERE id = $4 RETURNING *;",
            [ip, status, mac, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.status(200).json({ message: "Cliente actualizado correctamente", cliente: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).send("Error al actualizar cliente");
    }
};