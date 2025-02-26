import { pool } from "../db.js";

export const getCombinedReport = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id AS client_id,
                c.ip,
                c.status,
                c.mac,
                r.id AS report_id,
                r.memory_in_use,
                r.total_memory,
                r.name AS report_name,
                r.report_date
            FROM clients c
            JOIN reports r ON c.id = r.client_id
            ORDER BY r.report_date DESC;
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener el reporte combinado:", error);
        res.status(500).send("Error al obtener el reporte combinado");
    }
};

export const getReportByClientId = async (req, res) => {
    try {
        const { id } = req.params; // Captura el ID desde la URL

        const result = await pool.query(`
            SELECT 
                c.id AS client_id,
                c.ip,
                c.status,
                c.mac,
                r.id AS report_id,
                r.memory_in_use,
                r.total_memory,
                r.name AS report_name,
                r.report_date
            FROM clients c
            JOIN reports r ON c.id = r.client_id
            WHERE c.id = $1
            ORDER BY r.report_date DESC;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("No se encontraron reportes para este cliente.");
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener el reporte combinado por ID:", error);
        res.status(500).send("Error al obtener el reporte combinado por ID");
    }
};