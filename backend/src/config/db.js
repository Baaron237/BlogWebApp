import { Sequelize } from 'sequelize'
import dotenv from "dotenv";
import bcrypt from "bcryptjs";


dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME ,
  process.env.DB_USER ,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

import { User, Post, Comment, Theme } from '../models/index.js';

const dbConnection = async () => {
	try {
    
      await sequelize.authenticate();
    
      await sequelize.sync({force: true});

      // Hashing the password for the admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      // Creating the default admin user
      await User.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        isAdmin: true,
      });

      console.log('Connected to MySQL and admin created');

	  } catch (error) {
		  console.error('Error to connect to database', error);
	  }
}

export { dbConnection, sequelize }