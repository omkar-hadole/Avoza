import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import products from './data/products.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await mongoose.connection.dropDatabase(); // Reset db
        
        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@avoza.com',
                password: 'password123',
                isAdmin: true
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            }
        ]);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map(product => {
            return { ...product }
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
