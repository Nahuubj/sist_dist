import { DataTypes } from 'sequelize';

export const createCompanyModel = (sequelize) => {  
    const Company = sequelize.define('Company', {
        company_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'Company',
        timestamps: false
    });

    return Company;
};
