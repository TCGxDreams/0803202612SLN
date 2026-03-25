import XLSX from 'xlsx';
import QRCode from 'qrcode';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://sinhln2326.vercel.app';
const OUTPUT_DIR = '/Users/trongnhannguyenvu/vscode/08032026/qr-codes';

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const workbook = XLSX.readFile('/Users/trongnhannguyenvu/vscode/08032026/Qr code/Dev.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`Found ${data.length} students. Generating QR codes...\n`);

for (const row of data) {
  const mssh = row['MSSH'] || row['mssh'];
  const name = row['Họ và Tên'] || row['Ho va Ten'] || row['name'] || 'unknown';
  
  if (!mssh) { console.log(`⚠️  Skipping — no MSSH`); continue; }

  const url = `${BASE_URL}/${mssh}`;
  const safeName = name.replace(/[/\\?%*:|"<>]/g, '-').trim();
  const filePath = join(OUTPUT_DIR, `${safeName}.png`);

  try {
    await QRCode.toFile(filePath, url, {
      width: 512, margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' }
    });
    console.log(`✅ ${safeName}.png → ${url}`);
  } catch (err) {
    console.error(`❌ ${safeName}: ${err.message}`);
  }
}

console.log(`\n🎉 Done! QR codes saved to: ${OUTPUT_DIR}`);
