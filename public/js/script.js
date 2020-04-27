let currentUrl = location || document.location;

console.log(currentUrl);

const initPlacesApi = () => {
  if (currentUrl !== 'https://weather-app-ll.herokuapp.com/') {
    return;
  } else {

    const input = document.getElementById('city');
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)']
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      const place = autocomplete.getPlace();
    })

    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }
  }
}

initPlacesApi();

let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty('--vh', `${vh}px`);

const fetchWeather = '/weather';
const successFadeIn = document.querySelector('.success-inner');
const failureFadeIn = document.querySelector('.failure-inner');
const cardSuccess = document.querySelector('.card-success');
const error = document.querySelector('.error-text');
const cardFailure = document.querySelector('.card-failure');
const weatherForm = document.querySelector('.main form');
const search = document.querySelector('input');
const city = document.querySelector('.city');
const picture = document.querySelector('.icon');
const temperature = document.querySelector('.temp');
const desc = document.querySelector('.description');
const humMaxMin = document.querySelector('.hum-max-min');
const feelsLikePressureWind = document.querySelector('.feelslike-pressure-wind');


weatherForm.addEventListener('submit', (event) => {

  event.preventDefault();

  successFadeIn.classList.remove("animated");
  failureFadeIn.classList.remove("animated");
  cardSuccess.style.display = 'none';
  cardFailure.style.display = 'none';

  const locationApi = fetchWeather + "?address=" + search.value;

  fetch(locationApi).then(response => {
    response.json().then(data => {

      search.value = '';

      if (data.error) {
        cardSuccess.style.display = 'none';

        error.innerHTML = `<h3>${data.error}</h3>`;

        cardFailure.style.display = 'initial';
        failureFadeIn.classList.add("animated");

      } else {

        city.innerHTML = `<h1>${data.city}, ${data.country}</h1>`;

        picture.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">`;

        temperature.innerHTML = `<p>${data.temp} &degC</p>`;

        desc.innerHTML = `<p>${data.description}.</p>`;

        humMaxMin.innerHTML = `<p>Humidity ${data.humidity} %</p>
        <p>Max temp ${data.maxTemp} &degC</p>
        <p>Min temp ${data.minTemp} &degC</p>`;

        feelsLikePressureWind.innerHTML = `<p>Feels like ${data.feelsLike}&degC</p>
        <p>Pressure ${data.pressure} hpa</p>
        <p>Wind ${data.windSpeed} km/h</p>`;

        cardSuccess.style.display = 'initial';
        successFadeIn.classList.add("animated");
        cardFailure.style.display = 'none';
      }
    });
  })
})
