import express from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(express.json());

app.use('/', webhookRoutes);

app.get('/', (req, res) => {
    res.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
});

// Aquí es donde iniciamos el servidor usando `config.PORT`
app.listen(config.PORT, () => {
    console.log(`Server is listening on port: ${config.PORT}`);
});
