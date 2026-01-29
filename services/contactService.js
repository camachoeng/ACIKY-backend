const nodemailer = require('nodemailer');

/**
 * Contact Service - Business logic layer
 * Handles contact form email sending
 */

class ContactService {
    /**
     * Create email transporter
     */
    _createTransporter() {
        // Check if Gmail credentials are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
                }
            });
        }

        return null;
    }

    /**
     * Send contact message email
     */
    async sendContactMessage(data) {
        const { name, email, phone, subject, message } = data;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            throw new Error('Faltan campos requeridos');
        }

        const transporter = this._createTransporter();

        // If no transporter (development mode), return early
        if (!transporter) {
            return { isDevelopmentMode: true };
        }

        // Subject mapping
        const subjectMap = {
            'clases': 'Información sobre clases',
            'espacios': 'Consulta sobre espacios',
            'instructores': 'Quiero ser instructor',
            'eventos': 'Eventos y retiros',
            'otros': 'Consulta general'
        };

        const subjectText = subjectMap[subject] || subject;

        // Email to ACIKY admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to ACIKY email
            replyTo: email, // Allow direct reply to sender
            subject: `Mensaje de Contacto: ${subjectText}`,
            html: this._buildContactEmailHtml({
                name,
                email,
                phone,
                subjectText,
                message
            })
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return { isDevelopmentMode: false };
    }

    /**
     * Build contact email HTML
     */
    _buildContactEmailHtml({ name, email, phone, subjectText, message }) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c5f4f;">Nuevo Mensaje de Contacto</h2>
                <p>Has recibido un nuevo mensaje desde el formulario de contacto de ACIKY:</p>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c5f4f;">Información del Remitente</h3>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
                    <p><strong>Asunto:</strong> ${subjectText}</p>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c5f4f;">Mensaje</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>

                <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                    Para responder, puedes hacer clic en "Responder" o enviar un email a: <a href="mailto:${email}">${email}</a>
                </p>
                <p style="color: #666; font-size: 0.9em;">
                    Este es un mensaje automático del sistema de contacto de ACIKY
                </p>
            </div>
        `;
    }
}

module.exports = new ContactService();
