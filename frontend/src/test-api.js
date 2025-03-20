// Simple script to test API connectivity
// Run with Node.js: node test-api.js

const https = require('https');
const http = require('http');

const url = 'http://localhost:8080/api/categories';

console.log(`Testing connection to: ${url}`);

http.get(url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  console.log(`Status Code: ${statusCode}`);
  console.log(`Content-Type: ${contentType}`);

  let error;
  // Any 2xx status code signals a successful response
  if (statusCode < 200 || statusCode >= 300) {
    error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
  }
  
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { 
    rawData += chunk; 
    console.log(`Received chunk of size: ${chunk.length} bytes`);
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log('Data successfully received and parsed:');
      console.log(parsedData);
    } catch (e) {
      console.error(`Error parsing JSON: ${e.message}`);
      console.log('Raw data received:');
      console.log(rawData.substring(0, 1000) + '...'); // Show first 1000 chars
    }
  });
}).on('error', (e) => {
  console.error(`HTTP request error: ${e.message}`);
}); 