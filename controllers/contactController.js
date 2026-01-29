const contactService = require('../services/contactService');

/**
 * Contact Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Send contact form message
exports.sendContactMessage = async (req, res) => {
    try {
        const result = await contactService.sendContactMessage(req.body);

        if (result.isDevelopmentMode) {
            return res.json({
                success: true,
                message: 'Mensaje recibido (modo desarrollo - correo no configurado)'
            });
        }

        res.json({
            success: true,
            message: 'Mensaje enviado exitosamente'
        });

    } catch (error) {
        if (error.message === 'Faltan campos requeridos') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error sending contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
        });
    }
};
