const bookingService = require('../services/bookingService');

/**
 * Booking Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Send booking request email
exports.sendBookingRequest = async (req, res) => {
    try {
        const result = await bookingService.sendBookingRequest(req.body);

        if (result.isDevelopmentMode) {
            return res.json({
                success: true,
                message: 'Solicitud recibida (modo desarrollo - correo no configurado)'
            });
        }

        res.json({
            success: true,
            message: 'Solicitud de reserva enviada exitosamente'
        });

    } catch (error) {
        if (error.message === 'Faltan campos requeridos') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Send booking email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar la solicitud de reserva: ' + error.message
        });
    }
};
