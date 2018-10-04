const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//Redis client
let client = redis.createClient();
client.on('connect', () => console.log('Connected to Redis'));

const PORT = 3000;

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
   res.render('search_users');
});

app.post('/users/search', (req, res) => {
   let id = req.body.id;

   client.HGETALL(id, (err, user) => {
      if(err) {
         res.render('search_users', {error: 'User does not exists'});
      } else {
         user.id = id;
         res.render('details', {user: user});
      }
   })
})

app.listen(PORT, () => console.log('Server is running..'));