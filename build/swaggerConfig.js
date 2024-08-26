"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpecs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const option = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentation Itirena Backend",
            version: "1.0.0",
            description: "Documentation to follow when making requests to itirena's backend",
        },
        servers: [{ url: `${process.env.BaseUrl}` }],
        tags: [
            {
                name: "Account",
                description: "All operations relating to account",
            },
        ],
    },
    apis: [path_1.default.resolve(__dirname, `./routes/**/*.js`)],
};
exports.swaggerSpecs = (0, swagger_jsdoc_1.default)(option);
