import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URI, __prod__, MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD } from './../config/index';

const connection = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: MONGO_INITDB_DATABASE,
            ...(__prod__  
                ? {
                    auth: {
                        username: MONGO_INITDB_ROOT_USERNAME,
                        password: MONGO_INITDB_ROOT_PASSWORD
                    }
                  }  
                : {}
               )
        } as ConnectOptions);
        console.log('Database connected');
        
    } catch (error) {
        console.log('Database connection error', error);
        throw new Error('Database connection error');
    }
};

export default connection;