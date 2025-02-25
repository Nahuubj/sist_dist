import express from 'express';
import { getAllEmp, insertCompany } from '../Controllers/companyController.js'; 
import { getAllLabels } from '../Controllers/labelController.js'; 

const router = express.Router();


router.get('/company', getAllEmp);
router.get('/label', getAllLabels);

router.post('/company', insertCompany); 

export default router;
