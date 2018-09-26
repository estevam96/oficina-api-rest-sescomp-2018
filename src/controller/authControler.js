const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfing = require('../config/auth');

const User = require('../model/user');

//Defininfo router para definir rotas apenas para /user/**
const router = express.Router();

//Função para gerar o token de acesso, recebe paramentos que serão passado do usario no caso o id.
function generateToken(params = {}) {
  /*
    o jwt.sing() é o responsavel por criar o token de acesso,
    recebo o param que deve ser uma informação unica para cada usuario,
    authConfing é o a palavra chave que identifica a aplicação,
    o  é onde esse token expira(em milisegundos) que no caso é em um dia.
  */
  return jwt.sign(params,authConfing.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req,resp) => {
  //pegando somente o valor do email na requesição
  const { email } = req.body;
  try {
    //Buscando usuario pelo email
    if (await User.findOne({ email })){
      return res.status(400).send({ erro: 'usuario já existe'})
    }
    //cadastrando um novo usuario. o req.body passa todos os valores da requisição (name, email, passwor)
    const user =  await User.create(req.body);
    //setando a senha como undefined para não retorna apos salvar o usuario.
    user.password = undefined;

    //Retornamos o usuario cadastrado.
    return resp.send({
    user,
    token: generateToken({id: user.id}),
  });
  } catch (err){
    //Caso haja erro rrespondemos com um erro 400 e uma mensagem de erro.
    return resp.status(400).send({ erro: 'falha ao registra usuario'});
  }
});

router.post('/authenticate', async (req, res) => {
  /*
    Pegando o username e o password passados na requisição
  */
  const {email, password } = req.body;
/*
  buscando o usuario pelo o email e password( o select é para que a senha tambem venha do banco)
*/
  const user = await User.findOne({ email}).select('+password');

/*
  verificando se o user é null, se for enviamos uma mensagem de erro
*/
  if(!user){
    return res.status(500).send({ erro: 'usuario não existe'})
  }
/*
  verificando se a senha esta correta(comparando se a senha da requisição é igua a senha do usuario)
*/
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(500).send({ erro: 'senha invalida'});
  }
  //setando a senha como undefined para não retorna apos salvar o usuario.
  user.password = undefined;



  res.send({
    user,
    token: generateToken({id: user.id}),
  });
})

module.exports = app => app.use('/auth', router);
