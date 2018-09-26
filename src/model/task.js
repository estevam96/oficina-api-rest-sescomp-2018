const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//Definindo um esquema, onde fica todo os dados que vamos ter.
const taskSchema = new mongoose.Schema({
  //nome do campo
  title : {
    //tipo que essr campo sera
    type: String,
    //se é obrigatorio.
    requered: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    requered: true,
  },
  assognedTo: {
    //pegando o id do Usuario(o mengo grava id como OnjectID)
    type: mongoose.Schema.Types.ObjectId,
    //o model que se relaciona
    ref: 'User',
    requered:true,
  },
  complete: {
    type: Boolean,
    requered: true,
    default: false,
  },
  creatAdt: {
    type: Date,
    //definindo o valor padrão
    default: Date.now,
  },
});

//Informando o model para o mongoose
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
