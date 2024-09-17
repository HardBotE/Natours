const express=require('express');
const fs=require('fs');
const app=express();

//Middleware!?!
app.use(express.json());

const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

const port=3000;

app.get('/api/v1/tours',(req, res) => {
  res.status(200).json({
    status:'success',
    data:{
      tours
    }
  });

});

app.post('/api/v1/tours',(req, res)=>{
  console.log(req.body);

  const newId =tours.length;
  const newTour=Object.assign({},{id:newId},req.body);

  tours.push(newTour);
  console.log(tours);
  fs.writeFile(`${__dirname}/dev-data/data/tours.json`,JSON.stringify(tours),err => {

  });
  res.send('Done');
});

app.listen(port,()=>{
  console.log((`Welcome from the ${port} port`));
});
