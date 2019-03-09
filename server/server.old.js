const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// const database = {
//   users: [{
//     id: '123',
//     name: 'Andrei',
//     email: 'john@gmail.com',
//     entries: 0,
//     joined: new Date()
//   }],
//   secrets: {
//     users_id: '123',
//     hash: 'wghhh'
//   }
// }

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/signin', (req, res) => {
  var a = JSON.parse(req.body);
  if (a.username === database.users[0].email && a.password === database.secrets.hash) {
    res.send('signed in');
  } else {
    res.json('access denied');
  }
})

app.post('/findface', (req, res) => {
  database.users.forEach(user => {
    if (user.email === req.body.email) {
      user.entries++
      res.json(user)
    }
  });
  res.json('nope')
})


app.post('/register', (req, res) => {
  database.users.push({
    id: '124',
    name: req.body.name,
    email: req.body.email,
    entries: 0,
    joined: new Date()
  });
  // res.send(body);
  // res.json(database.users[database.users.length - 1])
})

app.get('/profile/:userId', (req, res) => {
  database.users.forEach(user => {
    const found = false;
    if (user.id === req.params) {
      found = true;
      return res.json(user);
    }
    if (!found) {
      res.status(400).json('not found');
    }
  })
  // res.json('no user')

})

app.listen(3000, () => {console.log('Example app listening on port 3000!')});
