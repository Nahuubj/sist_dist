import { pool } from "../db.js";


export const getReports = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM diskreports;");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener reportes:", error);
        res.status(500).send("Error al obtener reportes");
    }
};

export const insertReport = async (req, res) => {
    try {
        const { client_id, memory_in_use, total_memory, name } = req.body;

        const result = await pool.query(
            "INSERT INTO diskreports (client_id, memory_in_use, total_memory, name, report_date) VALUES ($1, $2, $3, $4,NOW()) RETURNING *;",
            [client_id, memory_in_use, total_memory, name]
        );

        res.status(201).json({ message: "Reporte insertado correctamente", report: result.rows[0] });
    } catch (error) {
        console.error("Error al insertar reporte:", error);
        res.status(500).send("Error al insertar reporte");
    }
};