import { Router } from "express";
import { getClient, getClientByID, insertClient, putClient } from "../controllers/client.controllers.js";
import { getReports, insertReport } from "../controllers/diskreports.controllers.js";
import { getCombinedReport, getReportByClientId } from "../controllers/reports.controllers.js";

const router = Router();

router.get('/client', getClient)
router.get('/client/:id', getClientByID)

router.put('/client/:id',putClient)
router.post("/client", insertClient)

router.get('/disk', getReports)
router.post('/disk', insertReport)

router.get('/report', getCombinedReport)
router.get('/report/:id', getReportByClientId)

export default router;