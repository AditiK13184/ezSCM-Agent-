import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

export interface TestDataRow {
  [key: string]: string;
}

/**
 * Reads test data from the Excel workbook specified in the TEST_DATA_FILE environment variable.
 * 
 * @param sheetName The name of the worksheet to read.
 * @param requiredColumns List of columns that must be present in the sheet.
 * @returns Array of objects representing the rows in the worksheet.
 */
export function getTestData(sheetName: string, requiredColumns: string[]): TestDataRow[] {
  const filePath = process.env.TEST_DATA_FILE;
  if (!filePath) {
    throw new Error(`TEST_DATA_FILE environment variable is not defined.`);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Test data file not found at path: ${absolutePath}`);
  }

  const workbook = XLSX.readFile(absolutePath);
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Worksheet "${sheetName}" not found in workbook: ${absolutePath}`);
  }

  // Decode range to read headers
  const ref = worksheet['!ref'];
  if (!ref) {
    // Worksheet is empty
    return [];
  }

  const range = XLSX.utils.decode_range(ref);
  const headers: string[] = [];

  // Read header row (range.s.r)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    const cell = worksheet[cellRef];
    // Normalize header names to trimmed strings
    const headerVal = cell && cell.v !== undefined ? String(cell.v).trim() : '';
    headers.push(headerVal);
  }

  // Validate required columns
  const missingColumns = requiredColumns.filter(reqCol => !headers.includes(reqCol));
  if (missingColumns.length > 0) {
    throw new Error(
      `Missing required column(s): [${missingColumns.join(', ')}] in worksheet "${sheetName}" of file: ${absolutePath}`
    );
  }

  // Convert sheet to JSON array of objects
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as any[];

  const validRows: TestDataRow[] = [];

  for (const rawRow of rawRows) {
    // Check if the row is completely empty (i.e. all cell values are empty strings/whitespace)
    const isRowEmpty = Object.values(rawRow).every(val => {
      return val === undefined || val === null || String(val).trim() === "";
    });

    if (!isRowEmpty) {
      // Map and clean row values, converting everything to trimmed string
      const cleanRow: TestDataRow = {};
      for (const header of headers) {
        if (header !== "") {
          const val = rawRow[header];
          cleanRow[header] = val !== undefined && val !== null ? String(val).trim() : "";
        }
      }
      validRows.push(cleanRow);
    }
  }

  return validRows;
}
