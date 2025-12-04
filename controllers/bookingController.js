const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
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
};

// Send booking request email
exports.sendBookingRequest = async (req, res) => {
    try {
        const { 
            activityName, 
            activitySchedule, 
            location, 
            instructorEmail,
            instructorName,
            userName, 
            userEmail, 
            userPhone,
            message 
        } = req.body;

        // Validate required fields
        if (!activityName || !instructorEmail || !userName || !userEmail) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        const transporter = createTransporter();

        if (!transporter) {
            return res.json({
                success: true,
                message: 'Solicitud recibida (modo desarrollo - correo no configurado)'
            });
        }

        // Email to instructor
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: instructorEmail,
            subject: `Nueva solicitud de reserva: ${activityName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c5f4f;">Nueva Solicitud de Reserva</h2>
                    <p>Hola ${instructorName},</p>
                    <p>Has recibido una nueva solicitud de reserva:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c5f4f;">Detalles de la Clase</h3>
                        <p><strong>Clase:</strong> ${activityName}</p>
                        <p><strong>Horario:</strong> ${activitySchedule || 'Por definir'}</p>
                        <p><strong>Ubicación:</strong> ${location || 'Por definir'}</p>
                    </div>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2c5f4f;">Información del Estudiante</h3>
                        <p><strong>Nombre:</strong> ${userName}</p>
                        <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
                        ${userPhone ? `<p><strong>Teléfono:</strong> ${userPhone}</p>` : ''}
                        ${message ? `<p><strong>Mensaje:</strong><br>${message}</p>` : ''}
                    </div>
                    
                    <p>Por favor, contacta al estudiante para confirmar la reserva.</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        Este es un mensaje automático de ACIKY - Asociación Cubana de Instructores de Kundalini Yoga
                    </p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Solicitud de reserva enviada exitosamente'
        });

    } catch (error) {
        console.error('Send booking email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar la solicitud de reserva: ' + error.message
        });
    }
};
