//jshint esversion:6

const express = require("express");
const request = require("request");
const path = require("path");
const hbs = require("hbs");
const app = express();

const port = process.env.PORT || 3000;

const publicStaticDirPath = path.join(__dirname, './public')

const viewsPath = path.join(__dirname, './templates/views');

const partialsPath = path.join(__dirname, './templates/partials');

app.set("view engine", "hbs");
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get("/", (req, res) => {
  res.render('home');
});

const weatherData = (address, callback) => {

  const apiKey = "31dc1f1f2f4972d0e5a614cc631f0299"

  const units = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(address) + '&appid=' + apiKey + '&units=' + units;

  request({
    url,
    json: true
  }, (error, {
    body
  }) => {

    if (error) {
      callback("Can't fetch data from OpenWeatherMap API", undefined);
    } else if (!body.main || !body.weather || !body.wind || !body.sys) {
      callback("Unable to find required data, try another location", undefined);
    } else {
      callback(undefined, {
        city: body.name,
        icon: body.weather[0].icon,
        country: body.sys.country,
        description: body.weather[0].description.charAt(0).toUpperCase() + body.weather[0].description.slice(1),
        temp: Math.round(body.main.temp),
        windSpeed: Math.round(body.wind.speed) * 3.6,
        minTemp: Math.round(body.main.temp_min),
        maxTemp: Math.round(body.main.temp_max),
        feelsLike: Math.round(body.main.feels_like),
        humidity: body.main.humidity,
        pressure: body.main.pressure,
        imageurl: ()=> {

          const icon = body.weather[0].icon;
          const url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

          return url;
        }
      })
    }
  });
};

app.get("/weather", (req, res) => {

  const address = req.query.address;
  if (!address) {
    return res.send({
      error: "You must enter address in search text box"
    })
  }

  weatherData(address, (error, {
    city,
    country,
    description,
    temp,
    windSpeed,
    minTemp,
    maxTemp,
    feelsLike,
    humidity,
    pressure,
    icon,
    imageUrl
  } = {}) => {
    if (error) {
      return res.send({
        error
      })
    }
    console.log(city, country, description, temp, windSpeed, minTemp, maxTemp, feelsLike, humidity, pressure, icon, imageUrl);
    res.send({
      city,
      country,
      description,
      temp,
      windSpeed,
      minTemp,
      maxTemp,
      feelsLike,
      humidity,
      pressure,
      icon,
      imageUrl
    })
  });
});


app.get("*", (req, res) => {
  res.render('404');
});

app.post("*", function(req, res) {
  res.redirect("/");
});

app.listen(port, function() {
  console.log("Server is running on port: ", port);
});
