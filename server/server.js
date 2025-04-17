const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./test1.db', err => {
  if(err){
    console.log(err.message);
  }
  console.log('БД подключена');
})

app.post('/register', (req, res) => {
  const {login, password, name, surname, patronymic, phone, email} = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if(err){
      return res.status(400).json({message: err.message})
    }
    db.run(`insert into user_table (login, password, name, surname, patronymic, phone, email, id_role) values (?,?,?,?,?,?,?,?)`, [login, hash, name, surname, patronymic, phone, email, 1], 
    function(err){
      if(err){
        return res.status(400).json({message: err.message})
      }
      res.status(201).json({message: 'Пользователь зарегистрирован'})
    })
  })
})

app.post('/login', (req, res) => {
  const {login, password} = req.body;

  db.get(`select * from user_table where login = ?`, [login], (err, user) => {
    if(err || !user){
      return res.status(400).json({message: 'Неверный логин'})
    }
    bcrypt.compare(password, user.password, (err, match) => {
    if(!match){
      return res.status(400).json({message: 'Неверный пароль'})
    }
    const token = jwt.sign({id_user: user.id_user, id_role: user.id_role, login: user.login}, 'secret', {expiresIn: '1h'})
    res.json({token, id_user: user.id_user, id_role: user.id_role, login: user.login})
  })
  })
})

app.post('/create', (req, res) => {
  const {id_product, quantity, delivery_address, order_date} = req.body;

  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(400).json({message: 'Нет токена'})
  }
  jwt.verify(token, 'secret', (err, decode) => {
    if(err){
      return res.status(400).json({message: 'Невреный токен'})
    }

    const id_user = decode.id_user;
    db.run(`insert into order_table (id_user, id_product, id_status, quantity, delivery_address, order_date) values (?,?,?,?,?,?)`, [id_user, id_product, 1, quantity, delivery_address, order_date],
    function(err){
      if(err){
        return res.status(400).json({message: err.message});
      }
      res.status(201).json({message: 'Заказ создан!'})
    })
  })
})

app.get('/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(400).json({message: 'Нет токена'})
  }
  jwt.verify(token, 'secret', (err, decode) => {
    if(err){
      return res.status(400).json({message: 'Невреный токен'})
    }

    const id_role = decode.id_role;
    const id_user = decode.id_user;
    if(id_role === 2){
      db.all(`select * from order_table`, (err, row) => {
        if(err){
          return res.status(400).json({message: err.message})
        }
        res.status(200).json(row)
      })
    } else {
      db.all(`select * from order_table where id_user = ?`, [id_user], (err, row) => {
        if(err){
          return res.status(400).json({message: err.message})
        }
        res.status(200).json(row)
      })
    }
  })
})

app.put('/order/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(400).json({message: 'Нет токена'})
  }
  jwt.verify(token, 'secret', (err, decode) => {
    if(err){
      return res.status(400).json({message: 'Невреный токен'})
    }
    const {id} = req.params;
    const {id_status} = req.body;
    const id_role = decode.id_role;
    if(id_role === 2){
      db.run(`update order_table set id_status = ? where id_order = ?`, [id_status, id],
        function(err){
          if(err){
            return res.status(400).json({message: err.message})
          }
          res.status(201).json({message: 'Статус обновлен!'})
        }
      )
    } else {
      return res.status(400).json({message: 'Вы не админ!'})
    }
  })
})

app.get('/product', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(400).json({message: 'Нет токена'})
  }
  jwt.verify(token, 'secret', (err, decode) => {
    if(err){
      return res.status(400).json({message: 'Невреный токен'})
    }
    db.all(`select * from product`, (err, row) => {
      if(err){
        return res.status(401).json({message: err.message})
      }
      res.status(201).json(row)
    })
  })
})

app.get('/statuses', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(400).json({message: 'Нет токена'})
  }
  jwt.verify(token, 'secret', (err, decode) => {
    if(err){
      return res.status(400).json({message: 'Невреный токен'})
    }
    db.all(`select * from status`, (err, row) => {
      if(err){
        return res.status(401).json({message: err.message})
      }
      res.status(201).json(row)
    })
  })
})



app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`)
})
