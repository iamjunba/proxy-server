const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// CORS 완전 허용
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// 🔥 동적 프록시 (핵심)
app.use('/proxy', (req, res, next) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send('url 파라미터 필요함');
  }

  createProxyMiddleware({
    target: target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return req.originalUrl.replace('/proxy?url=' + target, '');
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    }
  })(req, res, next);
});

app.get('/', (req, res) => {
  res.send('Proxy server ready 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

