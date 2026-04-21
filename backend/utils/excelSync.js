const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const EXCEL_DIR = path.join(__dirname, '../../excel_logs'); // Let's put logs in root or backend? Let's put them in root
// Wait, prompt says: "stored on the server using the exceljs library." So backend/logs or just root project directory.
// We'll put them in backend/logs
const LOGS_DIR = path.join(__dirname, '../logs');

// Ensure directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const getFilePath = (filename) => path.join(LOGS_DIR, filename);

const initializeSheet = async (filePath, sheetName, columns) => {
  const fileExists = fs.existsSync(filePath);
  let workbook = new ExcelJS.Workbook();
  let worksheet;

  if (fileExists) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      worksheet = workbook.addWorksheet(sheetName);
      worksheet.columns = columns;
    }
  } else {
    worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns;
  }
  
  await workbook.xlsx.writeFile(filePath);
};

const appendToSheet = async (fileName, sheetName, columns, rowData) => {
  const filePath = getFilePath(fileName);
  try {
    await initializeSheet(filePath, sheetName, columns);
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(sheetName);
    
    worksheet.addRow(rowData);
    await workbook.xlsx.writeFile(filePath);
    console.log(`Successfully appended to ${fileName}`);
  } catch (error) {
    console.error(`Error writing to ${fileName}: `, error);
  }
};

const logAuthActivity = async (studentName, prn, email, action = "Register/Login") => {
  const columns = [
    { header: 'Student Name', key: 'name', width: 25 },
    { header: 'PRN', key: 'prn', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Action', key: 'action', width: 20 },
    { header: 'Timestamp', key: 'timestamp', width: 25 }
  ];
  
  const rowData = {
    name: studentName,
    prn,
    email,
    action,
    timestamp: new Date().toISOString()
  };
  
  await appendToSheet('auth_logs.xlsx', 'Auth Logs', columns, rowData);
};

const logReview = async (courseName, rating, feedbackText) => {
  const columns = [
    { header: 'Course Name', key: 'courseCode', width: 20 },
    { header: 'Rating (out of 5)', key: 'rating', width: 15 },
    { header: 'Feedback Text', key: 'comment', width: 50 },
    { header: 'Timestamp', key: 'timestamp', width: 25 }
  ];
  
  const rowData = {
    courseCode: courseName,
    rating,
    comment: feedbackText,
    timestamp: new Date().toISOString()
  };
  
  await appendToSheet('review_logs.xlsx', 'Review Logs', columns, rowData);
};

const logSystemSuggestion = async (userId, suggestion) => {
  const columns = [
    { header: 'User ID', key: 'userId', width: 25 },
    { header: 'Suggestion/Query', key: 'suggestion', width: 50 },
    { header: 'Timestamp', key: 'timestamp', width: 25 }
  ];
  
  const rowData = {
    userId,
    suggestion,
    timestamp: new Date().toISOString()
  };
  
  await appendToSheet('system_logs.xlsx', 'System Logs', columns, rowData);
};

module.exports = {
  logAuthActivity,
  logReview,
  logSystemSuggestion
};
