import { CompanyModel } from '../postgres/postgres.js';  

export const getAllEmp = async (req, res) => {
  try {
    const companies = await CompanyModel.findAll();

    if (companies.length === 0) {
      return res.status(404).json({ error: 'No companies found' });
    }

    return res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const insertCompany = async (req, res) => {
  try {
    const { name, address, phone } = req.body; 

 
    if (!name || !address || !phone) {
      return res.status(400).json({ error: 'All fields (name, address, phone) are required' });
    }


    const phonePattern = /^[0-9]{10}$/; 
    if (!phonePattern.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }


    const existingCompany = await CompanyModel.findOne({ where: { phone } });
    if (existingCompany) {
      return res.status(409).json({ error: 'Company with this phone number already exists' });
    }

    const newCompany = await CompanyModel.create({
      name,
      address,
      phone
    });

    return res.status(201).json(newCompany); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
