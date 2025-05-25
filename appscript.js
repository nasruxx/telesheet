// kredensial
const spreadsheetId      = '1gzCIduo6iYxTz3IXmfIqtD0wCvs0r7n9H1yXFSDJh10'
const dataOrderSheetName = 'data'
const logSheetName       = 'log'

const botHandle      = '@sasyamall_bot'
const botToken       = 'bot_token'
const appsScriptUrl  = 'https://script.google.com/macros/s/AKfycbyFw_nTJ67S1sROi7wH7GFSVB6THPTPLkdEMQAoqF4-kZT5dQHIW4gw9Kk-Nj_O824rew/exec'
const telegramApiUrl = `https://api.telegram.org/bot${botToken}`


function log(logMessage = '') {
  // akses sheet
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const sheet       = spreadsheet.getSheetByName(logSheetName)
  const lastRow     = sheet.getLastRow()
  const row         = lastRow + 1

  // inisiasi nilai
  const today = new Date

  // insert row kosong
  sheet.insertRowAfter(lastRow)

  // insert data
  sheet.getRange(`A${row}`).setValue(today)
  sheet.getRange(`B${row}`).setValue(logMessage)
}


function formatDate(date) {
  const monthIndoList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

  const dateIndo  = date.getDate()
  const monthIndo = monthIndoList[date.getMonth()]
  const yearIndo  = date.getFullYear()

  const result = `${dateIndo} ${monthIndo} ${yearIndo}`

  return result
}


function sendTelegramMessage(chatId, replyToMessageId, textMessage) {
  // url kirim pesan
  const url = `${telegramApiUrl}/sendMessage`;
  
  // payload
  const data = {
    parse_mode              : 'HTML',
    chat_id                 : chatId,
    reply_to_message_id     : replyToMessageId,
    text                    : textMessage,
    disable_web_page_preview: true,
  }
  
  const options = {
    method     : 'post',
    contentType: 'application/json',
    payload    : JSON.stringify(data)
  }

  const response = UrlFetchApp.fetch(url, options).getContentText()
  return response;
}


function parseMessage(message = '') {
  // pisahkan berdasarkan karakter enter
  const splitted = message.split('\n')

  // inisiasi variabel
  let NamaPembeli = ''
  let NamaProduk  = ''
  let NoHp        = ''
  let NoWa        = ''
  let Alamat      = ''
  let Kelurahan   = ''
  let Kecamatan   = ''
  let Kabupaten   = ''
  let Provinsi    = ''
  let Total       = ''
  let Keterangan  = ''

  splitted.forEach(el => {
    if (el.includes('Nama Pembeli:')) {
      NamaPembeli = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Nama Produk:')) {
      NamaProduk = el.split(':')[1]?.trim() || '';
    } else if (el.includes('No Hp:')) {
      NoHp = el.split(':')[1]?.trim() || '';
    } else if (el.includes('No Wa:')) {
      NoWa = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Alamat:')) {
      Alamat = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Kelurahan:')) {
      Kelurahan = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Kecamatan:')) {
      Kecamatan = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Kabupaten:')) {
      Kabupaten = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Provinsi:')) {
      Provinsi = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Total:')) {
      Total = el.split(':')[1]?.trim() || '';
    } else if (el.includes('Keterangan:')) {
      Keterangan = el.split(':')[1]?.trim() || '';
    }
  })

  // kumpulkan hasil
  const result = {
    NamaPembeli: NamaPembeli,
    NamaProduk: NamaProduk,
    NoHp: NoHp,
    NoWa: NoWa,
    Alamat: Alamat,
    Kelurahan: Kelurahan,
    Kecamatan: Kecamatan,
    Kabupaten: Kabupaten,
    Provinsi: Provinsi,
    Total: Total,
    Keterangan: Keterangan,
  }

  // jika data kosong
  const isEmpty = (NamaPembeli === '' || NamaProduk === '' || NoHp === '' || NoWa === '' || Alamat === '' || Kelurahan === '' || Kecamatan === '' || Kabupaten === '' || Provinsi === '' || Total === '' || Keterangan === '')

  if (isEmpty) {
    return false;
  }

  return result;
}

function inputDataOrder(data) {
  try {
    // Akses sheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(dataOrderSheetName);
    const lastRow = sheet.getLastRow();
    const row = lastRow + 1;

    // Inisiasi nilai
    const number = lastRow;
    const idOrder = `ORD-${number}`;
    const today = new Date();

    // Validasi format data
    let errorMessage = '';

    if (!data.NamaPembeli) {
      errorMessage += "Nama Pembeli tidak boleh kosong.\n";
    }
    if (!data.NamaProduk) {
      errorMessage += "Nama Produk tidak boleh kosong.\n";
    }
    if (!data.NoHp || isNaN(data.NoHp)) {
      errorMessage += "Format Salah! Nomor telepon harus berupa angka dan tidak boleh kosong.\n";
    }
    if (!data.NoWa || isNaN(data.NoWa)) {
      errorMessage += "Format Salah! Nomor WhatsApp harus berupa angka dan tidak boleh kosong.\n";
    }
    if (!data.Total || isNaN(data.Total)) {
      errorMessage += "Format Salah! Total harus berupa angka dan tidak boleh kosong.\n";
    }

    if (errorMessage) {
      return errorMessage.trim(); // Mengembalikan pesan kesalahan jika ada
    }

    // Insert row kosong
    sheet.insertRowAfter(lastRow);

    // Insert data
    sheet.getRange(`A${row}`).setValue(idOrder);
    sheet.getRange(`B${row}`).setValue(today);
    sheet.getRange(`C${row}`).setValue(data.NamaPembeli);
    sheet.getRange(`D${row}`).setValue(data.NamaProduk);
    sheet.getRange(`E${row}`).setValue(data.NoHp);
    sheet.getRange(`F${row}`).setValue(data.NoWa);
    sheet.getRange(`G${row}`).setValue(data.Alamat);
    sheet.getRange(`H${row}`).setValue(data.Kelurahan);
    sheet.getRange(`I${row}`).setValue(data.Kecamatan);
    sheet.getRange(`J${row}`).setValue(data.Kabupaten);
    sheet.getRange(`K${row}`).setValue(data.Provinsi);
    sheet.getRange(`L${row}`).setValue(data.Total);
    sheet.getRange(`M${row}`).setValue(data.Keterangan);
    sheet.getRange(`N${row}`).setValue(data.chatId);
    sheet.getRange(`O${row}`).setValue(data.Username);

    // Jika berhasil, return idOrder
    return idOrder;

  } catch (err) {
    return false;
  }
}

function doPost(e) {
  try {
    // Urai pesan masuk
    const contents = JSON.parse(e.postData.contents);
    const chatId = contents.message.chat.id;
    const receivedTextMessage = contents.message.text.replace(botHandle, '').trim(); // hapus botHandle jika pesan berasal dari grup
    const messageId = contents.message.message_id;

    let messageReply = '';

    // 1. Jika pesan /start
    if (receivedTextMessage.toLowerCase() === '/start') {
      messageReply = `Halo! Selamat Datang Di Sistem Input Natasyamall.`;

    // 2. Jika pesan diawali dengan /input
    } else if (receivedTextMessage.split('\n')[0].toLowerCase() === '/input') {
      const parsedMessage = parseMessage(receivedTextMessage);

      if (parsedMessage) {
        const data = {
          NamaPembeli: parsedMessage['NamaPembeli'],
          NamaProduk: parsedMessage['NamaProduk'],
          NoHp: parsedMessage['NoHp'],
          NoWa: parsedMessage['NoWa'],
          Alamat: parsedMessage['Alamat'],
          Kelurahan: parsedMessage['Kelurahan'],
          Kecamatan: parsedMessage['Kecamatan'],
          Kabupaten: parsedMessage['Kabupaten'],
          Provinsi: parsedMessage['Provinsi'],
          Total: parsedMessage['Total'],
          Keterangan: parsedMessage['Keterangan'],
          chatId: chatId,
          Username: contents.message.from.username,
        };

        // Insert data ke sheet
        const idOrder = inputDataOrder(data);

        // Jika berhasil, tulis pesan balasan
        if (idOrder && typeof idOrder === 'string' && idOrder.startsWith("ORD-")) {
          messageReply = `Data berhasil disimpan dengan ID Order <b>${idOrder}</b>`;
        } else {
          messageReply = `😔Data gagal disimpan:\n${idOrder}`;
        }

      // 2b. Jika ada data yang kosong
      } else {
        messageReply = '😔Data Kosong Bosku';
      }

    // 3. Cek resi
    } else if (receivedTextMessage.split(' ')[0].toLowerCase() === '/resi') {
      // Ambil resi
      const resi = receivedTextMessage.split(' ')[1];

      // Ambil info
      messageReply = cekResi(resi);

    // 4. Format
    } else if (receivedTextMessage.toLowerCase() === '/format') {
      messageReply = `FORMAT INPUT. 

Silakan masukkan data sesuai dengan format berikut:
<pre>/input
Nama Pembeli:  
Nama Produk: 
No Hp: 
No Wa: 

Alamat: 
Kelurahan: 
Kecamatan: 
Kabupaten: 
Provinsi: 

Total: 
Keterangan: 
</pre>`;

    // 5. Perintah tidak ada
    } else {
      messageReply = `PERINTAH YANG ANDA KIRIM TIDAK ADA.

KIRIM PERINTAH /format UNTUK MELIHAT DAFTAR FORMAT INPUT YANG BENAR.`;
    }

    // Kirim pesan balasan
    sendTelegramMessage(chatId, messageId, messageReply);

  } catch (err) {
    log(err);
  }
}

function setWebhook() {
  // akses api
  const url      = `${telegramApiUrl}/setwebhook?url=${appsScriptUrl}`
  const response = UrlFetchApp.fetch(url).getContentText()
  
  Logger.log(response)
}
