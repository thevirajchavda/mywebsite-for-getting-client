const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/contact', (req, res) => {
  const { phone, message } = req.body;

  const entry = {
    phone,
    message,
    time: new Date().toISOString()
  };

  fs.readFile('contacts.json', 'utf8', (err, data) => {
    let contacts = [];
    if (!err && data) {
      contacts = JSON.parse(data);
    }
    contacts.push(entry);
    fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2), () => {
      res.status(200).send({ success: true });
    });
  });
});
app.get('/contactssss', (req, res) => {
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading contacts');
    const contacts = JSON.parse(data || '[]');

    let html = `<h1>Contact Submissions</h1><ul>`;
    contacts.forEach(c => {
      html += `<li><b>Phone:</b> ${c.phone} <br><b>Message:</b> ${c.message} <br><i>${c.time}</i></li><hr>`;
    });
    html += `</ul>`;
    res.send(html);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
