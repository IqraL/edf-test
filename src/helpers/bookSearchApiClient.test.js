import { DOMParser } from "@xmldom/xmldom";
import { buildUrlsByAuthor, transformData } from "./bookSearchApiClient.js";

describe("buildUrlsByAuthor", () => {
  it("should return correct URLs for valid inputs", () => {
    const authorName = "John";
    const limit = 10;
    const format = "json";

    const result = buildUrlsByAuthor(authorName, limit, format);

    expect(result).toEqual([
      {
        url: "http://localhost:3000/by-author?author=John&limit=10&format=json",
        apiType: "apiOne",
      },
      {
        url: "http://localhost:3001/by-author?author=John&limit=10&format=json",
        apiType: "apiTwo",
      },
    ]);
  });

  it("should handle unexpected inputs like null or undefined", () => {
    const authorName = null;
    const limit = undefined;
    const format = "json";

    const result = buildUrlsByAuthor(authorName, limit, format);

    expect(result).toEqual([
      {
        url: "http://localhost:3000/by-author?author=null&limit=undefined&format=json",
        apiType: "apiOne",
      },
      {
        url: "http://localhost:3001/by-author?author=null&limit=undefined&format=json",
        apiType: "apiTwo",
      },
    ]);
  });
});

describe("transformData", () => {
  describe("apiOne transformations", () => {
    it("should correctly transform JSON data", () => {
      const apiType = "apiOne";
      const format = "json";
      const jsonData = [
        {
          title: "Book 1",
          author: "Author 1",
          isbn: "12345",
          quantity: 5,
          price: 10.99,
        },
        {
          title: "Book 2",
          author: "Author 2",
          isbn: "67890",
          quantity: 2,
          price: 15.49,
        },
      ];

      const result = transformData(jsonData, format, apiType);

      expect(result).toEqual([
        {
          title: "Book 1",
          author: "Author 1",
          isbn: "12345",
          quantity: 5,
          price: 10.99,
        },
        {
          title: "Book 2",
          author: "Author 2",
          isbn: "67890",
          quantity: 2,
          price: 15.49,
        },
      ]);
    });

    it("should correctly transform XML data", () => {
      const apiType = "apiOne";
      const format = "xml";

      const xmlData = new DOMParser().parseFromString(
        `
        <books>
          <book>
            <title>Book 1</title>
            <author>Author 1</author>
            <isbn>12345</isbn>
            <quantity>5</quantity>
            <price>10.99</price>
          </book>
          <book>
            <title>Book 2</title>
            <author>Author 2</author>
            <isbn>67890</isbn>
            <quantity>2</quantity>
            <price>15.49</price>
          </book>
        </books>
        `,
        "application/xml"
      );

      const result = transformData(xmlData, format, apiType);

      expect(result).toEqual([
        {
          title: "Book 1",
          author: "Author 1",
          isbn: "12345",
          quantity: "5",
          price: "10.99",
        },
        {
          title: "Book 2",
          author: "Author 2",
          isbn: "67890",
          quantity: "2",
          price: "15.49",
        },
      ]);
    });
  });
});
