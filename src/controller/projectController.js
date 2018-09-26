const express = require('express');
const authMiddlware = require('../middlewares/auth');
const router =  express.Router();

const Project = require('../model/project');
const Task = require('../model/task');
/*
  usamos um middleware para as requesições /project. esse middleware é executado
  antes da de qualquer outra função.
*/
router.use(authMiddlware);

//lista todas os projetos
router.get("/", async (req, res) => {
  try {
    /*
      usamos .populate(), para que possa aparecer o usuario dono do project e
      tambem as tasks que pertence ao projeto
    */
    const projects = await Project.find().populate(['user', 'tasks']);
    return res.send({ projects });

  } catch (err) {
    return res.status(400).send({erro: 'Erro ao carregar projeto'});
  }
});
//recupra um projeto com uma determinada id, que passado na url,(:projectId)
router.get('/:projectId', async (req, res) => {
  try {
    const projects = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
    return res.send({ projects });

  } catch (err) {
    return res.status(400).send({erro: 'Erro ao carregar projeto'});
  }
});

router.post('/', async (req, res)=>{
  try {
    //pegando o title, description e as task que são passada na requisição
    const {title, description, tasks } = req.body;
    //Criando um projeto com sem as tasks, que seram criadas posteriomente
    const project = await Project.create({title, description, user: req.userId });
    /*
      criando as tasks separadamente, o Promise.all é para que a aplicação espera
     que todas as tasks sejam salvar. o map é para que percorras todas as tasks
     como se fosse um laço for
    */
    await Promise.all (tasks.map(async task => {
      /*
        para cada teste salvamos no banco, com as informação e projeto a
        qual elas são relacionadas.
        o ...tasks serve para obter todos os campos do objeto tasks
      */
      const projectTasks = new Task({...tasks, project: project._id });
      await projectTasks.save();
      //setamos a tasks ao objeto projeto
        project.tasks.push(projectTasks);

    }));
    //salvando o projeto no banco
    await project.save();

    return res.send({ project });

  } catch (err) {
    return res.status(400).send({erro: 'Erro ao criar projeto'})
  }
})

router.put('/:projectId', async (req, res) => {
  try {
    const {title, description, tasks } = req.body;
    /*
      usamos a função findByIdAndUpdate para fazer a busca do projeto pelo id, e
      depois atualizar esse projeto com os demas campus
     */
    const project = await Project.findByIdAndUpdate(req.params.projectId,{title, description},{ new: true });

    /*
      excluimos as taks do projeto que foi atualizado, por que se não o mongodb
      ira duplicar essas tasks,
    */
    project.tasks = [];
    //removendo tasks que possuam o id = ao do projeto q estamos atualizando
    await Task.remove({project: project._id});

    await Promise.all (tasks.map(async task => {
      const projectTasks = new Task({...tasks, project: project._id });
      await projectTasks.save();

        project.tasks.push(projectTasks);

    }));

    await project.save();

    return res.send({ project });

  } catch (err) {
    console.log(err);
    return res.status(400).send({erro: 'Erro ao criar projeto'})
  }
});
//remover um projeto com determinada id que é passado pela url
router.delete('/:projectId', async (req, res) => {
  try {
    /*
      usamos a função findOneAndDelete do mongoose para buscar um projeto(neste
      caso estamos usando o id mais pode usar outro campo)
    */
    const projects = await Project.findOneAndDelete(req.params.projectId);
    return res.send();

  } catch (err) {
    return res.status(400).send({erro: 'Erro ao apagar projeto'});
  }
});

module.exports = app => app.use('/project', router);
