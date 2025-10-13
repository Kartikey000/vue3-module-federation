# New Relic Monitoring for Module Federation

## 📊 Overview

This guide explains how to monitor your micro-frontend application using New Relic Browser Monitoring, based on the article: [Monitor and optimize complex web apps with New Relic](https://newrelic.com/blog/how-to-relic/monitor-and-optimize-complex-web-apps-with-new-relic)

Our implementation tracks:
- **Platform Total Load Time (PTLT)** - Overall host application load time
- **Component Total Load Time (CTLT)** - Individual component load times
- **Component Asset Load Time (CALT)** - Remote module asset loading
- **Component Data Load Time (CDLT)** - Data fetching times

## 🎯 Key Metrics Tracked

### Host App Metrics
- `host:platform:PTLT` - Platform initialization and mount time
- `host:ListUser:CTLT` - List User component total load time
- `host:CreateUpdateUser:CTLT` - Create/Update User component load time
- `host:remote:listUserApp:CALT` - List User remote asset load time
- `host:remote:createUserApp:CALT` - Create User remote asset load time

### Why These Metrics Matter

According to the New Relic article, these metrics help you:
1. **Identify bottlenecks** across components and teams
2. **Pinpoint ownership** of performance issues
3. **Track improvements** over time with data-driven insights
4. **Set alerts** for performance degradation
5. **Understand real-world performance** across all users

## 🚀 Quick Start (Without New Relic Account)

The performance monitoring is **already working** and logging to your browser console!

### View Performance Metrics Now

1. Open your browser DevTools (F12)
2. Navigate to `/users` or `/users/create`
3. Check the Console tab for performance logs:
   ```
   [Performance] host:remote:listUserApp:CALT: 145.30ms
   [Performance] host:ListUser:CTLT: 234.50ms
   [Performance] host:PTLT: 1234.25ms
   ```

4. Go to the **Performance** tab in DevTools
5. Record a profile while navigating
6. You'll see custom marks and measures in the timeline!

### View All Measures Programmatically

Open browser console and run:
```javascript
// Get all performance measures
performance.getEntriesByType('measure')
  .filter(e => e.name.startsWith('host:'))
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(2)}ms`))
```

## 📦 Setup New Relic Account (Optional but Recommended)

### Step 1: Create New Relic Account

1. Go to [New Relic](https://newrelic.com/)
2. Sign up for a free account (100GB/month included)
3. Complete the onboarding

### Step 2: Add Browser Monitoring

1. Log into New Relic
2. Click **"Add Data"** from navigation
3. Select **"Browser & Mobile"**
4. Select **"Browser monitoring"**
5. Choose **"Copy/Paste"** deployment method
6. Name your app: **"Host App"**
7. Click **"Enable"**

### Step 3: Get Your Credentials

From the Browser monitoring setup, copy these values:
- **Account ID**
- **Application ID**
- **License Key**
- **Agent ID**
- **Trust Key**

### Step 4: Configure Environment Variables

Update `host-app/.env.production`:

```bash
# New Relic Browser Monitoring
VITE_NEW_RELIC_ACCOUNT_ID=your_account_id
VITE_NEW_RELIC_LICENSE_KEY=your_license_key
VITE_NEW_RELIC_APPLICATION_ID=your_app_id
VITE_NEW_RELIC_TRUST_KEY=your_trust_key
VITE_NEW_RELIC_AGENT_ID=your_agent_id
```

### Step 5: Enable New Relic in Code

In `host-app/src/main.ts`, uncomment the New Relic initialization code:

```typescript
import { initNewRelic } from './newrelic-config'

if (import.meta.env.VITE_NEW_RELIC_LICENSE_KEY) {
  initNewRelic({
    accountId: import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_NEW_RELIC_TRUST_KEY,
    agentID: import.meta.env.VITE_NEW_RELIC_AGENT_ID,
    licenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_NEW_RELIC_APPLICATION_ID,
  })
}
```

### Step 6: Deploy and Verify

1. Set environment variables in Vercel
2. Deploy your application
3. Visit your app to generate data
4. Go to New Relic → Browser → Your App
5. View **BrowserPerformance** events

## 📈 Querying Your Data in New Relic

Once data is flowing to New Relic, use NRQL queries:

### View All Performance Measures
```sql
FROM BrowserPerformance 
SELECT * 
WHERE appName = 'Host App' 
AND entryName = 'measure'
```

### Get Average Component Load Times
```sql
FROM BrowserPerformance 
SELECT average(duration) 
WHERE appName = 'Host App' 
AND name LIKE '%:CTLT'
FACET name
```

### Track Platform Load Time Over Time
```sql
FROM BrowserPerformance 
SELECT average(duration) as 'Avg Load Time (ms)'
WHERE appName = 'Host App' 
AND name = 'host:PTLT'
TIMESERIES
```

### Find Slowest Components
```sql
FROM BrowserPerformance 
SELECT max(duration) as 'Max Load Time (ms)', 
       average(duration) as 'Avg Load Time (ms)',
       count(*) as 'Sample Count'
WHERE appName = 'Host App' 
AND name LIKE '%:CALT'
FACET name
```

### Remote Component Performance
```sql
FROM BrowserPerformance 
SELECT average(duration) as 'Load Time (ms)'
WHERE appName = 'Host App' 
AND name LIKE '%:remote:%:CALT'
FACET name
TIMESERIES
```

## 📊 Creating Dashboards

### 1. Overall Performance Dashboard

Create a dashboard with these widgets:

**Widget 1: Platform Load Time**
```sql
FROM BrowserPerformance 
SELECT average(duration) 
WHERE name = 'host:PTLT'
TIMESERIES
```

**Widget 2: Component Load Times**
```sql
FROM BrowserPerformance 
SELECT average(duration) 
WHERE name LIKE '%:CTLT'
FACET name
```

**Widget 3: Remote Asset Load**
```sql
FROM BrowserPerformance 
SELECT average(duration) 
WHERE name LIKE '%:CALT'
FACET name
```

### 2. Set Up Alerts

**Alert for Slow Component Load:**
```sql
FROM BrowserPerformance 
SELECT average(duration) 
WHERE name LIKE '%:CTLT'
```

Set threshold: Alert when average duration > 500ms for 5 minutes

## 🔧 Advanced Usage

### Adding Custom Metrics

In your components, use the performance monitor:

```typescript
import { perfMonitor } from '../utils/performance-monitoring'

// Track data fetching
async function fetchUserData() {
  perfMonitor.markDataFetchStart('UserList')
  
  const data = await api.getUsers()
  
  perfMonitor.markDataFetchEnd('UserList')
  return data
}
```

### Component-Level Monitoring

For remote components, add monitoring in their own code:

```typescript
// In list-user-app/src/components/ListUser.vue
import { onMounted } from 'vue'

onMounted(() => {
  performance.mark('listUserApp:ListUser:mounted')
})
```

## 📋 Performance Metrics Reference

| Metric | Description | Target |
|--------|-------------|--------|
| **PTLT** (Platform Total Load Time) | Time from start to app mount | < 1000ms |
| **CTLT** (Component Total Load Time) | Time to load and render component | < 500ms |
| **CALT** (Component Asset Load Time) | Time to download remote module | < 200ms |
| **CDLT** (Component Data Load Time) | Time for API/data fetching | < 300ms |

## 🐛 Troubleshooting

### Issue: No Performance Data in Console

**Check:**
1. Open DevTools before navigating
2. Ensure you're on a route that loads remote components (`/users` or `/users/create`)
3. Check for JavaScript errors

### Issue: Marks Not Showing in DevTools

**Solution:**
1. Go to Performance tab
2. Click Record
3. Navigate to a page
4. Stop recording
5. Look for "User Timing" track

### Issue: New Relic Not Receiving Data

**Check:**
1. Environment variables are set correctly
2. License key is valid
3. Browser console for New Relic errors
4. Network tab - look for calls to `bam.nr-data.net`

### Issue: BrowserPerformance Events Not Appearing

**Verify:**
1. Browser agent version is >= 1.261.0
2. Marks and measures are being created (check console)
3. Wait 5-10 minutes for data to appear in New Relic
4. Check NRQL query syntax

## 📖 Additional Resources

- [New Relic Blog Article](https://newrelic.com/blog/how-to-relic/monitor-and-optimize-complex-web-apps-with-new-relic)
- [Browser Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [New Relic Browser Agent Docs](https://docs.newrelic.com/docs/browser/)
- [NRQL Query Language](https://docs.newrelic.com/docs/query-your-data/nrql-new-relic-query-language/)

## 🎯 Best Practices

1. **Start Local** - Use browser DevTools first before New Relic
2. **Set Baselines** - Measure performance before optimization
3. **Monitor Continuously** - Set up alerts for regressions
4. **Track by Team** - Use naming conventions to identify ownership
5. **Review Regularly** - Weekly performance reviews
6. **Optimize Incrementally** - Focus on biggest bottlenecks first
7. **Document Changes** - Note what optimizations were made

## 🚀 Next Steps

1. ✅ **Already Done**: Performance monitoring is active!
2. **Optional**: Create New Relic account for centralized monitoring
3. **Create Dashboards**: Build custom views for your team
4. **Set Alerts**: Get notified of performance degradation
5. **Optimize**: Use data to improve load times
6. **Share**: Show team performance improvements

## 💡 Pro Tips

- Use the Performance tab in Chrome DevTools to visualize marks and measures
- Set up Slack/email alerts for performance degradation
- Compare performance across different user segments
- Track performance improvements after each deploy
- Use A/B testing to measure optimization impact

Happy monitoring! 📊🚀

