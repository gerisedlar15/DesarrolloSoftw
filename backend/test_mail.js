require('dotenv').config();
const nodemailer = require('nodemailer');

const passClean = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('Pass clean length:', passClean.length);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: passClean
  }
});

transporter.verify()
  .then(() => {
    console.log('✅ Conexión con Gmail verificada exitosamente!');
    return transporter.sendMail({
      from: `"Mozzafiato Eventos" <${process.env.EMAIL_USER}>`,
      to: 'gerisedlar15@gmail.com',
      subject: '💍 ¡Prueba de Invitación Real de Boda! - Mozzafiato',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; border: 2px solid #d4a373; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #b57945; margin-top: 0;">¡Llegó la invitación a tu casilla!</h2>
          <p>La configuración de Gmail en Mozzafiato está funcionando perfectamente.</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Mozzafiato+Eventos" style="background-color: #d4a373; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 15px;">
            📍 Ver Ubicación en Google Maps
          </a>
        </div>
      `
    });
  })
  .then(info => {
    console.log('✅ ¡CORREO ENVIADO A TU CASILLA DE GMAIL CON ÉXITO!');
    console.log('Message ID:', info.messageId);
  })
  .catch(err => {
    console.error('❌ Error de Gmail:', err.message);
  })
  .finally(() => {
    process.exit();
  });
