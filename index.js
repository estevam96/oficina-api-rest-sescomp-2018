const express = require('express');
const bodyParser = require('body-parser')

//Iniciando aplicação;
const app = express();

/*
informando para o express que iremos usar o body-parser
(e informando para o body-parser entenda requesições com json)
*/
app.use(bodyParser.json())

/*
fazendo com que o body-parser endentda paramentos passados na url
*/
app.use(bodyParser.urlencoded({ extended : false }))

//Registrando o controller e repasando a instacia do express pra ele.
require('./src/controller/authControler')(app);
require('./src/controller/projectController')(app);

app.get('/', (req, resp) => {
  resp.send("Olá Sescomp");
})


//rodando o servidor na porta informada, no caso a 3001
app.listen(3001);
