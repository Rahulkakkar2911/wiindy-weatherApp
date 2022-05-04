const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios').default;
const app = express();
dotenv.config({
    path:"./config.env"
});
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.get('/', (req,res) => {
    res.send(`index.html`);
})
app.get('/weather/geoloc', async (req,res,next) => {
    try{
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.long}&units=metric&appid=${process.env.API_KEY}`;
        const response = await axios.get(api);
        return res.status(200).send(response.data);
    }
    catch(err){
        return next(new Error("No City Found!"));
    }
});
app.get('/weather/:city', async (req,res,next) => {
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&units=metric&appid=${process.env.API_KEY}`);
        return res.status(200).send(response.data);
    }
    catch(err){
        return next(new Error("No City Found!"));
    }
});

app.use('*', (req, res) => {
    res.status(404).json({
      success: 'false',
      message: 'Page not found',
      error: {
        statusCode: 404,
        message: 'You reached a route that is not defined on this server',
      },
    });
});

app.use((err, req, res, next) => {
    if(err.message === "No City Found!"){
        return res.status(404).json({
            status:404,
            error:err.message
        })
    }
});

app.listen(process.env.PORT || 3000, (err) => {
    if(!err){
        console.log(`Server is running on port : ${process.env.PORT || 3000}`);
    }
    else{
        console.log(`Error Occured : `,err);
    }
})