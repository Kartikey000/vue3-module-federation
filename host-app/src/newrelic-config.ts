// New Relic Browser Agent Configuration
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

// Performance monitoring configuration for Module Federation
export interface NewRelicConfig {
  accountId: string
  trustKey: string
  agentID: string
  licenseKey: string
  applicationID: string
}

export function initNewRelic(config: NewRelicConfig) {
  // Initialize New Relic Browser Agent
  const options = {
    init: {
      distributed_tracing: { enabled: true },
      privacy: { cookies_enabled: true },
      ajax: { deny_list: [] }
    },
    info: {
      beacon: 'bam.nr-data.net',
      errorBeacon: 'bam.nr-data.net',
      licenseKey: config.licenseKey,
      applicationID: config.applicationID,
      sa: 1
    },
    loader_config: {
      accountID: config.accountId,
      trustKey: config.trustKey,
      agentID: config.agentID,
      licenseKey: config.licenseKey,
      applicationID: config.applicationID
    }
  }

  // Create and start the agent
  new BrowserAgent(options)

  console.log('[New Relic] Browser agent initialized')
}
