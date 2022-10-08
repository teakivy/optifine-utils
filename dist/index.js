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
exports.getDownloadLink = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const url = 'https://optifine.net/adloadx?f='; // URL
const baseUrl = 'https://optifine.net/'; // Base URL
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
const getDownloadLink = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield AxiosInstance.get(url + fileName); // Get the HTML from the URL
            const $ = cheerio_1.default.load(data); // Load the HTML into Cheerio
            const downloadLink = $('#Download > a').attr('href'); // Get the download link from the HTML
            resolve(baseUrl + downloadLink); // Resolve the Promise with the download link
        }
        catch (error) {
            reject(error); // Reject the Promise with the error
        }
    }));
});
exports.getDownloadLink = getDownloadLink;
//# sourceMappingURL=index.js.map