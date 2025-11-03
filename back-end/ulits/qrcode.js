import QRCode from 'qrcode';
import fs from 'fs';

const dir = './qrcodes';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const totalTables = 10;

for (let table = 1; table <= totalTables; table++) {
    const url = `http://localhost:5173/menu?table=${table}`;
    const fileName = `${dir}/table_${table}.png`;

    QRCode.toFile(fileName, url, { width: 300 }, (err) => {
        if (err) console.error(err);
        else console.log(`QR for table ${table} saved!`);
    });
}
