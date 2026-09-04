const express = require('express');
const viberRouter = require('./src/channels/viber');
const path = require('path');
const { officialBranding } = require('./src/config/branding');

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/webhooks/viber', viberRouter);

app.get('/', (req, res) => {
  res.json({ status: 'active', system: 'B&H Assistant Service Bot v1.2', branding: officialBranding });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`B&H Assistant Server pokrenut na portu ${port}`));
}

module.exports = app;
