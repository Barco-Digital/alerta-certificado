const fs = require('fs');
const https = require('https');
require('dotenv').config();
const PORT = process.env.APP_PORT || 4433;

const options = {
  key: fs.readFileSync(process.env.CERT_KEY, 'utf8'),
  cert: fs.readFileSync(process.env.CERT_FILE, 'utf8'),
  // ca: fs.readFileSync('config/ca.ca'),
  requestCert: true,
  rejectUnauthorized: false,
  isServer: true
};

https.createServer(options, (req, res) => {
  try {
    const header = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    };
    res.writeHead(200, header);

    const { subject: { CN }, subjectaltname, valid_from, valid_to, serialNumber } = req.socket.getPeerCertificate();
    const [razao, cnpj] = CN.split(":");

    const subjectAltName = {};

    subjectaltname.split(",").map(prop => {
      const [key, valor] = prop.trim().split(":");
      subjectAltName[key] = valor;
    });

    res.end(JSON.stringify({
      ok: true,
      empresa: {
        cnpj,
        razao,
        data_inicio: new Date(valid_from),
        data_final: new Date(valid_to),
        serial: serialNumber,
        subjectAltName
      }
    }));
  } catch (e) {
    res.end(JSON.stringify({ ok: false }));
  }
}).listen(PORT, () => console.log(`\n>Servidor SSL HandShake iniciado na porta ${PORT} \n`));
