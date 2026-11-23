const nodemailer = require('nodemailer');

let cachedTransporter = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const passLimpio = process.env.EMAIL_PASS.replace(/\s+/g, '');
    const isGmail = (process.env.EMAIL_HOST || '').includes('gmail') || (process.env.EMAIL_USER || '').includes('gmail');

    if (isGmail) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: passLimpio
        }
      });
    } else {
      cachedTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: passLimpio
        }
      });
    }
    console.log(`📧 [Nodemailer] Transporter configurado con ${process.env.EMAIL_USER}`);
    return cachedTransporter;
  }

  // Fallback de desarrollo con cuenta de prueba Ethereal
  console.log('⚠️ [Nodemailer] Usando cuenta de prueba Ethereal para envíos...');
  const testAccount = await nodemailer.createTestAccount();
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  return cachedTransporter;
}

async function enviarCorreoInvitacion({ correoElect, nombreApe, boda, urlUbicacion }) {
  const transporter = await getTransporter();

  const fechaFormateada = boda && boda.fechaHoraPlanif
    ? new Date(boda.fechaHoraPlanif).toLocaleString('es-AR', {
        dateStyle: 'full',
        timeStyle: 'short'
      })
    : 'Próximamente';

  const pareja = boda && Array.isArray(boda.novios) && boda.novios.length > 0
    ? boda.novios.map(n => n.nombreApe).join(' & ')
    : 'Nuestra Boda';

  const mapsUrl = urlUbicacion || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Mozzafiato Salon de Eventos')}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Invitación a Boda</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f7f4ef; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e8dec8;">
        <!-- Cabecera -->
        <tr>
          <td align="center" style="background-color: #d4a373; padding: 35px 20px; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 300;">MOZZAFIATO</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Invitación Especial</p>
          </td>
        </tr>
        
        <!-- Contenido -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <p style="font-size: 18px; margin: 0 0 15px 0; color: #b57945; font-weight: bold;">
              ¡Hola, ${nombreApe}!
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; color: #555555;">
              Tenemos el inmenso placer de invitarte a celebrar la boda de:
            </p>
            
            <div style="background-color: #faf5ed; border: 1px dashed #d4a373; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h2 style="margin: 0; color: #8c5828; font-size: 24px; font-style: italic;">
                💍 ${pareja} 💍
              </h2>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #666666;">
                📅 <strong>Fecha y Hora:</strong> ${fechaFormateada}
              </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 25px 0; color: #555555;">
              ¡Tu presencia hará que este momento sea verdaderamente inolvidable! Para ver la ubicación del evento y cómo llegar, hacé clic en el siguiente botón:
            </p>

            <!-- Botón de Google Maps -->
            <div>
              <a href="${mapsUrl}" target="_blank" style="display: inline-block; background-color: #d4a373; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">
                📍 Ver Ubicación en Google Maps
              </a>
            </div>
          </td>
        </tr>

        <!-- Pie de página -->
        <tr>
          <td align="center" style="background-color: #f2eee8; padding: 20px; font-size: 12px; color: #888888; border-top: 1px solid #e5ded5;">
            <p style="margin: 0;">Mozzafiato - Gestión Integral de Bodas y Eventos</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Mozzafiato Eventos" <no-reply@mozzafiato.com>',
    to: correoElect,
    subject: `💍 Invitación a la Boda de ${pareja} - Mozzafiato`,
    html: htmlContent
  });

  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) {
    console.log(`✉️ Email de prueba enviado a ${correoElect}: URL de vista previa: ${preview}`);
  }

  return { info, previewUrl: preview };
}

module.exports = {
  enviarCorreoInvitacion
};
