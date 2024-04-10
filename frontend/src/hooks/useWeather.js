import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export function useWeather() {
    const [weatherDetails, setWeatherDetails] = useState("");

    const [place, setPlace] = useState(" ");

    const weather = useMemo(() => {
        return {
            apiKey: "0bff6234f35d3b5aef48e0dd8d8d27b9",
            fetchWeather: function (city) {
                fetch(
                    "https://api.openweathermap.org/data/2.5/weather?q=" +
                    city +
                    "&units=metric&appid=" +
                    this.apiKey
                )
                    .then((response) => {
                        if (!response.ok) {
                            alert("No weather found.");
                            throw new Error("No weather found.");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        this.displayWeather(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            displayWeather: function (data) {
                const { name } = data;
                const { icon, description } = data.weather[0];
                const { temp, humidity } = data.main;
                const { speed } = data.wind;
                setWeatherDetails(() => ({
                    city: name,
                    temp: temp + "°C",
                    icon: "https://openweathermap.org/img/wn/" + icon + ".png",
                    description: description,
                    humidity: humidity + "%",
                    wind: speed + " km/h",
                }));
            },
            search: function () {
                this.fetchWeather(place);
            },
        };
    }, [place]);

    useEffect(() => {
        axios.get("https://ipapi.co/json")
            .then((response) => {
                setPlace(response.data.city);
                weather.fetchWeather(response.data.city);
            })
            .catch((error) => console.log(error));
    }, [weather]);

    return [weatherDetails, place, setPlace, weather];
}