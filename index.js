const express = require('express');
const app = express();
const { Joke } = require('./db');
const { Op } = require('sequelize');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.get('/jokes', async (req, res, next) => {
//   try {
//      // TODO - filter the jokes by tags and content
//      const { content, tags } = req.query;
//      const where = {};
 
//      if (content) where.content = { [Op.like]: `%${content}%` };
//      if (tags) where.tags = { [Op.like]: `%${tags}%` };

//     const jokes = await Joke.findAll({
//       where
//     })
//   res.send(jokes);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

app.get('/jokes', async (req, res, next) => {
  try {
  // if there are no query parameters, display all jokes
  if(Object.keys(req.query).length===0){
      const jokes = await Joke.findAll({});
      res.send(jokes);    
  } else {
      // if there ARE query params, send specific jokes
      // define filter object:
      const where = {};
      for(const key of ['tags', 'content'] ){
          if(req.query[key]){
              where[key] = {
                  // special sequelize keywords for filtering
                  [Op.like]: `%${req.query[key]}%` // search within string for text
              }
          }
      }
      const jokes = await Joke.findAll({
          where
      });

      res.send(jokes);
  }
} catch (error) {
  console.error(error);
  next(error);
}
})


app.delete('/:id', async (req, res) => {
     const joke = await Joke.findByPk(req.params.id);
      await Joke.destroy({
          where: {
              id: req.params.id
          }
      });
      const jokes = await Joke.findAll({});
      res.send(jokes);
  })
  

  app.post("/jokes", async (req, res) => {
    const { joke, tags } = req.body;
    const newJoke = await Joke.create({ joke, tags });
    res.json(newJoke)
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;

