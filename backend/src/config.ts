// backend/src/config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const getConfig = () => {
    return {
        TEST_VAR: process.env.TEST_VAR
    };
};