const express = require("express");
const app = express();

const htmlText = `
    <html> 
        <head>
            Tarea
        </head>
        <body>
            <h1>Ricardo Antonio Alvarado Ramirez</h1>
            <h3>201603157</h3>
            <h3>Sistemas Operativos 1 Sección A</h3>
            <h3>Vacaciones Diciembre 2021</h3>
        </body>
    </html>
`;


app.listen(4500, () => {
  console.log("Escuchando en el puerto 4500...");
});

app.get("/", (req, res) => {
  res.send(htmlText);
});