const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const current = document.querySelector('.weather-current');
const daily = document.querySelector('.weather-content-current');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (nameCity.value != '')
		getCoordinates(nameCity.value);
	else
		showCityError();
})


function getCoordinates(name)
{
	var url = `https://search.reservamos.mx/api/v2/places?q=${name}` ;
	fetch(url)
		.then(response => {
			return response.json();
		})
		.then( (data) => {
			if (data[0] != null)
				getWeather(data[0]);
			else
				clearCurrent();
				showCityError();
		})
		.catch(function(error) {
			console.log("Error con la peticion: "+ error.message);
		});		
}


function showCityError()
{
	console.log('No se encontro la ciudad');
}

function getWeather(city)
{
	const apiKey = 'a5a47c18197737e8eeca634cd6acb581';
	var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.long}&units=metric&exclude=hourly,minutely&appid=${apiKey}`; 	

	fetch(url)
		.then(response => {
			return response.json();
		})
		.then ( dataJSON => {
			if (dataJSON != null){
				clearCurrent();
				showWeather(dataJSON);
			}
			else
				showError();
		})
}

function showWeather(data)
{
	var dailyHtml = '';
	const currentIcon = data['current']['weather'][0].icon;
	const currentTemp = data['current'].temp;
	const currentFeel = data['current'].feels_like	;
	const content = document.createElement('div');
	const dailyContent = document.createElement('div');

	content.innerHTML = `
		<img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png">
		<h3> Clima actual: ${currentTemp}°C</h3>
		<p> Sensacion termica: ${currentFeel}°C</p>
	`;
	current.appendChild(content);


	for( var idx in data['daily'] )
	{
		dailyHtml += " <div class='col'> <div class='weather-content'>  <img src='https://openweathermap.org/img/wn/"+data['daily'][idx]['weather'][0]['icon']+"@2x.png'>    <p>Temp. Min: "+data['daily'][idx]['temp']['min']+"°C</p>  <p> Temp. Max: "+data['daily'][idx]['temp']['max']+"°C</p> </div>  </div>";
	}


	dailyContent.innerHTML = `
		<div class= 'row'>
			${dailyHtml}
		</div>
	`;
	daily.appendChild(dailyContent);


}

function clearCurrent()
{
	current.innerHTML = '';	
	daily.innerHTML = '';
}

