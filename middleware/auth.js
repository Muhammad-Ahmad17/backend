const crypto = require('crypto');

/**
 * Simple Authentication Middleware
 * Validates credentials against locally stored username and password
 */

// Securely stored credentials (hashed for basic security)
const CREDENTIALS = {
    username: 'prismaticsport',
    // Password: Dive9852&aPRISMATIC (stored as hash)
    passwordHash: crypto.createHash('sha256').update('Dive9852&aPRISMATIC').digest('hex')
};

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
            error: 'Missing or invalid authorization header'
        });
    }

    try {
        // Decode Basic Auth credentials
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Validate credentials
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        if (username === CREDENTIALS.username && passwordHash === CREDENTIALS.passwordHash) {
            // Authentication successful
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: 'Invalid credentials format'
        });
    }
};

/**
 * Endpoint to validate credentials (login)
 */
const validateCredentials = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    // Hash the provided password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Validate credentials
    if (username === CREDENTIALS.username && passwordHash === CREDENTIALS.passwordHash) {
        return res.json({
            success: true,
            message: 'Authentication successful',
            token: Buffer.from(`${username}:${password}`).toString('base64')
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
};

module.exports = {
    requireAuth,
    validateCredentials
};
