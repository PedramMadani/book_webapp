const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('./config/passport')(passport); // Passport config
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(passport.initialize());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/api/users', authRoutes);
app.use('/books', bookRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));





