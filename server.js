const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finance-tracker-be20b-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();
const transactionsRef = db.ref('transactions');

app.post('/transactions', (req, res) => {
  const { id, type, value, note } = req.body;
  transactionsRef.child(id).set({ type, value, note })
    .then(() => res.status(201).send('Transaction added'))
    .catch(error => res.status(500).send(error));
});

app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  transactionsRef.child(id).remove()
    .then(() => res.send('Transaction deleted'))
    .catch(error => res.status(500).send(error));
});

app.get('/transactions', (req, res) => {
    transactionsRef.once('value')
      .then(snapshot => {
        const transactions = snapshot.val();
        const formattedTransactions = [];
        for (let key in transactions) {
          if (transactions[key] !== null) {
            formattedTransactions.push({ id: key, ...transactions[key] });
          }
        }
        res.send(formattedTransactions);
      })
      .catch(error => res.status(500).send(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
