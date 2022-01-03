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

app.post('/InteractiveMapStalker/api/access', (req, res) => {
    const { password } = req.body;
    try {
        const { pass } = getJson();
        res.json({ access : password === pass });
    } catch (err) {
        console.error(err);
        res.status(500);
    }
})

app.get('/InteractiveMapStalker/api/getZone', (req, res) => {
    try {
        const { data } = getJson();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

app.post('/InteractiveMapStalker/api/setZone', async (req, res) => {
    const { coordinate, faction } = req.body;

    try {
        const file = getJson();

        const newData = file.data.map(coords =>
            coords.coordinates === coordinate
                ? { ...coords, faction: faction}
                : coords
        );

        await fs.writeFile('data.json', JSON.stringify({...file, data: newData}), (err) => {
            if (err) return console.error(err);
            console.log(`done => ${coordinate} : ${faction}`);
        });
        res.json({status : 200});
    } catch (err) {
        console.error(err);
        res.status(500);
    }

});

const backupFnc = async () => {
    const date = new Date();
    fs.copyFile("data.json", `./backup/data_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}.json`, (err) => {
        console.log('copied');
        if (err) {
            console.log("Error Found:", err);
        }
    });
};

new CronJob('0 0 6 * * *', backupFnc, null, true, 'Europe/Paris');
new CronJob('0 0 20 * * *', backupFnc, null, true, 'Europe/Paris');

app.listen(8080, () => {
    console.log('listening on port 8080');
})
