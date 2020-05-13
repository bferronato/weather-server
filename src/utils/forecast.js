const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=3cafb243e791065ddb85683e2aa73185&query=${latitude},${longitude}`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {

            const temperature = body.current.temperature
            const feelslike = body.current.feelslike
            const description = body.current.weather_descriptions[0]

            callback(undefined, `${description}. It currently ${temperature} degrees out. Its feels like ${feelslike} degrees out.`)
        }
    })
}

module.exports = forecast