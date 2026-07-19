const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const XLSX = require('xlsx');

// 1. Check TEST_DATA_FILE environment variable
const testDataFile = process.env.TEST_DATA_FILE;
if (!testDataFile) {
  console.error("Error: TEST_DATA_FILE environment variable is not defined.");
  process.exit(1);
}

const absoluteWorkbookPath = path.resolve(testDataFile);
if (!fs.existsSync(absoluteWorkbookPath)) {
  console.error(`Error: Workbook not found at path: ${absoluteWorkbookPath}`);
  process.exit(1);
}

// 2. Read Excel Workbook worksheets & populated rows
let workbook;
try {
  workbook = XLSX.readFile(absoluteWorkbookPath);
} catch (err) {
  console.error(`Error: Failed to read workbook at ${absoluteWorkbookPath}.`, err);
  process.exit(1);
}

const worksheetRequirements = {
  'AddItem': ['Item Name', 'Master SKU', 'SKU', 'HSN Code', 'UoM', 'Tax Percentage', 'Expiry Days', 'Batch Code Prefix', 'Item Type'],
  'Barcode': ['Search SKU', 'Barcode Format'],
  'BatchDetails': ['Search Item', 'Item Type'],
  'DeliveryChallan': ['From Warehouse', 'To Warehouse', 'SKU', 'Quantity'],
  'EditItem': ['Reorder Level', 'Unit Price'],
  'FormValidations': ['Duplicate SKU', 'Duplicate Item Name', 'Duplicate Master SKU', 'Duplicate Item Type', 'Reduce Location', 'Reduce SKU', 'Reduce Quantity'],
  'InventoryReport': ['Search Keyword', 'Non Existent Keyword', 'Filter Item Type'],
  'Settings': ['Notification Email'],
  'StockUpdate': ['Add Location', 'Add SKU', 'Add Quantity', 'Reduce Location', 'Reduce SKU', 'Reduce Quantity']
};

const featureMapping = {
  'AccessNavigation.spec.ts': 'Access & Navigation',
  'AddItem.spec.ts': 'Add Item',
  'Barcode.spec.ts': 'Barcode',
  'BatchDetails.spec.ts': 'Batch Details',
  'DeleteItem.spec.ts': 'Delete Item',
  'DeliveryChallan.spec.ts': 'Delivery Challan',
  'DuplicateItem.spec.ts': 'Duplicate Item',
  'EditItem.spec.ts': 'Edit Item',
  'FormValidations.spec.ts': 'Form Validations',
  'InventoryReport.spec.ts': 'Inventory Report',
  'InventoryStockReport.spec.ts': 'Inventory Stock Report',
  'NearerReorderLevelReport.spec.ts': 'Nearer Reorder Level Report',
  'Permissions.spec.ts': 'Permissions',
  'ReorderLevelReport.spec.ts': 'Reorder Level Report',
  'Settings.spec.ts': 'Settings',
  'StockUpdate.spec.ts': 'Stock Update'
};

const worksheetsInfo = {};
for (const [sheetName, requiredColumns] of Object.entries(worksheetRequirements)) {
  const ws = workbook.Sheets[sheetName];
  if (!ws) {
    worksheetsInfo[sheetName] = { rows: [], skipped: true, reason: 'Worksheet not found' };
    continue;
  }
  const ref = ws['!ref'];
  if (!ref) {
    worksheetsInfo[sheetName] = { rows: [], skipped: true, reason: 'Worksheet is empty' };
    continue;
  }

  const range = XLSX.utils.decode_range(ref);
  const headers = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    const cell = ws[cellRef];
    headers.push(cell && cell.v !== undefined ? String(cell.v).trim() : '');
  }

  const rawRows = XLSX.utils.sheet_to_json(ws, { defval: "" });
  const validRows = [];
  for (const rawRow of rawRows) {
    const isRowEmpty = Object.values(rawRow).every(val => val === undefined || val === null || String(val).trim() === "");
    if (!isRowEmpty) {
      const cleanRow = {};
      for (const header of headers) {
        if (header !== "") {
          const val = rawRow[header];
          cleanRow[header] = val !== undefined && val !== null ? String(val).trim() : "";
        }
      }
      validRows.push(cleanRow);
    }
  }

  worksheetsInfo[sheetName] = {
    rows: validRows,
    skipped: validRows.length === 0,
    reason: validRows.length === 0 ? 'No populated rows' : null
  };
}

// 3. Generate Timestamped Execution Folder name
const pad = (num) => String(num).padStart(2, '0');
const now = new Date();
const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const hours = pad(now.getHours());
const minutes = pad(now.getMinutes());
const seconds = pad(now.getSeconds());
const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

console.log(`Starting Playwright test run. Timestamp folder will be created under test-results/`);

// 4. Execute Playwright Tests with JSON Reporter
const execResult = spawnSync('node', ['node_modules/@playwright/test/cli.js', 'test', 'generated-tests', '--reporter=json'], {
  maxBuffer: 100 * 1024 * 1024,
  env: { ...process.env }
});

const resultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}
const execDir = path.join(resultsDir, timestamp);
fs.mkdirSync(execDir, { recursive: true });

const stdoutStr = execResult.stdout ? execResult.stdout.toString('utf8') : '';
const stderrStr = execResult.stderr ? execResult.stderr.toString('utf8') : '';

let reportData;
let parseError = null;

try {
  const jsonStart = stdoutStr.indexOf('{');
  const jsonEnd = stdoutStr.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON report found in Playwright stdout.");
  }
  const jsonStr = stdoutStr.substring(jsonStart, jsonEnd + 1);
  reportData = JSON.parse(jsonStr);
} catch (err) {
  parseError = err.message;
  console.error("Warning: Playwright did not generate a parseable JSON report. Using raw command output.");
}

// Collect specs from reportData
const specsByFile = {};
function traverseSuite(suite, currentFile = '') {
  const file = suite.file || currentFile;
  if (suite.specs) {
    for (const spec of suite.specs) {
      const specFile = spec.file || file;
      const normalizedPath = path.normalize(specFile).replace(/\\/g, '/');
      const basename = path.basename(normalizedPath);
      if (!specsByFile[basename]) {
        specsByFile[basename] = [];
      }
      specsByFile[basename].push(spec);
    }
  }
  if (suite.suites) {
    for (const subSuite of suite.suites) {
      traverseSuite(subSuite, file);
    }
  }
}

if (reportData && reportData.suites) {
  for (const rootSuite of reportData.suites) {
    traverseSuite(rootSuite);
  }
}

// Map files to worksheet names
const specWorksheetMapping = {
  'AddItem.spec.ts': 'AddItem',
  'Barcode.spec.ts': 'Barcode',
  'BatchDetails.spec.ts': 'BatchDetails',
  'DeliveryChallan.spec.ts': 'DeliveryChallan',
  'EditItem.spec.ts': 'EditItem',
  'FormValidations.spec.ts': 'FormValidations',
  'InventoryReport.spec.ts': 'InventoryReport',
  'Settings.spec.ts': 'Settings',
  'StockUpdate.spec.ts': 'StockUpdate'
};

const allSpecFiles = Object.keys(featureMapping);
const executionSummary = {
  dateStr: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
  workbookUsed: absoluteWorkbookPath,
  totalSpecs: allSpecFiles.length,
  totalDatasets: 0,
  totalTests: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  totalDurationMs: 0,
  featureSummaries: [],
  failedTests: []
};

// Generate reports for every spec file
for (const specFile of allSpecFiles) {
  const featureName = featureMapping[specFile];
  const sheetName = specWorksheetMapping[specFile];
  const sheetInfo = sheetName ? worksheetsInfo[sheetName] : null;

  const specs = specsByFile[specFile] || [];
  let fileTests = 0;
  let filePassed = 0;
  let fileFailed = 0;
  let fileSkipped = 0;
  let fileDurationMs = 0;

  // Track dataset details
  const datasetSummaries = [];
  const datasetsCount = sheetInfo ? sheetInfo.rows.length : 0;
  executionSummary.totalDatasets += datasetsCount;

  if (sheetInfo && sheetInfo.skipped) {
    // If workbook sheet is empty/skipped
    fileSkipped = 0; // No tests generated
  } else {
    // Traverse results of tests in this file
    for (const spec of specs) {
      const res = spec.tests[0]?.results[0];
      const duration = res?.duration || 0;
      fileDurationMs += duration;
      fileTests++;

      const status = res?.status || 'skipped';
      if (status === 'passed') {
        filePassed++;
      } else if (status === 'failed' || status === 'timedOut') {
        fileFailed++;
      } else {
        fileSkipped++;
      }
    }
  }

  executionSummary.totalTests += fileTests;
  executionSummary.passed += filePassed;
  executionSummary.failed += fileFailed;
  executionSummary.skipped += fileSkipped;
  executionSummary.totalDurationMs += fileDurationMs;

  // Compile Dataset Execution Summary
  if (sheetInfo && sheetInfo.rows.length > 0) {
    sheetInfo.rows.forEach((row, rowIndex) => {
      const rowNum = rowIndex + 1;
      const rowSuffix = `Row ${rowNum}`;

      // Filter input values to omit sensitive keys
      const safeInputsObj = {};
      for (const [k, v] of Object.entries(row)) {
        if (!k.toLowerCase().includes('password') && !k.toLowerCase().includes('secret') && !k.toLowerCase().includes('token')) {
          safeInputsObj[k] = v;
        }
      }
      const inputsStr = Object.entries(safeInputsObj).map(([k, v]) => `**${k}**: ${v}`).join(', ');

      // Find tests associated with this row dataset
      const rowSpecs = specs.filter(spec => spec.title.includes(`Row ${rowNum}`));
      let datasetStatus = 'Passed';
      let rowFailures = [];

      if (rowSpecs.length === 0) {
        datasetStatus = 'Skipped';
      } else {
        for (const spec of rowSpecs) {
          const res = spec.tests[0]?.results[0];
          const status = res?.status || 'skipped';
          if (status === 'failed' || status === 'timedOut') {
            datasetStatus = 'Failed';
            let errorMsg = '';
            if (res.error) {
              errorMsg = res.error.message || res.error.stack || String(res.error);
            } else if (res.errors && res.errors.length > 0) {
              errorMsg = res.errors.map(e => e.message || e.stack).join('\n');
            }
            rowFailures.push(`${spec.title.split(' - Row')[0]}: ${errorMsg.trim()}`);
            
            // Add to overall failed tests list
            executionSummary.failedTests.push({
              feature: featureName,
              rowNumber: rowNum,
              reason: errorMsg.trim()
            });
          }
        }
      }

      datasetSummaries.push({
        rowNum,
        inputsStr,
        status: datasetStatus,
        failures: rowFailures.length > 0 ? rowFailures.join('; ') : null
      });
    });
  } else if (!sheetInfo) {
    // For static files without worksheets, compile failures to failedTests list
    for (const spec of specs) {
      const res = spec.tests[0]?.results[0];
      const status = res?.status || 'skipped';
      if (status === 'failed' || status === 'timedOut') {
        let errorMsg = '';
        if (res.error) {
          errorMsg = res.error.message || res.error.stack || String(res.error);
        } else if (res.errors && res.errors.length > 0) {
          errorMsg = res.errors.map(e => e.message || e.stack).join('\n');
        }
        executionSummary.failedTests.push({
          feature: featureName,
          rowNumber: 'Static',
          reason: errorMsg.trim()
        });
      }
    }
  }

  // Create Spec Result Report
  const resultFileName = `${specFile.replace('.spec.ts', '')}-result.md`;
  const reportPath = path.join(execDir, resultFileName);

  let datasetSummaryMd = '';
  if (sheetInfo && sheetInfo.rows.length > 0) {
    datasetSummaryMd = datasetSummaries.map(ds => {
      return `### Dataset Row ${ds.rowNum}
- **Row Number:** Row ${ds.rowNum}
- **Input Values:** ${ds.inputsStr}
- **Execution Status:** ${ds.status === 'Passed' ? '🟢 Passed' : ds.status === 'Failed' ? '🔴 Failed' : '⚪ Skipped'}
${ds.failures ? `- **Failure Reason:** ${ds.failures}` : ''}
`;
    }).join('\n');
  } else if (sheetInfo && sheetInfo.skipped) {
    datasetSummaryMd = `*Skipped: Worksheet "${sheetName}" has no populated rows.*`;
  } else {
    datasetSummaryMd = `*No dataset input required for this feature. Executed static verification tests.*`;
  }

  const overallPassed = fileFailed === 0 && fileTests > 0;
  const remarksText = fileFailed > 0 ? `Failed ${fileFailed} verification tests.` : fileTests === 0 ? 'No tests executed.' : 'All tests passed successfully.';

  const specReportContent = `# ${featureName} - Automation Execution Report

## Execution Date & Time
${executionSummary.dateStr}

## Automation File
\`generated-tests/${specFile}\`

## Excel Workbook Used
\`${absoluteWorkbookPath}\`

## Worksheet Name
\`${sheetName || 'N/A'}\`

## Total Datasets Executed
${datasetsCount}

## Total Tests Executed
${fileTests}

## Passed
${filePassed}

## Failed
${fileFailed}

## Skipped
${fileSkipped}

## Execution Time
${(fileDurationMs / 1000).toFixed(2)}s

## Dataset Execution Summary
${datasetSummaryMd}

## Overall Summary
The automation suite for the **${featureName}** feature completed with **${filePassed}/${fileTests}** test runs passing.

## Remarks
${remarksText}
`;

  fs.writeFileSync(reportPath, specReportContent, 'utf8');
  console.log(`Generated report: test-results/${timestamp}/${resultFileName}`);

  executionSummary.featureSummaries.push({
    feature: featureName,
    specFile,
    datasetsExecuted: datasetsCount,
    passed: filePassed,
    failed: fileFailed,
    reportFilename: resultFileName
  });
}

// 5. Generate Overall ExecutionSummary.md
const overallPassPercent = executionSummary.totalTests > 0
  ? ((executionSummary.passed / executionSummary.totalTests) * 100).toFixed(2) + '%'
  : '0.00%';

let skippedWorksheetsMd = '';
const skippedWorksheets = Object.entries(worksheetsInfo)
  .filter(([_, info]) => info.skipped)
  .map(([sheetName, info]) => `\n- **${sheetName}**: Skipped (${info.reason})`);
if (skippedWorksheets.length > 0) {
  skippedWorksheetsMd = `\n## Skipped Worksheets\n${skippedWorksheets.join('')}\n`;
}

let errorSectionMd = '';
if (parseError) {
  errorSectionMd = `\n## Playwright Execution Errors / Logs\nPlaywright failed to complete all tests cleanly or crashed. Detail:\n\`\`\`\n${parseError}\n\`\`\`\n`;
} else if (reportData && reportData.errors && reportData.errors.length > 0) {
  const errorsStr = reportData.errors.map(e => e.message || String(e)).join('\n');
  errorSectionMd = `\n## Playwright Execution Errors / Logs\nPlaywright reported the following errors during execution:\n\`\`\`\n${errorsStr}\n\`\`\`\n`;
}

// Feature-wise table
const tableRows = executionSummary.featureSummaries.map(fs => {
  return `| ${fs.feature} | [${fs.specFile}](../${fs.specFile}) | ${fs.datasetsExecuted} | ${fs.passed} | ${fs.failed} | [${fs.reportFilename}](./${fs.reportFilename}) |`;
}).join('\n');

// Failed tests list
let failedTestsListMd = 'No failures encountered.';
if (executionSummary.failedTests.length > 0) {
  failedTestsListMd = executionSummary.failedTests.map((ft, index) => {
    return `${index + 1}. **Feature:** ${ft.feature} | **Dataset Row:** ${ft.rowNumber} | **Failure Reason:** ${ft.reason}`;
  }).join('\n');
}

const overallSummaryContent = `# Overall Automation Execution Summary

## Execution Date & Time
${executionSummary.dateStr}

## Excel Workbook Used
\`${executionSummary.workbookUsed}\`

## Total Playwright Spec Files Executed
${executionSummary.totalSpecs}

## Total Datasets Executed
${executionSummary.totalDatasets}

## Total Tests Executed
${executionSummary.totalTests}

## Passed
${executionSummary.passed}

## Failed
${executionSummary.failed}

## Skipped
${executionSummary.skipped}

## Overall Pass Percentage
${overallPassPercent}

## Total Execution Time
${(executionSummary.totalDurationMs / 1000).toFixed(2)}s
${skippedWorksheetsMd}${errorSectionMd}
## Feature-wise Summary

| Feature | Spec File | Datasets Executed | Passed | Failed | Report Filename |
| :--- | :--- | :--- | :--- | :--- | :--- |
${tableRows}

## Failed Tests Details

${failedTestsListMd}
`;

const summaryPath = path.join(execDir, 'ExecutionSummary.md');
fs.writeFileSync(summaryPath, overallSummaryContent, 'utf8');
console.log(`Generated overall summary: test-results/${timestamp}/ExecutionSummary.md`);

console.log("All execution reports successfully generated.");
