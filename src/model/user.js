const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//Definindo um esquema, onde fica todo os dados que vamos ter.
const userSchema = new mongoose.Schema({
  //nome do campo
  name : {
    //tipo que essr campo sera
    type: String,
    //se é obrigatorio.
    requered: true,
  },
  email: {
    type: String,
    //declarando como unico
    unique: true,
    requered: true,
    //transformando em caixa baixa
    lowercase: true,
  },
  password : {
    type: String,
    required: true,
    //para não retornar quando chamar esse objeto
    select : false
  },
  creatAdt: {
    type: Date,
    //definindo o valor padrão
    default: Date.now,
  },
});

//Incriptando a senha antes de salvar no banco
userSchema.pre('save',async function (next) {
  //Encriptando a senha usando 10 rout(ou seja gerando o hash 10x)
  const hash = await bcrypt.hash(this.password, 10);

  //this refere-se ao password do objeto a ser salvo
  this.password = hash;

  next();
});
//Informando o model para o mongoose
const User = mongoose.model('User', userSchema);

module.exports = User;
