//Elements -> 
const container = document.querySelector('.container');
let inputPart = document.querySelector('.input-part');
let alertTxt = document.querySelector('.alert');
let inputField = document.querySelector('.inputtxt');
const getLocBtn = document.querySelector('.get-loc-btn');
const tempNum = document.querySelector('.temp .num');
const weatherTxt = document.querySelector('.weather');
const locationTxt = document.querySelector('.location span');
const feelsLikeText = document.querySelector('.temp .num-2');
const humidityText = document.querySelector('.humidity span');
const imgEl = document.querySelector('.weather-icon');
const backArrow = document.querySelector('.header i');
let api = '';
let api_key = process.env.apikey;

const requestAPI = function(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
    fetchData()
    
}
const fetchData = function(){
    alertTxt.innerText = "Getting Weather Details...";
    alertTxt.classList.add('info');
    fetch(api).then(res => res.json().then(data => weatherDetails(data))
    );
}
const weatherDetails = function(data){
    if(data.cod === '404'){
        alertTxt.innerText = `${inputField.value} isn't a valid city name`;
        alertTxt.classList.replace('info', 'error');
    }
    else{
        //required Properties from data obj
        const city = data.name;
        const country = data.sys.country;
        const {description, id} = data.weather[0];
        const {feels_like, humidity, temp} = data.main;

        if(id === 800){
            imgEl.src = `icons/clear.png`;
        }
        else if(id >= 200 && id <= 232){
            imgEl.src = `icons/storm.png`
        }
        else if(id >= 600 && id <= 622){
            imgEl.src = `icons/snow.png`
        }
        else if(id >= 701 && id <= 781){
            imgEl.src = `icons/haze.png`
        }
        else if(id >= 801 && id <= 804){
            imgEl.src = `icons/cloud.png`
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            imgEl.src = `icons/rain.png`
        }

        //passing to html
        tempNum.innerText = Math.floor(temp);
        weatherTxt.innerText = description;
        locationTxt.innerText = `${city}, ${country}`;
        feelsLikeText.innerText = Math.floor(feels_like);
        humidityText.innerText = `${humidity}%`;

        alertTxt.classList.remove('info', 'error');
        container.classList.add('active');
    }
    
}
const onSuccess = function(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
    fetchData();
}
const onError = function(err){
    alertTxt.innerText = err.message;
    alertTxt.classList.add('error')
}
inputField.addEventListener('keyup', e=> {
    let city = inputField.value.trim();
    if(e.key === 'Enter' && city !== ""){
        //request API
        requestAPI(city);
    }
});
getLocBtn.addEventListener('click', (e) => {
    //if browser supports geolocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else{
        alert('Your Browser not support Geolocation API')
    }
})
backArrow.addEventListener('click', e => {
    container.classList.remove('active');
})