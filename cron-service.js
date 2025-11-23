/**
 * Cron Job Service
 * Configurable cron job that calls a URL at specified intervals
 * 
 * Configuration via environment variables:
 * - CRON_ENABLED: Set to 'true' to enable the cron job (default: false)
 * - CRON_SCHEDULE: Cron expression (default: every 10 minutes)
 * - CRON_URL: URL to call (default: uses internal keep-alive)
 * - CRON_METHOD: HTTP method (default: 'GET')
 * - CRON_TIMEOUT: Request timeout in ms (default: 30000)
 * 
 * Cron Schedule Format: minute hour day month weekday
 * Examples:
 * - Every 5 minutes: schedule every 5 mins
 * - Every 10 minutes: schedule every 10 mins
 * - Every hour at minute 0: hourly schedule
 * - Every 2 hours: every 2 hour schedule
 * - Every day at midnight: daily schedule
 * - Every weekday at 9 AM: weekday morning schedule
 * - Every 30 minutes between 9 AM and 5 PM: business hours schedule
 */

const cron = require('node-cron');
const http = require('http');
const https = require('https');

class CronService {
    constructor() {
        this.task = null;
        this.stats = {
            enabled: false,
            schedule: null,
            url: null,
            method: 'GET',
            totalRuns: 0,
            successCount: 0,
            failureCount: 0,
            lastRunTime: null,
            lastRunStatus: null,
            lastRunDuration: null,
            nextRunTime: null,
            startedAt: null
        };
    }

    /**
     * Initialize and start the cron job
     * @param {Object} config - Configuration object
     * @param {string} config.schedule - Cron expression (e.g., every 10 minutes)
     * @param {string} config.url - URL to call
     * @param {string} config.method - HTTP method (GET, POST, etc.)
     * @param {number} config.timeout - Request timeout in milliseconds
     */
    start(config = {}) {
        // Get configuration from environment variables or config object
        const enabled = process.env.CRON_ENABLED === 'true' || config.enabled;
        const schedule = config.schedule || process.env.CRON_SCHEDULE || '*/10 * * * *';
        const url = config.url || process.env.CRON_URL || this._getDefaultUrl();
        const method = config.method || process.env.CRON_METHOD || 'GET';
        const timeout = parseInt(config.timeout || process.env.CRON_TIMEOUT || '30000');

        if (!enabled) {
            console.log('⏱️  Cron Service: Disabled (set CRON_ENABLED=true to enable)');
            return;
        }

        // Validate cron expression
        if (!cron.validate(schedule)) {
            console.error('❌ Invalid cron schedule:', schedule);
            return;
        }

        // Update stats
        this.stats.enabled = true;
        this.stats.schedule = schedule;
        this.stats.url = url;
        this.stats.method = method;
        this.stats.startedAt = new Date().toISOString();

        console.log('\n═══════════════════════════════════════════════');
        console.log('⏱️  CRON SERVICE STARTING');
        console.log('═══════════════════════════════════════════════');
        console.log(`📅 Schedule: ${schedule}`);
        console.log(`🌐 Target URL: ${url}`);
        console.log(`📝 Method: ${method}`);
        console.log(`⏰ Timeout: ${timeout}ms`);
        console.log(`🕐 Started at: ${this.stats.startedAt}`);
        console.log('═══════════════════════════════════════════════\n');

        // Create and start the cron task
        this.task = cron.schedule(schedule, async () => {
            await this._executeJob(url, method, timeout);
        });

        console.log('✅ Cron job scheduled successfully!');
        console.log(`⏭️  Next run: ${this._getNextRunTime()}\n`);
    }

    /**
     * Execute the cron job
     */
    async _executeJob(url, method, timeout) {
        const startTime = Date.now();
        this.stats.totalRuns++;
        this.stats.lastRunTime = new Date().toISOString();

        console.log(`\n🔄 [${this.stats.lastRunTime}] Cron Job #${this.stats.totalRuns} Executing...`);
        console.log(`   Target: ${method} ${url}`);

        try {
            const response = await this._makeRequest(url, method, timeout);
            const duration = Date.now() - startTime;

            this.stats.successCount++;
            this.stats.lastRunStatus = 'success';
            this.stats.lastRunDuration = duration;

            console.log(`✅ Success! Status: ${response.statusCode}, Duration: ${duration}ms`);
            if (response.data) {
                console.log(`   Response: ${response.data.substring(0, 200)}${response.data.length > 200 ? '...' : ''}`);
            }

        } catch (error) {
            const duration = Date.now() - startTime;

            this.stats.failureCount++;
            this.stats.lastRunStatus = 'failure';
            this.stats.lastRunDuration = duration;

            console.error(`❌ Failed! Error: ${error.message}, Duration: ${duration}ms`);
        }

        console.log(`📊 Stats: ${this.stats.successCount} success / ${this.stats.failureCount} failed / ${this.stats.totalRuns} total`);
        console.log(`⏭️  Next run: ${this._getNextRunTime()}\n`);
    }

    /**
     * Make HTTP/HTTPS request
     */
    _makeRequest(url, method, timeout) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const protocol = parsedUrl.protocol === 'https:' ? https : http;

            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname + parsedUrl.search,
                method: method,
                timeout: timeout,
                headers: {
                    'User-Agent': 'CronService/1.0'
                }
            };

            const req = protocol.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    /**
     * Get default URL (localhost or internal keep-alive)
     */
    _getDefaultUrl() {
        const port = process.env.PORT || 5000;
        return `http://localhost:${port}/keep-alive/status`;
    }

    /**
     * Get next run time (approximate)
     */
    _getNextRunTime() {
        if (!this.stats.schedule) return 'N/A';

        const now = new Date();
        const schedule = this.stats.schedule;

        // Parse the cron expression to estimate next run
        // This is a simple estimation for common patterns
        if (schedule.startsWith('*/')) {
            const minutes = parseInt(schedule.split(' ')[0].replace('*/', ''));
            const nextRun = new Date(now.getTime() + minutes * 60000);
            return nextRun.toLocaleString();
        }

        return 'Check cron schedule';
    }

    /**
     * Stop the cron job
     */
    stop() {
        if (this.task) {
            this.task.stop();
            console.log('⏹️  Cron job stopped');
            this.stats.enabled = false;
        }
    }

    /**
     * Get current statistics
     */
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.totalRuns > 0
                ? ((this.stats.successCount / this.stats.totalRuns) * 100).toFixed(2) + '%'
                : '0%'
        };
    }

    /**
     * Update cron schedule (requires restart)
     */
    updateSchedule(newSchedule) {
        if (!cron.validate(newSchedule)) {
            throw new Error('Invalid cron schedule');
        }

        if (this.task) {
            this.stop();
        }

        const config = {
            enabled: true,
            schedule: newSchedule,
            url: this.stats.url,
            method: this.stats.method
        };

        this.start(config);
    }

    /**
     * Update target URL (requires restart)
     */
    updateUrl(newUrl) {
        if (this.task) {
            this.stop();
        }

        const config = {
            enabled: true,
            schedule: this.stats.schedule,
            url: newUrl,
            method: this.stats.method
        };

        this.start(config);
    }
}

// Create singleton instance
const cronService = new CronService();

module.exports = cronService;
