import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from "sequelize";

import { IPayment } from "../interfaces/payment.interface";
import sequelize from "../db";

class Payment
  extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>>
  implements IPayment {
  declare id: CreationOptional<number>;
  declare amount: number;
  declare currency: string;
  declare discount: CreationOptional<number>;
  declare course: "Intro" | "ATR";

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discount: {
      type: DataTypes.INTEGER
    },

    course: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: "payment",
    sequelize
  }
);

Payment.beforeCreate((payment) => {
  payment.amount = !payment.discount
    ? payment.amount
    : (payment.amount * payment.discount) / 100;
});

export default Payment;
