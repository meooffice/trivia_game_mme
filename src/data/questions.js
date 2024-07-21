const API_KEY = 'AIzaSyCfYEKllQewfCov9YO42asj0iYdHkY7lNg'; // Replace with your API Key
const SHEET_ID = '1IMrBbDoEet-tPt0ZEioGMan8Curz9Ib2Cdxc8MnwiwY'; // Replace with your Google Sheet ID
const RANGE = 'Sheet1!A2:G'; // Adjust if your sheet's range is different

export async function fetchQuestions() {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
    return data.values.map(row => ({
      id: parseInt(row[0], 10),
      question: row[1],
      answers: [
        { text: row[2], correct: row[6] === 'A' },
        { text: row[3], correct: row[6] === 'B' },
        { text: row[4], correct: row[6] === 'C' },
        { text: row[5], correct: row[6] === 'D' }
      ]
    }));
  } catch (error) {
    console.error('Fetching questions failed:', error);
    return [];
  }
}
