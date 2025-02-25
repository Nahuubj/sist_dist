import { Sequelize } from 'sequelize';
import { createCompanyModel } from '../Models/company.model.js';
import { createLabelModel } from '../Models/label.model.js';  // Importar correctamente el modelo de Label

const sequelize = new Sequelize('DB1', 'postgres', 'hola123.', {
  host: 'localhost',
  dialect: 'postgres',
});

let CompanyModel = null;
let LabelModel = null;
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    CompanyModel = createCompanyModel(sequelize);  
    LabelModel = await createLabelModel(sequelize);

    await sequelize.sync();
    console.log('Database Synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connection, CompanyModel,LabelModel };
