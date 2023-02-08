require('dotenv').config();

export const PORT= process.env.PORT || 3003;
export const __prod__ = process.env.NODE_ENV === 'production';
export const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE;
export const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
export const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
export const MONGO_URI= process.env.MONGO_URI || 'mongodb://localhost:27017/express-ts-api';
export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL || 'amqp://localhost';
export const EXCHANGE_NAME='CAPSTONE_EXCHANGE';
export const REVIEW_SERVICE='REVIEW_SERVICE';
export const PRODUCT_SERVICE='PRODUCT_SERVICE';
export const SHOPPING_SERVICE='SHOPPING_SERVICE';
export const INVENTORY_RPC='INVENTORY_RPC';
export const USER_RPC = 'USER_RPC';