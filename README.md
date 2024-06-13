npm i
npm start

GET http://localhost:3001/transactions
POST http://localhost:3001/transactions
eg.
{
  "id": "5",
  "type": "expense",
  "value": 3000,
  "note": "Salary"
}
DELETE http://localhost:3001/transactions/{id}
