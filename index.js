const fs = require('fs');
const express = require('express');

const app = express();
const router = express.Router();

const data = request =>
  new Promise((resolve, reject) => {
    const parts = [];
    request
      .on('data', d => parts.push(d))
      .on('error', err => reject(err))
      .on('close', () => {
        const data = Buffer.concat(parts);
        resolve(data);
      });
  });

router.post('/images/*', (req, res) => {
  data(req)
    .then(file => fs.promises.writeFile('.' + req.url, file))
    .then(() => console.log('Zdjęcie zapisane'));

  res.sendStatus(200);
});

app
  .use(express.static('.'))
  .use('/api', router)
  .listen(8080, () => console.log('Listening'));
