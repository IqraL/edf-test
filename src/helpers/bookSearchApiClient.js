import { DOMParser } from "xmldom";

export const buildUrlsByAuthor = (authorName, limit, format) => {
  try {
    const baseUrl = [
      { url: `http://localhost:3000/`, type: "apiOne" },
      { url: `http://localhost:3001/`, type: "apiTwo" },
    ];

    const urls = baseUrl.map(({ url, type }) => {
      switch (type) {
        case "apiOne":
          return {
            url:
              url +
              `by-author?author=` +
              authorName +
              `&limit=${limit}&format=${format}`,
            apiType: type,
          };
        case "apiTwo":
          return {
            url:
              url +
              `by-author?author=` +
              authorName +
              `&limit=${limit}&format=${format}`,
            apiType: type,
          };
      }
    });

    return urls;
  } catch (error) {
    console.log("error creating urls for byAuthor");
    return [];
  }
};

export const validateResponse = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

export const parseResponse = async (response, format) => {
  if (format === "json") {
    return response.json();
  } else if (format === "xml") {
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "application/xml");
  }
};

export const transformData = (data, format, apiType) => {
  switch (apiType) {
    case "apiOne":
      if (format === "json") {
        return data.map((item) => ({
          title: item.title,
          author: item.author,
          isbn: item.isbn,
          quantity: item.quantity,
          price: item.price,
        }));
      } else if (format === "xml") {
        return Array.from(data.getElementsByTagName("book")).map((item) => ({
          title: item.getElementsByTagName("title")[0]?.textContent || "",
          author: item.getElementsByTagName("author")[0]?.textContent || "",
          isbn: item.getElementsByTagName("isbn")[0]?.textContent || "",
          quantity: item.getElementsByTagName("quantity")[0]?.textContent || "",
          price: item.getElementsByTagName("price")[0]?.textContent || "",
        }));
      }
    case "apiTwo":
      if (format === "json") {
        return data.map((item) => ({
          title: item.title,
          author: item.author,
          isbn: item.isbn,
          quantity: item.quantity,
          price: item.price,
        }));
      } else if (format === "xml") {
        return Array.from(data.getElementsByTagName("book")).map((item) => ({
          title: item.getElementsByTagName("title")[0]?.textContent || "",
          author: item.getElementsByTagName("author")[0]?.textContent || "",
          isbn: item.getElementsByTagName("isbn")[0]?.textContent || "",
          quantity: item.getElementsByTagName("quantity")[0]?.textContent || "",
          price: item.getElementsByTagName("price")[0]?.textContent || "",
        }));
      }
  }
};

export const add = (a, b) => a + b;
