$(document).ready(function() {
    $('#labelCountry').hide()
    $.getJSON("https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/regions", (data) => {
        for(let i = 0; i < data.length; i++) {
            $("#regionSelect").append(`
                <option value="${data[i]}">${data[i]}</option>
            `)
        }
    });
    function updateCounter() {
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const nextQuarterHour = Math.ceil((minutes + 1) / 15) * 15;
        const remainingMinutes = nextQuarterHour - minutes - 1;
        const remainingSeconds = 60 - seconds;
        if(minutes === 0) {
            $('#refresh').text(`Refreshes in: ${remainingSeconds}s`);
        } else {
            $('#refresh').text(`Refreshes in: ${remainingMinutes}m ${remainingSeconds}s`);
        }
    }

    setInterval(updateCounter, 1000);
    updateCounter(); // Initial call to set the counter

    $('#regionSelect').change(function() {
        const selectedRegion = $(this).val();

        if (selectedRegion !== "Select") {
            $.getJSON(`https://www.cs.kent.ac.uk/people/staff/yh/api/country-data/countries/region/${selectedRegion}`, (data) => {
                $('#countrySelect').show();
                $('#countrySelect').empty().append('<option>Select</option>');
                for(let i = 0; i < data.length; i++) {
                    $('#countrySelect').append(`
                        <option value="${data[i].name}" data-lat="${data[i].latlng[0]}" data-long="${data[i].latlng[1]}">${data[i].name}</option>
                    `);
                }
                $('#labelCountry').show();
            });
        } else {
            $('#countryWeather').empty()
            $('#labelCountry').hide()
        }
    });

    $('#countrySelect').change(function () {
        const selectedOption = $(this).find('option:selected');
        const lat = selectedOption.data('lat');
        const long = selectedOption.data('long');

        if(selectedOption.val() !== "Select") {
            $.getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`, (data) => {
                const weatherList = $('<ul></ul>');
                weatherList.append(`<li>Temperature: ${data.current.temperature_2m}°C</li>`);
                weatherList.append(`<li>Humidity: ${data.current.relative_humidity_2m}%</li>`);
                weatherList.append(`<li>Apparent Temperature: ${data.current.apparent_temperature}°C</li>`);
                weatherList.append(`<li>Precipitation: ${data.current.precipitation}mm</li>`);
                weatherList.append(`<li>Cloud Cover: ${data.current.cloud_cover}%</li>`);
                weatherList.append(`<li>Wind Speed: ${data.current.wind_speed_10m} m/s</li>`);
                weatherList.append(`<li>Wind Direction: ${data.current.wind_direction_10m}°</li>`);
                $('#countryWeather').empty().append(weatherList);
            });
        } else {
            $('#countryWeather').empty()
        }
    });
});