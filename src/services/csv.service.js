import csv from "csv-parser";
import { Readable } from "stream";
import createCsvWriter from "csv-writer";

const parseCsvBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer.toString()).pipe(csv({ skipLines: 0 }))
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
};

const resultsToCsvBuffer = async (results = []) => {
  const csvStringifier = createCsvWriter.createObjectCsvStringifier({
    header: [
      { id: "name", title: "name" },
      { id: "role", title: "role" },
      { id: "company", title: "company" },
      { id: "industry", title: "industry" },
      { id: "location", title: "location" },
      { id: "intent", title: "intent" },
      { id: "score", title: "score" },
      { id: "reasoning", title: "reasoning" }
    ]
  });

  const header = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(results);
  return Buffer.from(header + body);
};

export default { parseCsvBuffer, resultsToCsvBuffer };
