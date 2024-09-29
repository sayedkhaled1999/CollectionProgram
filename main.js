const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // إذا كنت تستخدم nodeIntegration
        },
    });

    // قم بتحميل الصفحة الرئيسية
    win.loadFile(path.join(__dirname, 'collectionprogram', 'index.html'));
}

// إعداد IPC للتنقل بين الصفحات
ipcMain.on('load-page', (event, page) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile(path.join(__dirname, 'collectionprogram', page));
});

// تشغيل التطبيق
app.whenReady().then(createWindow);

// التحقق من وجود النوافذ المفتوحة عند إغلاق التطبيق
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// إعادة إنشاء النافذة عند النقر على أيقونة التطبيق (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
