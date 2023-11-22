const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());



// Importing the routers
const userRouter = require('./routers/userRouter');
const profileRouter = require('./routers/profileRouter');

app.use('/users', userRouter);
app.use('/profile', profileRouter);

app.use(express.json());

const port = 3000;
// Find an available port
const server = app.listen(port, () => {
//   const port = server.address().port;

  console.log(`The Server is running on port ${port}`);
});
// const port = 5432;
// app.listen(port)
