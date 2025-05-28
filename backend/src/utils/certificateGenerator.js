const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Đăng ký font
registerFont(path.join(__dirname, '../assets/fonts/OpenSans-Regular.ttf'), { family: 'Open Sans' });
registerFont(path.join(__dirname, '../assets/fonts/OpenSans-Bold.ttf'), { family: 'Open Sans Bold' });

async function generateCertificate(data) {
  const {
    studentName,
    courseName,
    date,
    certificateId,
    verifyUrl
  } = data;

  // Tạo canvas
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Thiết lập background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Thêm viền
  ctx.strokeStyle = '#0984e3';
  ctx.lineWidth = 20;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Thêm logo hoặc hình ảnh nếu cần
  try {
    const logo = await loadImage(path.join(__dirname, '../assets/images/logo.png'));
    ctx.drawImage(logo, width / 2 - 100, 80, 200, 100);
  } catch (err) {
    console.error('Logo load error:', err);
  }

  // Thiết lập tiêu đề chứng chỉ
  ctx.font = 'bold 50px "Open Sans Bold"';
  ctx.fillStyle = '#2d3436';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 250);

  // Thêm nội dung
  ctx.font = 'bold 30px "Open Sans Bold"';
  ctx.fillText('This is to certify that', width / 2, 350);

  ctx.font = 'bold 40px "Open Sans Bold"';
  ctx.fillStyle = '#0984e3';
  ctx.fillText(studentName, width / 2, 420);

  ctx.font = '30px "Open Sans"';
  ctx.fillStyle = '#2d3436';
  ctx.fillText('has successfully completed the course', width / 2, 480);

  ctx.font = 'bold 40px "Open Sans Bold"';
  ctx.fillStyle = '#0984e3';
  ctx.fillText(courseName, width / 2, 550);

  ctx.font = '25px "Open Sans"';
  ctx.fillStyle = '#2d3436';
  ctx.fillText(`Issued on: ${date}`, width / 2, 620);
  ctx.fillText(`Certificate ID: ${certificateId}`, width / 2, 660);

  // Thêm QR code cho xác minh
  try {
    const qrCodeDataURL = await QRCode.toDataURL(verifyUrl);
    const qrImage = await loadImage(qrCodeDataURL);
    ctx.drawImage(qrImage, width - 200, height - 200, 150, 150);
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // Lưu chứng chỉ vào file
  const fileName = `certificate_${certificateId}.png`;
  const filePath = path.join(__dirname, `../public/certificates/${fileName}`);
  
  // Đảm bảo thư mục tồn tại
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  const pngStream = canvas.createPNGStream();
  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(fileName));
    stream.on('error', reject);
    pngStream.pipe(stream);
  });
}

module.exports = generateCertificate;