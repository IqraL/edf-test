import {
  buildUrlsByAuthor,
  validateResponse,
  parseResponse,
  transformData,
} from "./helpers/bookSearchApiClient.js";

class BookSearchApiClient {
  constructor(format) {
    if (!["json", "xml"].includes(format)) {
      throw new Error("Unsupported format. Please use 'json' or 'xml'.");
    }
    this.format = format;
  }

  async getBooksByAuthor(authorName, limit) {
    const urls = buildUrlsByAuthor(authorName, limit, this.format);

    try {
      let allData = [];
      for await (const {url, apiType} of urls) {
        const response = await fetch(url);
        validateResponse(response);

        const data = await parseResponse(response, this.format);
        allData = [...allData, ...transformData(data, this.format, apiType)]; 
      }
      return allData;
    } catch (error) {
      console.error(`Error fetching books: ${error.message}`);
      throw error;
    }
  }

  async getBooksByPublisher(publisherName, limit){

  }
  async getBooksByYearPublished(yearPublished, limit){
    
  }
}

export { BookSearchApiClient };
