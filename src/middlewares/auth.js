const jwt = require('jsonwebtoken');
const authConfing = require('../config/auth.json');


module.exports = (req, res, next) => {
  //pegando o valor do campo authorization do cabeçalho da requisição.
  const authHeader =  req.headers.authorization;
  //verificando se authHeader é igual a null, se for envia um erro.
  if(!authHeader){
    return res.status(401).send({ error: 'Não há token' });
  }
  /* como o padão para o uso do token é a palavra Bearer seguido do token.
    aqui separamos os dois usando o split.
  */
  const parts = authHeader.split(' ');

  /*como usamos o split a variavel parts deve ser um vetor com duas posições
  onde a primeira é o Bearer  e a segunda é o token, caso não esteja desse jeito eniamos um erro.
  */

  if (!parts.length === 2) {
    return res.status(401).send({error: 'Token error'});
  }
  //usamos a desestruturação para salvar cada valor do vetor em variaveis diferentes
  const [scheme, token] = parts;

//usando regex para ferificar o valor de scheme
  if(!/^Bearer$/i.test(scheme)){
    return res.status(401).send({ erro: "erro no token"})
  }
/*
  chamamos a finção verify do jwt onde recebe o  token e a nossa palavra secreta
  e uma callback.
  */
  jwt.verify(token, authConfing.secret, (err, decoded)=>{
    //verificamos se houve algum erro.
    if(err) {
      return res.status(401).send({ erro: "token invalido"});
    }

    req.userId = decoded.id;
    //se não houver nenhum erro então avançãmos com a requisição
    return next();
  });

};
