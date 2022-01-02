const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

const getJson = () => {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return null;
    }
};

app.post('/access', (req, res) => {
    const { password } = req.body;
    try {
        const { pass } = getJson();
        console.log(pass, password, password === pass)
        res.json({ access : password === pass });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
})

app.get('/getZone', (req, res) => {
    try {
        const { data } = getJson();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

app.post('/setZone', (req, res) => {
    const { coordinate, faction } = req.body;

    try {
        const file = getJson();

        const newData = file.data.map(coords =>
            coords.coordinates === coordinate
                ? { ...coords, faction: faction}
                : coords
        );

        fs.writeFile('data.json', JSON.stringify({...file, data: newData}), (err) => {
            if (err) return console.error(err);
        });
    } catch (err) {
        console.error(err);
    }

});


new CronJob('30 21 12 * * *', async () => {

    fs.copyFile("data.json", `./backup/data_${new Date().getTime()}.json`, (err) => {
        console.log('copied');
        if (err) {
            console.log("Error Found:", err);
        }
    });
}, null, true, 'Europe/Paris');

app.listen(8080, () => {
    console.log('listening on port 8080');
})
