import express from 'express';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use(router);

    app.use(errorHandler);

    app.use(notFoundHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    app.use('/uploads', express.static(UPLOAD_DIR));
};
