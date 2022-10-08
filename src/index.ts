import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://optifine.net/adloadx?f='; // URL
const baseUrl = 'https://optifine.net/'; // Base URL

const AxiosInstance = axios.create(); // Create a new Axios Instance

export const getDownloadLink = async (fileName: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await AxiosInstance.get(url + fileName); // Get the HTML from the URL
            const $ = cheerio.load(data); // Load the HTML into Cheerio
            const downloadLink = $('#Download > a').attr('href'); // Get the download link from the HTML
            resolve(baseUrl + downloadLink); // Resolve the Promise with the download link
        } catch (error) {
            reject(error); // Reject the Promise with the error
        }
    });
};
