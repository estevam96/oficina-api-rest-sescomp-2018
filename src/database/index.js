const mongoose = require('mongoose');

//Fazendo a conexão com o mongoDB e informando a forma como vai se conectar
mongoose.connect('mongodb://localhost:27017/sescomp', { useNewUrlParser: true });
mongoose.set ('useCreateIndex', true);
//Definindo a classe de Promise
mongoose.Promise = global.Promise;

module.exports = mongoose;
