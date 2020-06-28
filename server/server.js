import express from 'express';
import { json } from 'body-parser';

const app = express();

/** --- middleware ---- */
app.use(express.json());
app.use(json());
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
/** --- middleware ---- */

app.all('*', (req, res) => {
    // res.json({ version: '1.0.0' });
    res.render('index');

});

export default app;