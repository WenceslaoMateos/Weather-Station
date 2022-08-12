const wenElement = document.getElementById("wen");
const susyElement = document.getElementById("susy");
const juliElement = document.getElementById("juli");
const hofiElement = document.getElementById("hofi");
const todayCity = document.getElementById("today_city");
const todayTemp = document.getElementById("today_temp");
const todayMaxMin = document.getElementById("today_max_min");
const clock = document.getElementById("clock");
const img_now = document.getElementById("img_now");

let lat = "-38.0023";
let lon = "-57.5575";

// Global letiable with the json object with the weather data
let weather_data;
let ciudad;
let days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

// Add days of the forecast week
function add_days() {
    let date_unix = [
        weather_data.daily[1].dt,
        weather_data.daily[2].dt,
        weather_data.daily[3].dt,
    ];
    for (let i = 0; i < date_unix.length; i++) {
        // Find the day of the week for the forecast weather
        let fecha = new Date(date_unix[i] * 1000);
        let dayOfWeek = days[fecha.getDay()];
        let sigFechaMili = weather_data.current.dt + 24 * 60 * 60 * (i + 1);
        let sigFecha = new Date(sigFechaMili * 1000);
        $("#day_plus_" + (i + 1)).html(dayOfWeek + " " + sigFecha.getDate());
    }
}

// Add the icon of the forecast week
function add_icons() {
    let daily_icon = [
        weather_data.daily[1].weather[0].icon,
        weather_data.daily[2].weather[0].icon,
        weather_data.daily[3].weather[0].icon,
    ];
    for (i = 0; i < 3; i++) {
        $("#icon_plus_" + (i + 1)).html("");
        $("#icon_plus_" + (i + 1)).append(
            $("<img />")
                .addClass("img_square_small")
                .attr({ src: "img/weather/" + daily_icon[i] + ".png" })
        );
    }
}

// Add the min and max temp of forecast
function add_min_max() {
    let daily_min = [
        weather_data.daily[1].temp.min,
        weather_data.daily[2].temp.min,
        weather_data.daily[3].temp.min,
    ];
    let daily_max = [
        weather_data.daily[1].temp.max,
        weather_data.daily[2].temp.max,
        weather_data.daily[3].temp.max,
    ];
    let daily_pop = [
        weather_data.daily[1].pop,
        weather_data.daily[2].pop,
        weather_data.daily[3].pop,
    ];
    for (let i = 0; i < 3; i++) {
        $("#min_max_plus_" + (i + 1)).html(
            Math.round(daily_max[i]) + "°C / " + Math.round(daily_min[i]) + "°C"
        );
        $("#humedad_plus_" + (i + 1)).html(
            Math.round(daily_pop[i] * 10) * 10 + "%"
        );
    }
}

// Fill the data of today weather
function fill_today() {
    let options = {
            timeZone: weather_data.timezone,
            weekday: "long",
        },
        formatter = new Intl.DateTimeFormat("es-AR", options);
    let nombreDia = formatter.format(new Date());

    let date_unix = weather_data.current.dt;
    let fecha = new Date(date_unix * 1000);

    let month = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    let day_num = fecha.getDate();
    let mes = month[fecha.getMonth()];
    let temp = Math.round(weather_data.current.temp);
    todayTemp.innerText = `Hoy es ${nombreDia} ${day_num} de ${mes} y hacen ${temp} °C`;

    // Today Temp
    let max = Math.round(weather_data.daily[0].temp.max);
    let min = Math.round(weather_data.daily[0].temp.min);
    todayMaxMin.innerText = `Max: ${max}°C / Min: ${min}°C`;

    // Today icon
    img_now.classList.add("img_square_big");
    img_now.src = `img/weather/${weather_data.current.weather[0].icon}.png`;
}

function showTime() {
    let options = {
            timeZone: weather_data.timezone,
            hour: "numeric",
            minute: "numeric",
        },
        formatter = new Intl.DateTimeFormat("es-AR", options);
    let date = formatter.format(new Date());
    clock.innerText = date;
}

// Fade the image that is selected
wenElement.style["opacity"] = 0.5;
susyElement.style["opacity"] = 1;
juliElement.style["opacity"] = 0.5;
hofiElement.style["opacity"] = 0.5;
todayCity.innerText = `en Mar del Plata`;
call_weather();

wenElement.onclick = () => {
    wenElement.style["opacity"] = 1;
    susyElement.style["opacity"] = 0.5;
    juliElement.style["opacity"] = 0.5;
    hofiElement.style["opacity"] = 0.5;
    todayCity.innerText = `en Mar del Plata`;
    lat = -38.0023;
    lon = -57.5575;
    call_weather();
};

susyElement.onclick = () => {
    wenElement.style["opacity"] = 0.5;
    susyElement.style["opacity"] = 1;
    juliElement.style["opacity"] = 0.5;
    hofiElement.style["opacity"] = 0.5;
    todayCity.innerText = `en Mar del Plata`;
    lat = -38.0023;
    lon = -57.5575;
    call_weather();
};

juliElement.onclick = () => {
    wenElement.style["opacity"] = 0.5;
    susyElement.style["opacity"] = 0.5;
    juliElement.style["opacity"] = 1;
    hofiElement.style["opacity"] = 0.5;
    todayCity.innerText = `en Buenos Aires`;
    lat = -34.6132;
    lon = -58.3772;
    call_weather();
};

hofiElement.onclick = () => {
    wenElement.style["opacity"] = 0.5;
    susyElement.style["opacity"] = 0.5;
    juliElement.style["opacity"] = 0.5;
    hofiElement.style["opacity"] = 1;
    todayCity.innerText = `en Mannheim`;
    lat = 49.4883;
    lon = 8.4647;
    call_weather();
};

let flag = 0;

// This function obtain the JSON as letiable and call "appendData" to show it
function call_weather() {
    fetch(
        `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=791da408c782eab70ae3c9336dcc4adc`
    )
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            weather_data = JSON.parse(data);
            add_days();
            add_icons();
            add_min_max();
            fill_today();
            showTime();
            if (flag === 0) {
                setInterval(call_weather, 600000);
                setInterval(showTime(), 15000);
                setInterval(add_days(), 600000);
                setInterval(add_icons(), 600000);
                setInterval(add_min_max(), 600000);
                setInterval(fill_today(), 600000);
                flag++;
            }
        });
}

call_weather();
