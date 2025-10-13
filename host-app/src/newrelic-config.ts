// New Relic Browser Agent Configuration

// Performance monitoring configuration for Module Federation
export interface NewRelicConfig {
  licenseKey: string
  applicationID: string
  accountId?: string
  trustKey?: string
  agentID?: string
}

export async function initNewRelic(config: NewRelicConfig) {
  try {
    // Dynamically import the New Relic Browser Agent
    // @ts-ignore - Dynamic import handled at runtime
    const { default: BrowserAgent } = await import('@newrelic/browser-agent')
    
    // Initialize New Relic Browser Agent with all features enabled
    // Based on: https://docs.newrelic.com/docs/browser/browser-monitoring/
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
        beacon: 'bam.nr-data.net',
        errorBeacon: 'bam.nr-data.net',
        licenseKey: config.licenseKey,
        applicationID: config.applicationID,
        sa: 1
      },
      
      loader_config: {
        accountID: config.accountId || '',
        trustKey: config.trustKey || '',
        agentID: config.agentID || '',
        licenseKey: config.licenseKey,
        applicationID: config.applicationID
      }
    }

    // Create and start the agent
    new BrowserAgent(options)
    
    console.log('[New Relic] Browser agent initialized successfully with full monitoring')
    console.log('[New Relic] Application ID:', config.applicationID)
    console.log('[New Relic] Enabled Features:')
    console.log('  ✓ Distributed Tracing')
    console.log('  ✓ AJAX Monitoring')
    console.log('  ✓ JavaScript Error Tracking')
    console.log('  ✓ Core Web Vitals & Metrics')
    console.log('  ✓ Session Replay (10% sampling)')
    console.log('  ✓ Session Traces')
    console.log('  ✓ SPA Monitoring')
    console.log('  ✓ Page View Timing')
    console.log('  ✓ Custom Page Actions')
    console.log('  ✓ Soft Navigation Tracking')
  } catch (error) {
    console.error('[New Relic] Failed to initialize:', error)
    console.error('[New Relic] Make sure @newrelic/browser-agent is installed')
  }
}
