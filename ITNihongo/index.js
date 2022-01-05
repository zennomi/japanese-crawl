const axios = require("axios");
const fs = require('fs');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

async function fetchHTML(url) {
    const { data } = await axios.get(url)
    return data;
}

const downloadMp3 = async (url, filename) => {
    try {
        let response = await axios.get(url, { responseType: "stream", httpsAgent: httpsAgent });
        response.data.pipe(fs.createWriteStream(`./ITNihongo/mp3/${filename}`));
        console.log(`Save to ./mp3/${filename}.`);
    }
    catch (err) {
        console.log(err);
    }
}

const main = async () => {
    const part = "12";

    try {
        let note = {}, word = {}, filename = "";
        let { sheet } = require(`./json/${part}.json`);
        for (let i = 0; i < sheet.length; i++) {
            note = sheet[i];
            word = await fetchHTML('https://jisho.org/api/v1/search/words?keyword=' + encodeURI(note.kotoba));
            if (word.meta.status === 200) {
                word = word.data[0] ? word.data[0].japanese[0] : { reading: note.kotoba.trim(), word: note.hiragana && note.hiragana.trim() };
                if (word.word) {
                    filename = "yomichan_audio_" + word.reading + "_" + word.word + ".mp3";
                    downloadMp3(`https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=${encodeURI(word.word)}&kana=${encodeURI(word.reading)}`, filename);
                } else {
                    filename = "yomichan_audio_" + word.reading + ".mp3";
                    downloadMp3(`https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=${encodeURI(word.reading)}`, filename);
                }
                note.audio = `[sound:${filename}]`;
            }
            else throw (`${note.kotoba} not found`);
            sheet[i] = {
                kotoba: fString(word.word),
                hiragana: fString(word.reading),
                audio: note.audio,
                betonamu: fString(note.betonamu),
                tsukaikata: fString(note.tsukaikata),
                ruiji: fString(note.ruiji),
                imi: fString(note.imi),
            };
            console.log(i);
        }
        fs.writeFileSync(`./ITNihongo/json/${part}-mp3.json`, JSON.stringify(sheet), { flag: 'w' });
    }
    catch (err) {
        console.log(err);
    }
}

main();

const fString = (string) => {
    if (!string) return "trống"
    return string.replace(/(?:\r\n|\r|\n)/g, '<br>');
}