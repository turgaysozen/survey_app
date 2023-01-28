const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(cors());

app.use(cookieParser());
app.use(express.json())

app.use('/docs', express.static(path.join(__dirname, 'docs')));

// public auth routes
const mainRoute = require('./routes/main/main')
const registerRoute = require('./routes/admin/register');
const loginRoute = require('./routes/admin/login');

app.use('', mainRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth/register', registerRoute);

// protected routes
const formRoutes = require('./routes/form/form');
const formViewRoute = require('./routes/form/formView');
const questionRoutes = require('./routes/question/question');
const questionViewRoute = require('./routes/question/questionView');
const optionRoutes = require('./routes/option/option');
const optionViewRoute = require('./routes/option/optionView');
const submitSurveyRoute = require('./routes/survey/submitSurvey');
const surveyRoutes = require('./routes/survey/survey');

const auth = require('./middleware/auth');

app.use('/api/form/view', auth(['User']), formViewRoute);
app.use('/api/form', auth(['Admin']), formRoutes);
app.use('/api/question/view', auth(['User']), questionViewRoute);
app.use('/api/question', auth(['Admin']), questionRoutes);
app.use('/api/option/view', auth(['User']), optionViewRoute);
app.use('/api/option', auth(['Admin']), optionRoutes);
app.use('/api/survey/submit', auth(['User']), submitSurveyRoute);
app.use('/api/survey', auth(['Admin']), surveyRoutes);

if (require.main === module) {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
    prisma
      .$connect()
      .then(() => {
        console.log('Connected to database');
      })
      .catch(e => {
        throw e
      })
  })
}


module.exports = app;
