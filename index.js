const fs = require('fs');
const dFile = './Mimikara_Oboeru__Unit_8/deck.json';
const sFile = './VNJP/_mimi-kara-n3-goi_unit-8-bai-4.html.json';
fs.readFile(sFile, 'utf8', function (err, source) {
    if (err) {
        return console.log(err);
    }
    source = JSON.parse(source);

    fs.readFile(dFile, 'utf8', function (err, des) {
        if (err) {
            return console.log(err);
        }
        des = JSON.parse(des);
        des.notes.forEach(n => {
            let match = source.filter(e => e.expression.indexOf(n.fields[0]) > -1  || e.expression.indexOf(n.fields[3]) > -1);
            if (match.length > 0) {
                match = match[0];
                n.fields[0] = match.expression.length > 3 ? match.expression : n.fields[0];
                n.fields[2] = match.index;
                n.fields[6] = match.meaning;
                n.fields[7] = match.hanviet;
                n.fields[8] = match.lien;
                n.fields[9] = match.liennghia;
                n.fields[10] = match.hop;
                n.fields[11] = match.hopnghia;
                n.fields[12] = match.doi;
                n.fields[13] = match.doinghia;
                n.fields[14] = match.loai;
                n.fields[15] = match.loainghia;
                n.fields[16] = match.quan;
                n.fields[17] = match.quannghia;
                n.fields[18] = match.quans;
                n.fields[19] = match.quansnghia;
                n.fields[20] = match.danh;
                n.fields[21] = match.danhnghia;
                n.fields[22] = match.vidu;
                n.fields[23] = match.vidunghia;
                n.fields[25] = n.fields[25].replace(' style="text-align: left;"', '');
                match.index = 0;
            } else {
                console.log(n.fields[1] + ' ');
            }
        })
        // source.forEach(e => {
        //     let match = des.notes.filter(n => e.expression.indexOf(n.fields[0]) > -1 || e.expression.indexOf(n.fields[3]) > -1);
        //     console.log(match.length > 0 ? match[0].fields[0] : 'none',  e.expression);
        // })




        fs.writeFileSync(dFile, JSON.stringify(des));
        // console.log(des.notes);
    })
//    console.log(data.notes)
});
