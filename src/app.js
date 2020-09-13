const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./uitls/geocode')
const forecast = require('./uitls/forecast')

const { copyFile } = require('fs')

const app = express()

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title : 'Weather App',
        name : 'Tommy Vu'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Tommy Vu'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        helpText : 'This is some helpful text.',
        title : 'Help',
        name : 'Tommy Vu'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error : 'Address should be supplied'
        })
    }

    geocode(req.query.address, (error, {long, lat, location} = {}) => { // if object parameter not exist, it will get default value (get empty in this case)
        if(error){
            return res.send({error})
        }
    
        forecast(long, lat, (error, {temperature, feelslike, weather_descriptions} = {}) => { 
            if(error){
                return res.send({err})
            }

            res.send({
                forecast : 'The temperature outside is ' + temperature + ' Celcius but it feels like ' + feelslike + ' Celcius. Weather description is ' + weather_descriptions,
                location,
                address  : req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error : 'You must provide a search term'
        })
    }

    res.send({
        products : []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        errorMessage : 'Help article not found',
        title : '404',
        name : 'Tommy Vu'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        errorMessage : 'Page not found',
        title : '404',
        name : 'Tommy Vu'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
