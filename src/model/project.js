const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//Definindo um esquema, onde fica todo os dados que vamos ter.
const projectSchema = new mongoose.Schema({
  //nome do campo
  title : {
    //tipo que essr campo sera
    type: String,
    //se é obrigatorio.
    requered: true,
  },
  description: {
    type: String,
    requered: true,
  },
  user: {
    //pegando o id do Usuario(o mengo grava id como OnjectID)
    type: mongoose.Schema.Types.ObjectId,
    //o model que se relaciona
    ref: 'User',
    requered:true,
  },
  //Por ser varios projetos devemos usar um array
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  creatAdt: {
    type: Date,
    //definindo o valor padrão
    default: Date.now,
  },
});

//Informando o model para o mongoose
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
