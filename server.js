const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'admin',
    password : '',
    database : 'smartbrain'
  }
});



const server = express();

server.use(cors())
server.use(bodyParser.json());

server.get('/', (req, res)=> {
 //res.send(database.users);
 //db.select('*').from('users').then(data => {
 res.send('<h1>Hi from Smartbrain Server....</h>');
});


server.post('/signin', (req, res) => {
 
 const {email, password} = req.body;
 if (!email || !password) {
  return res.status(400).json("Incorrect credentials");
 }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('Wrong credentials')
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'))


})

server.post('/register', (req, res) => {
 
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission...");
  }
  else {
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
           .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }) 
    .catch(err => res.status(400).json('Cannot register this user...Try again'))
 
} 

} );

server.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users')
  .where({id: id})
  .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Profile not found')
      }
    })
    .catch(err => res.status(400).json('Error getting user'))
})

server.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('Unable to get entries'))
})

const PORT = process.env.PORT;
server.listen(PORT, ()=> {
  console.log(`Server is running on port ${PORT}`);
})

