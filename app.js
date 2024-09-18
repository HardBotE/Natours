const express=require('express');
const fs=require('fs');
const app=express();

//Middleware!?!
app.use(express.json());

const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const port=3000;

const getAllTours=(req,res)=>{
  res.status(201).json({
    status:'success',
    number_of_data:JSON.stringify(tours).length,
    data:{
      tours
    }
  })
};

const getTour=(req,res)=>{
  const id=parseInt(req.params.id);
  const tour=tours.find(e=>e.id===id);

  console.log(req.params);

  res.status(201).json({
    status:'success',
    data:{
      tour
    }
  });
};

const updateTour=(req,res)=>{
  console.log(req.body);

  const newId =tours.length;
  const newTour=Object.assign({},{id:newId},req.body);

  tours.push(newTour);
  console.log(tours);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err => {

  });
  res.send('Done');
};

const modifyTour=(req,res)=>{
  res.send('This is where the patch method will be implemented');
};

const deleteTour=(req,res)=>{
  res.send('This is where the delete method will be implemented');
};

app.route('/api/v1/tours').post(updateTour).get(getAllTours);
app.route('/api/v1/tours/:id').get(getTour).delete(deleteTour).patch(modifyTour);

/*app.post(updateTour);
app.get('api/v1/tours/:id',getTour);
app.get('/api/v1/tours',getAllTours);
app.patch('/api/v1/tours',updateTour);
app.delete('/api/v1/tours/:id',deleteTour);*/

app.listen(port,()=>{
  console.log((`Welcome from the ${port} port`));
});
