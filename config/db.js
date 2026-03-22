const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('ERROR: MONGO_URI is not defined in .env');
            process.exit(1);
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.info('Tip: If using local MongoDB, make sure the service is running. If using Atlas, check your IP whitelist.');
        process.exit(1);
    }
};

module.exports = connectDB;
