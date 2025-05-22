require('dotenv').config();
const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        logger.error('MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 