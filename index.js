const http = require('http')
const fs = require('fs')
const requests = require('requests');


const homeFile = fs.readFileSync('home.html', 'utf-8')

const replaceVal = (tempval, orgval) => {
    temprature = tempval.replace('{%tempval%}', orgval.main.temp);
    temprature = temprature.replace('{%tempmin%}', orgval.main.temp_min);
    temprature = temprature.replace('{%tempmax%}', orgval.main.temp_max);
    temprature = temprature.replace('{%City%}', orgval.name);
    temprature = temprature.replace('{%Country%}', orgval.sys.country);
    temprature = temprature.replace('{%tempStatus%}', orgval.weather[0].main);
}



const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=70eefff73d1dfcf0e9ca4bfb45c3c9d2')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk)
                const arrData = [objData]
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
                // console.log('realTimeData==>>>>',realTimeData);
                res.write(realTimeData).join('')
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
                res.end()
            });
    }
})
server.listen(8000, '127.0.0.1');