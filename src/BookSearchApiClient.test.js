import fetchMock from "jest-fetch-mock";

import { BookSearchApiClient } from "./BookSearchApiClient.js";
import {
  buildUrlsByAuthor,
  validateResponse,
  parseResponse,
  transformData,
} from "./helpers/bookSearchApiClient.js";

fetchMock.enableMocks();

jest.mock("./helpers/bookSearchApiClient.js");

describe("BookSearchApiClient", () => {
  beforeEach(() => {
    fetch.resetMocks(); 
    jest.clearAllMocks();
  });

  describe("getBooksByAuthor", () => {
    it("should return transformed data when API responses are valid", async () => {
      const client = new BookSearchApiClient("json");

      const mockUrls = [
        { url: "http://mock-api-1.com", apiType: "seller1" },
        { url: "http://mock-api-2.com", apiType: "seller2" },
      ];

      const mockResponse1 = [{ title: "Book 1", author: "Author 1" }];
      const mockResponse2 = [{ title: "Book 2", author: "Author 2" }];

      const transformedData1 = [
        { title: "Book 1", author: "Author 1", apiType: "seller1" },
      ];
      const transformedData2 = [
        { title: "Book 2", author: "Author 2", apiType: "seller2" },
      ];

      buildUrlsByAuthor.mockReturnValue(mockUrls);
      validateResponse.mockImplementation(() => {});
      parseResponse
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2); 
      transformData
        .mockReturnValueOnce(transformedData1)
        .mockReturnValueOnce(transformedData2);

      fetch
        .mockResponseOnce(JSON.stringify(mockResponse1))
        .mockResponseOnce(JSON.stringify(mockResponse2));

      const result = await client.getBooksByAuthor("Author Name", 10);

      expect(buildUrlsByAuthor).toHaveBeenCalledWith("Author Name", 10, "json");
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(validateResponse).toHaveBeenCalledTimes(2);
      expect(parseResponse).toHaveBeenCalledTimes(2);
      expect(transformData).toHaveBeenCalledTimes(2);

      expect(result).toEqual([...transformedData1, ...transformedData2]);
    });

    it("should throw an error when fetch fails", async () => {
      const client = new BookSearchApiClient("json");
      const mockUrls = [{ url: "http://mock-api-1.com", apiType: "seller1" }];

      buildUrlsByAuthor.mockReturnValue(mockUrls);
      fetch.mockReject(new Error("Network error"));

      await expect(client.getBooksByAuthor("Author Name", 10)).rejects.toThrow(
        "Network error"
      );

      expect(buildUrlsByAuthor).toHaveBeenCalledWith("Author Name", 10, "json");
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should throw an error for unsupported format", () => {

        expect(() => new BookSearchApiClient("unsupported")).toThrow(
        "Unsupported format. Please use 'json' or 'xml'."
      );
    });
  });
});
