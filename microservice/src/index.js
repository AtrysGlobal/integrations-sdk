
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const mit = require('./utils/config');

const app = express();
const port = process.env.PORT || 3031;

app.use(bodyparser.json());
const sessionRoutes = require('./routes/session.route');
const normalizeModelRoutes = require('./routes/normalizeModel.route');
const patientRoutes = require('./routes/patient.route');
const loginRoutes = require('./routes/login.route');
const appointmentRoutes = require('./routes/appointment.route');
const professionalRoutes = require('./routes/professional.route');
const specialtyRoutes = require('./routes/specialty.route');
const blockRoutes = require('./routes/block.route');

sessionRoutes(app);
normalizeModelRoutes(app);
patientRoutes(app);
loginRoutes(app);
appointmentRoutes(app);
professionalRoutes(app);
specialtyRoutes(app);
blockRoutes(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/hola', (req, res) => {
  res.send(mit);
})

app.listen(port, () => {
  console.log(`ms-atrys-boilerplate listening at http://localhost:${port}`)
})

