const express = require('express');
const router = express.Router();
const { validateCredentials } = require('../middleware/auth');

// POST /api/login - Authenticate user
router.post('/login', validateCredentials);

// POST /api/validate-session - Check if credentials are still valid
router.post('/validate-session', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const credentials = Buffer.from(token, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        const expectedHash = crypto.createHash('sha256').update('Dive9852&aPRISMATIC').digest('hex');

        if (username === 'prismaticsport' && passwordHash === expectedHash) {
            return res.json({
                success: true,
                message: 'Session valid'
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid session'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token format'
        });
    }
});

module.exports = router;
