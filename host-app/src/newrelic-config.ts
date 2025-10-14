// newrelic-config.ts
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

export interface NewRelicConfig {
  licenseKey: string
  applicationID: string
  accountId?: string
  trustKey?: string
  agentID?: string
  region?: 'us' | 'eu' // default: us
}

export function initNewRelic(config: NewRelicConfig) {
  try {

    const beacon = config.region === 'eu' ? 'bam.eu01.nr-data.net' : 'bam.nr-data.net'

    const options = {
      init: {
        // Distributed Tracing: Track requests across your entire stack
        distributed_tracing: { 
          enabled: true,
          cors_use_newrelic_header: true,
          cors_use_tracecontext_headers: true,
          allowed_origins: []
        },
        
        // Privacy settings
        privacy: { 
          cookies_enabled: true 
        },
        
        // AJAX monitoring: Track all AJAX/Fetch requests
        ajax: { 
          deny_list: [],
          enabled: true,
          harvestTimeSeconds: 10
        },
        
        // JavaScript Error Analytics: Track all JS errors
        jserrors: {
          enabled: true,
          harvestTimeSeconds: 10
        },
        
        // Metrics for core web vitals and performance
        metrics: {
          enabled: true
        },
        
        // Page Action: Track custom user interactions
        page_action: {
          enabled: true
        },
        
        // Page View Event: Track page views and navigation
        page_view_event: {
          enabled: true
        },
        
        // Page View Timing: Detailed page load timing
        page_view_timing: {
          enabled: true,
          harvestTimeSeconds: 30
        },
        
        // Session Replay: Visual replay of user sessions (can be disabled for privacy)
        session_replay: { 
          enabled: true,
          block_selector: '',
          mask_text_selector: '*',
          sampling_rate: 10.0,
          error_sampling_rate: 100.0,
          mask_all_inputs: true,
          collect_fonts: true,
          inline_images: false,
          inline_stylesheet: true
        },
        
        // Session Trace: Detailed interaction traces
        session_trace: { 
          enabled: true,
          harvestTimeSeconds: 10
        },
        
        // Single Page Application (SPA) monitoring
        spa: {
          enabled: true,
          harvestTimeSeconds: 10
        },
        
        // Soft Navigation: Track client-side route changes
        soft_navigations: {
          enabled: true,
          harvestTimeSeconds: 10
        }
      },
      
      info: {
        beacon,
        errorBeacon: beacon,
        licenseKey: config.licenseKey,
        applicationID: config.applicationID,
        sa: 1,
      },
      loader_config: {
        accountID: config.accountId || '',
        trustKey: config.trustKey || '',
        agentID: config.agentID || '',
        licenseKey: config.licenseKey,
        applicationID: config.applicationID,
      },
    }

    // The agent loader code executes immediately on instantiation
    new BrowserAgent(options)

    console.log('[New Relic] Browser agent initialized ✅')
  } catch (error) {
    console.error('[New Relic] Failed to initialize:', error)
  }
}
