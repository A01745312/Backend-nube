
// MODIFICARLO PARA QUE SEA EN DYNAMO

"use strict";

import { Model } from "sequelize";

interface RecaudacionAttributes {
    id: number;
    nombre: string;
    correo: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Recaudacion
        extends Model<RecaudacionAttributes>
        implements RecaudacionAttributes
    {
        id!: number;
        nombre!: string;
        correo!: string;
        static associate(models: any) {
            // define association here
            Recaudacion.belongsTo(models.User, {
                foreignKey: "userId",
            });
        }
    }
    Recaudacion.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            correo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Recaudacion",
        }
    );
    return Recaudacion;
};
