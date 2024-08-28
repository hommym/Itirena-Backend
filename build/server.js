"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = require("./libs/mongoose");
const authRoutes_1 = require("./routes/auth/authRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = require("./swaggerConfig");
const logger_1 = require("./components/logger");
const courseDataRoutes_1 = require("./routes/courseData/courseDataRoutes");
const app = (0, express_1.default)();
// setting up swagger-ui
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.swaggerSpecs));
// middlewares
app.use(express_1.default.json());
// routes
app.use("/api/v1/auth/", authRoutes_1.authRouter);
app.use("/api/v1/course-data/", courseDataRoutes_1.courseDataRouter);
// error handling middlware
app.use(errorHandler_1.errorHandler);
const port = process.env.PORT ? process.env.PORT : 8000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectToDatabase)(process.env.MongoDbConnectionUrl);
        app.listen(port, () => {
            console.log(`Server  is listening on ${port} `);
            (0, logger_1.loger)(swaggerConfig_1.swaggerSpecs);
        });
    }
    catch (error) {
        console.log(`ServerStartUpError:${error}`);
    }
});
startServer();
