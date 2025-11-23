# Cron Service Documentation

## Overview
The Cron Service allows you to schedule automated HTTP requests to any URL at configurable intervals using standard cron expressions.

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# Enable/Disable Cron Service
CRON_ENABLED=true

# Cron Schedule (default: every 10 minutes)
CRON_SCHEDULE=*/10 * * * *

# Target URL (default: internal keep-alive endpoint)
CRON_URL=http://localhost:5000/keep-alive/status

# HTTP Method (default: GET)
CRON_METHOD=GET

# Request Timeout in milliseconds (default: 30000)
CRON_TIMEOUT=30000
```

## Cron Schedule Format

```
* * * * *
┬ ┬ ┬ ┬ ┬
│ │ │ │ └─ Day of Week (0-7) (0 and 7 are Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of Month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

### Common Schedule Examples

| Schedule | Description |
|----------|-------------|
| `*/5 * * * *` | Every 5 minutes |
| `*/10 * * * *` | Every 10 minutes |
| `*/15 * * * *` | Every 15 minutes |
| `*/30 * * * *` | Every 30 minutes |
| `0 * * * *` | Every hour at minute 0 |
| `0 */2 * * *` | Every 2 hours |
| `0 */6 * * *` | Every 6 hours |
| `0 0 * * *` | Every day at midnight |
| `0 12 * * *` | Every day at noon |
| `0 9 * * 1-5` | Every weekday at 9 AM |
| `0 0 * * 0` | Every Sunday at midnight |
| `*/30 9-17 * * *` | Every 30 min between 9 AM and 5 PM |

## API Endpoints

### 1. Get Cron Status
```bash
GET /cron/status
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "enabled": true,
    "schedule": "*/10 * * * *",
    "url": "http://localhost:5000/keep-alive/status",
    "method": "GET",
    "totalRuns": 5,
    "successCount": 5,
    "failureCount": 0,
    "lastRunTime": "2025-11-08T10:30:00.000Z",
    "lastRunStatus": "success",
    "lastRunDuration": 45,
    "startedAt": "2025-11-08T10:00:00.000Z",
    "successRate": "100.00%"
  }
}
```

### 2. Start Cron Service
```bash
POST /cron/start
Content-Type: application/json

{
  "schedule": "*/5 * * * *",
  "url": "https://example.com/api/health",
  "method": "GET",
  "timeout": 30000
}
```

### 3. Stop Cron Service
```bash
POST /cron/stop
```

### 4. Update Schedule
```bash
POST /cron/update-schedule
Content-Type: application/json

{
  "schedule": "*/15 * * * *"
}
```

### 5. Update Target URL
```bash
POST /cron/update-url
Content-Type: application/json

{
  "url": "https://example.com/api/ping"
}
```

## Usage Examples

### Example 1: Keep Your Server Alive (Free Hosting)
**Prevent free hosting services from sleeping:**

```env
CRON_ENABLED=true
CRON_SCHEDULE=*/10 * * * *
CRON_URL=http://localhost:5000/keep-alive/status
CRON_METHOD=GET
```

This will ping your server every 10 minutes to keep it active.

### Example 2: Health Check Every 5 Minutes
```env
CRON_ENABLED=true
CRON_SCHEDULE=*/5 * * * *
CRON_URL=https://your-app.com/api/health
CRON_METHOD=GET
```

### Example 3: Call External API Every Hour
```env
CRON_ENABLED=true
CRON_SCHEDULE=0 * * * *
CRON_URL=https://api.example.com/update
CRON_METHOD=POST
```

### Example 4: Daily Backup at 2 AM
```env
CRON_ENABLED=true
CRON_SCHEDULE=0 2 * * *
CRON_URL=http://localhost:5000/api/backup
CRON_METHOD=POST
```

### Example 5: Business Hours Monitoring
**Check every 30 minutes between 9 AM and 5 PM:**
```env
CRON_ENABLED=true
CRON_SCHEDULE=*/30 9-17 * * *
CRON_URL=http://localhost:5000/api/monitor
CRON_METHOD=GET
```

## Using the API

### Check Status with curl:
```bash
curl http://localhost:5000/cron/status
```

### Start Cron Job:
```bash
curl -X POST http://localhost:5000/cron/start \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "*/5 * * * *",
    "url": "http://localhost:5000/api/health"
  }'
```

### Stop Cron Job:
```bash
curl -X POST http://localhost:5000/cron/stop
```

### Update Schedule to Every 15 Minutes:
```bash
curl -X POST http://localhost:5000/cron/update-schedule \
  -H "Content-Type: application/json" \
  -d '{"schedule": "*/15 * * * *"}'
```

### Update Target URL:
```bash
curl -X POST http://localhost:5000/cron/update-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/api/ping"}'
```

## Programmatic Usage

### In Your Node.js Code:
```javascript
const cronService = require('./cron-service');

// Start with custom configuration
cronService.start({
  enabled: true,
  schedule: '*/5 * * * *',
  url: 'http://localhost:5000/api/health',
  method: 'GET',
  timeout: 30000
});

// Get statistics
const stats = cronService.getStats();
console.log('Success Rate:', stats.successRate);

// Update schedule
cronService.updateSchedule('*/15 * * * *');

// Update URL
cronService.updateUrl('https://example.com/api/ping');

// Stop the service
cronService.stop();
```

## Monitoring

The cron service provides detailed statistics:

- **Total Runs**: Number of times the job has executed
- **Success Count**: Number of successful requests
- **Failure Count**: Number of failed requests
- **Success Rate**: Percentage of successful runs
- **Last Run Time**: Timestamp of the last execution
- **Last Run Status**: Status of the last run (success/failure)
- **Last Run Duration**: How long the last request took (in ms)

## Console Output

When the cron job runs, you'll see output like:

```
═══════════════════════════════════════════════
⏱️  CRON SERVICE STARTING
═══════════════════════════════════════════════
📅 Schedule: */10 * * * *
🌐 Target URL: http://localhost:5000/keep-alive/status
📝 Method: GET
⏰ Timeout: 30000ms
🕐 Started at: 2025-11-08T10:00:00.000Z
═══════════════════════════════════════════════

✅ Cron job scheduled successfully!
⏭️  Next run: 11/8/2025, 10:10:00 AM

🔄 [2025-11-08T10:10:00.000Z] Cron Job #1 Executing...
   Target: GET http://localhost:5000/keep-alive/status
✅ Success! Status: 200, Duration: 45ms
   Response: {"success":true,"status":"active"}
📊 Stats: 1 success / 0 failed / 1 total
⏭️  Next run: 11/8/2025, 10:20:00 AM
```

## Important Notes

1. **Enable the Service**: Set `CRON_ENABLED=true` in your `.env` file
2. **Valid Cron Expression**: The service validates your cron schedule before starting
3. **Auto-Start**: The cron service starts automatically when your server starts
4. **Default URL**: If no URL is specified, it defaults to the internal keep-alive endpoint
5. **Timeouts**: Requests will timeout after the specified duration (default: 30 seconds)
6. **Error Handling**: Failed requests are logged and tracked in statistics

## Troubleshooting

### Cron Not Running?
- Check if `CRON_ENABLED=true` is set in `.env`
- Verify the cron schedule is valid using an online validator
- Check server logs for error messages

### Invalid Schedule Error?
- Use a cron expression validator (e.g., crontab.guru)
- Ensure all 5 fields are present: `minute hour day month weekday`

### Requests Failing?
- Check if the target URL is accessible
- Verify the HTTP method is correct
- Increase the timeout if needed
- Check server logs for detailed error messages

## Best Practices

1. **Start Simple**: Begin with a longer interval (e.g., every 10-15 minutes)
2. **Monitor Stats**: Regularly check `/cron/status` to ensure everything is working
3. **Set Appropriate Timeouts**: Don't set timeouts too low for slow APIs
4. **Use Environment Variables**: Keep configuration in `.env` for easy updates
5. **Test First**: Test your cron schedule before deploying to production

## Examples for Common Use Cases

### Keep Heroku/Render/Railway App Awake:
```env
CRON_ENABLED=true
CRON_SCHEDULE=*/10 * * * *
CRON_URL=https://your-app.herokuapp.com/
CRON_METHOD=GET
```

### Trigger Daily Database Cleanup:
```env
CRON_ENABLED=true
CRON_SCHEDULE=0 3 * * *
CRON_URL=http://localhost:5000/api/cleanup
CRON_METHOD=POST
```

### Sync Data Every 6 Hours:
```env
CRON_ENABLED=true
CRON_SCHEDULE=0 */6 * * *
CRON_URL=http://localhost:5000/api/sync
CRON_METHOD=POST
```

### Weekday Business Hours Health Check:
```env
CRON_ENABLED=true
CRON_SCHEDULE=*/15 9-17 * * 1-5
CRON_URL=http://localhost:5000/api/health
CRON_METHOD=GET
```
