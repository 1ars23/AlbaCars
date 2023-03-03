// import bootstrap from './lib/infrastructure/config/bootstrap';
// import createServer from './lib/infrastructure/webserver/server';

// // Start the server
// const start = async () => {
//   try {
//     await bootstrap.init();
//     await createServer();
//   }
//   catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// start();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('common'));

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blog-posts', blogPostRoutes);

// Database connection
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
