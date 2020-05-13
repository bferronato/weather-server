const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partiasPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partiasPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (request, response) => {
    response.render('index', {
        title: 'Weather',
        name: 'Bruno'
    })
})

app.get('/about', (request, response) => {
    response.render('about', {
        title: 'About me',
        name: 'Bruno'
    })
})

app.get('/help', (request, response) => {
    response.render('help', {
        message: 'This is a help page',
        title: 'Help',
        name: 'Bruno'
    })
})

app.get('/weather', (request, response) => {

    const address = request.query.address

    if (!address) {
        return response.send({
            error: 'An address must be provided'
        })
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return response.send({ error })
        }

        forecast(latitude, longitude, (error, forecastdata) => {
            if (error) {
                return response.send({ error })
            }

            response.send({
                forecast: forecastdata,
                location,
                address
            })
        })
    })
})

app.get('/help/*', (request, response) => {
    response.render('404', {
        title: '404',
        name: 'Bruno',
        message: 'Help article not found'
    })
})

app.get('*', (request, response) => {
    response.render('404', {
        title: '404',
        name: 'Bruno',
        message: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})