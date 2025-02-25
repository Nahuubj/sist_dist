import { DataTypes } from 'sequelize';

export const createLabelModel = async(sequelize) => {
    const Label = sequelize.define('Label', {
        label_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cliente: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        link: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Company', 
                key: 'company_id'
            }
        }
    }, {
        tableName: 'Label',
        timestamps: false
    });

    return Label;
};
