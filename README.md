# Tabung Keluarga

Aplikasi rujukan keluarga untuk kutipan, perbelanjaan dan pinjaman. Rekod asal daripada Excel 2021 telah dimasukkan sebagai data sejarah, bukannya dipadam atau diarkib secara tersembunyi.

## Guna terus

1. Buka `index.html` dalam pelayar, atau hos folder ini menggunakan GitHub Pages / Netlify.
2. Tambah kutipan, perbelanjaan atau pinjaman melalui butang pada aplikasi.
3. Gunakan penapis tahun dan bulan untuk semakan pantas. Data tanpa Google Sheet disimpan pada peranti/pelayar sendiri.

## Kongsi data dengan kakak melalui Google Sheets

Ini langkah sekali sahaja supaya kedua-dua orang melihat data yang sama:

1. Cipta satu Google Sheet baharu, contohnya **Tabung Keluarga**.
2. Dalam Google Sheet, buka **Extensions → Apps Script**.
3. Salin semua kandungan `google-apps-script/Code.gs` ke dalam editor dan klik **Save**.
4. Jalankan fungsi `setup` sekali dan benarkan akses. Ia akan cipta tiga tab: `Contributions`, `Expenses`, dan `Loans`.
5. Klik **Deploy → New deployment → Web app**. Pilih *Execute as: Me* dan akses yang hanya meliputi ahli keluarga jika akaun Google mereka boleh digunakan. Jika memilih *Anyone*, sesiapa yang mengetahui URL boleh menulis data, jadi jangan siarkan pautan tersebut.
6. Dalam aplikasi, klik **Sambung Google Sheet** di bawah menu kiri, tampal URL tadi, kemudian klik **Sambung & segar semula**.
7. Hos folder aplikasi ini, kemudian kongsi pautan aplikasi dengan kakak. Kedua-dua pihak perlu tampal URL Google Apps Script yang sama pada kali pertama membuka aplikasi.

> Pada sambungan pertama, aplikasi akan menyalin rekod sejarah ke Sheet yang masih kosong. Selepas itu, tambah, padam, import, baki awal dan tahun baharu semuanya diselaraskan bersama. Jangan ubah susun atur tab Google Sheet secara manual ketika aplikasi sedang digunakan.

> Jika status menyebut **“Ada perubahan baharu — segar dahulu”**, seorang lagi baru menyimpan perubahan. Klik **Sambung Google Sheet** dan sambung semula URL untuk memuatkan data terkini sebelum menambah rekod seterusnya. Ini mengelakkan perubahan satu pihak menindih data pihak lain.

## Kata laluan disimpan di akaun sendiri

Selepas menampal `Code.gs`, buka **Project Settings** dalam Apps Script (ikon gear), pergi ke **Script properties**, lalu tambah property bernama `TABUNG_PASSWORD`. Nilainya ialah kata laluan pilihan awak. Jangan masukkan kata laluan itu dalam `Code.gs` atau dalam mana-mana sel Google Sheet.

Deploy versi Web App baharu selepas kemas kini skrip. Pada peranti baru, pengguna perlu tampal URL Web App pada halaman login sekali sahaja, kemudian masukkan kata laluan. Kata laluan tidak lagi berada dalam kod GitHub; sesi tamat selepas kira-kira enam jam atau apabila pengguna log keluar.

## Gambar keluarga

Tekan **Tukar gambar keluarga** pada Dashboard dan pilih gambar JPEG, PNG atau WebP. Gambar dikecilkan sebelum dimuat naik ke Google Drive pemilik Google Sheet, kemudian pautannya disimpan dalam `Settings` supaya ia muncul juga pada peranti kakak. Selepas kemas kini `Code.gs`, jalankan semula `setup` dan deploy versi Web App baharu supaya Google meminta kebenaran Google Drive sekali sahaja.

## Import fail lama

Pada menu **Arkib Rekod Tahun**, klik **Import Excel / CSV**. Format Excel kutipan yang sama seperti fail lama akan dibaca mengikut nama bulan. Semak hasil import sebelum menggunakannya sebagai rekod rasmi supaya tiada rekod berganda.
