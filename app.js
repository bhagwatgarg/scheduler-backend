const cors=require('cors');
const express = require("express");
const bodyParser=require('body-parser');
const app=express().use('*', cors())
const HTTPError=require('./models/http-error');
const userRoutes=require('./routes/users-routes');
const eventsRoutes=require('./routes/events-routes');

app.use(bodyParser.json());
// app.use((req, res, next)=>{
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//   next();
// });
app.get('/', (req, res, next)=>{
  //console.log("GET REQUEST");
  res.json({message: "200"});
});
app.use('/events', eventsRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=>{
  next(new HTTPError("Route NOT Found!", 404));
});


app.use((error, req, res, next)=>{
  if(res.headerSent){
    return next(error);
  }
  else{
    res.status(error.code||500);
    res.json({message: error.message||"An unknown Error Occured!"});
  }
});

app.listen(process.env.PORT||5000);