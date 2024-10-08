const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoice');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
    res.send(`<h1>Hello Swipe</h1>`)
})

app.use('/api/invoice', invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})