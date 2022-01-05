const axios = require("axios");
const cheerio = require("cheerio")
const fs = require('fs');
const { mainModule } = require("process");
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

const readFile = async (path) => {
    return JSON.parse(await fs.readFileSync(path, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
    }))
}

async function fetchHTML(url) {
    const { data } = await axios.get(url)
    return data;
}

const downloadMp3 = async (url, filename) => {
    try {
        let response = await axios.get(url, {responseType: "stream", httpsAgent: httpsAgent} );
        response.data.pipe(fs.createWriteStream(`./GOI/mp3/${filename}`));
        console.log(`Save to ./GOI/mp3/${filename}.`);
    }
    catch(err) {
        console.log(err);
    }
}

const main = async () => {
    let path = "./GOI/_mimi-kara-n2-goi_unit-10-bai-4.html.json";
    try {
        let note = {}, word = {}, filename = "";
        let data = await readFile(path);
        for (let i = 0; i < data.length; i++) {
            note = data[i];
            word = await fetchHTML('https://jisho.org/api/v1/search/words?keyword=' + encodeURI(note.kanji));
            if (word.meta.status === 200) {
                word = word.data[0] ? word.data[0].japanese[0] : {reading: note.reading, word: note.kanji};
                if (word.word) {
                    filename = "yomichan_audio_" + word.reading + "_" + word.word + ".mp3";
                    downloadMp3(`https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=${encodeURI(word.word)}&kana=${encodeURI(word.reading)}`, filename);
                } else {
                    filename = "yomichan_audio_" + word.reading + ".mp3";
                    downloadMp3(`https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=${encodeURI(word.reading)}`, filename);
                }
                note.audio = `[sound:${filename}]`;
            }
            else throw (`${note.kanji} not found`);
            data[i] = {};
            data[i].expression = note.expression;
            data[i].reading = note.reading;
            data[i].index = note.index;
            data[i].kanji = note.kanji;
            data[i].illu = "";
            data[i].audio = note.audio;
            data[i].meaning = note.meaning;
            data[i].hanviet = note.hanviet;
            data[i].lien = note.lien;
            data[i].liennghia = note.liennghia;
            data[i].hop = note.hop;
            data[i].hopnghia = note.hopnghia;
            data[i].doi = note.doi;
            data[i].doinghia = note.doinghia;
            data[i].loai = note.loai;
            data[i].loainghia = note.loainghia;
            data[i].quan = note.quan;
            data[i].quannghia = note.quannghia;
            data[i].quans = note.quans;
            data[i].quansnghia = note.quansnghia;
            data[i].danh = note.danh;
            data[i].danhnghia = note.danhnghia;
            data[i].vidu = note.vidu;
            data[i].vidunghia = note.vidunghia;
            data[i].source = note.source || "";
            data[i].english = note.english || "";
        }
        fs.writeFileSync(path, JSON.stringify(data));
    }
    catch (err) {
        console.log(err);
    }
}

main();