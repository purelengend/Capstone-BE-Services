import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URI } from '../config';

const connection = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log('Database connected');
        
    } catch (error) {
        console.log('Database connection error', error);
        throw new Error('Database connection error');
    }
};

export default connection;