const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// إعداد multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // مجلد التحميلات
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // إضافة توقيت فريد
    }
});

const upload = multer({ storage });

// نقطة نهاية لتحميل ملفات Excel
app.post('/upload', upload.single('file'), (req, res) => {
    const workbook = XLSX.readFile(req.file.path);
    const sheet_name = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheet_name];
    const data = XLSX.utils.sheet_to_json(sheet);
    res.json(data); // إرجاع البيانات كاستجابة
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
