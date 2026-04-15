const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use('/proxy', (req, res, next) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send('url 필요');
  }

  try {
    const proxy = createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/proxy': '',
      }
    });

    proxy(req, res, next);
  } catch (err) {
    res.status(500).send('Proxy error');
  }
});

app.get('/', (req, res) => {
  res.send('Proxy server ready 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));