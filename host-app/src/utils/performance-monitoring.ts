/**
 * Performance Monitoring Utilities for Module Federation
 * Based on New Relic's best practices for MFE monitoring
 * Reference: https://newrelic.com/blog/how-to-relic/monitor-and-optimize-complex-web-apps-with-new-relic
 * 
 * This utility creates performance marks and measures with custom attributes
 * that New Relic automatically collects as BrowserPerformance events.
 */

export interface PerformanceMetadata {
  team?: string
  componentType?: string
  version?: string
  release?: string
  [key: string]: any
}

export class PerformanceMonitor {
  private appName: string
  private teamName: string
  private version: string

  constructor(appName: string, teamName = 'platform', version = '1.0.0') {
    this.appName = appName
    this.teamName = teamName
    this.version = version
  }

  /**
   * Mark the start of a component load
   */
  markComponentLoadStart(componentName: string, metadata?: PerformanceMetadata): void {
    const markName = `${this.appName}:${componentName}:load:start`
    const detail = {
      team: this.teamName,
      version: this.version,
      componentName,
      measureType: 'CTLT',
      ...metadata
    }
    performance.mark(markName, { detail })
  }

  /**
   * Mark the end of a component load and create a measure with custom attributes
   * This creates a CTLT (Component Total Load Time) measure
   */
  markComponentLoadEnd(componentName: string, metadata?: PerformanceMetadata): void {
    const startMark = `${this.appName}:${componentName}:load:start`
    const endMark = `${this.appName}:${componentName}:load:end`
    const measureName = `${this.appName}:${componentName}:CTLT` // Component Total Load Time

    const detail = {
      team: this.teamName,
      version: this.version,
      componentName,
      measureType: 'CTLT',
      ...metadata
    }
    
    performance.mark(endMark, { detail })
    
    try {
      performance.measure(measureName, {
        start: startMark,
        end: endMark,
        detail
      })
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
        
        // Send to New Relic Browser Agent
        this.sendToNewRelic(measureName, measure.duration, detail)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Mark the start of platform load
   * PTLT = Platform Total Load Time
   */
  markPlatformLoadStart(metadata?: PerformanceMetadata): void {
    const markName = `${this.appName}:platform:load:start`
    const detail = {
      team: this.teamName,
      version: this.version,
      measureType: 'PTLT',
      ...metadata
    }
    performance.mark(markName, { detail })
  }

  /**
   * Mark the end of platform load and create PTLT measure
   * PTLT = Platform Total Load Time
   */
  markPlatformLoadEnd(metadata?: PerformanceMetadata): void {
    const startMark = `${this.appName}:platform:load:start`
    const endMark = `${this.appName}:platform:load:end`
    const measureName = `${this.appName}:PTLT` // Platform Total Load Time

    const detail = {
      team: this.teamName,
      version: this.version,
      measureType: 'PTLT',
      ...metadata
    }
    
    performance.mark(endMark, { detail })
    
    try {
      performance.measure(measureName, {
        start: startMark,
        end: endMark,
        detail
      })
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
        
        // Send to New Relic Browser Agent
        this.sendToNewRelic(measureName, measure.duration, detail)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Track remote component asset load time
   * CALT = Component Asset Load Time
   */
  markRemoteAssetLoadStart(remoteName: string, metadata?: PerformanceMetadata): void {
    const markName = `${this.appName}:remote:${remoteName}:asset:start`
    const detail = {
      team: this.teamName,
      version: this.version,
      remoteName,
      measureType: 'CALT',
      ...metadata
    }
    performance.mark(markName, { detail })
  }

  /**
   * Mark the end of remote asset load and create CALT measure
   * CALT = Component Asset Load Time
   */
  markRemoteAssetLoadEnd(remoteName: string, metadata?: PerformanceMetadata): void {
    const startMark = `${this.appName}:remote:${remoteName}:asset:start`
    const endMark = `${this.appName}:remote:${remoteName}:asset:end`
    const measureName = `${this.appName}:remote:${remoteName}:CALT` // Component Asset Load Time

    const detail = {
      team: this.teamName,
      version: this.version,
      remoteName,
      measureType: 'CALT',
      ...metadata
    }
    
    performance.mark(endMark, { detail })
    
    try {
      performance.measure(measureName, {
        start: startMark,
        end: endMark,
        detail
      })
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
        
        // Send to New Relic Browser Agent
        this.sendToNewRelic(measureName, measure.duration, detail)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Track data load time for components
   * CDLT = Component Data Load Time
   */
  markDataLoadStart(operationName: string, metadata?: PerformanceMetadata): void {
    const markName = `${this.appName}:${operationName}:data:start`
    const detail = {
      team: this.teamName,
      version: this.version,
      operationName,
      measureType: 'CDLT',
      ...metadata
    }
    performance.mark(markName, { detail })
  }

  /**
   * Mark the end of data load and create CDLT measure
   * CDLT = Component Data Load Time
   */
  markDataLoadEnd(operationName: string, metadata?: PerformanceMetadata): void {
    const startMark = `${this.appName}:${operationName}:data:start`
    const endMark = `${this.appName}:${operationName}:data:end`
    const measureName = `${this.appName}:${operationName}:CDLT` // Component Data Load Time

    const detail = {
      team: this.teamName,
      version: this.version,
      operationName,
      measureType: 'CDLT',
      ...metadata
    }
    
    performance.mark(endMark, { detail })
    
    try {
      performance.measure(measureName, {
        start: startMark,
        end: endMark,
        detail
      })
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
        
        // Send to New Relic Browser Agent
        this.sendToNewRelic(measureName, measure.duration, detail)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Mark the start of a user interaction
   */
  markInteractionStart(interactionName: string, metadata?: PerformanceMetadata): void {
    const markName = `${this.appName}:interaction:${interactionName}:start`
    const detail = {
      team: this.teamName,
      version: this.version,
      interactionName,
      ...metadata
    }
    performance.mark(markName, { detail })
  }

  /**
   * Mark the end of a user interaction and create a measure
   */
  markInteractionEnd(interactionName: string, metadata?: PerformanceMetadata): void {
    const startMark = `${this.appName}:interaction:${interactionName}:start`
    const endMark = `${this.appName}:interaction:${interactionName}:end`
    const measureName = `${this.appName}:interaction:${interactionName}:duration` // User Interaction Duration

    const detail = {
      team: this.teamName,
      version: this.version,
      interactionName,
      ...metadata
    }
    
    performance.mark(endMark, { detail })
    
    try {
      performance.measure(measureName, {
        start: startMark,
        end: endMark,
        detail
      })
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
        
        // Send to New Relic Browser Agent
        this.sendToNewRelic(measureName, measure.duration, detail)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Calculate and report Total Load Time (TLT)
   * This combines platform load time with component load times
   * TLT = Total Load Time
   */
  calculateTotalLoadTime(metadata?: PerformanceMetadata): void {
    try {
      const now = performance.now()
      const measureName = `${this.appName}:TLT` // Total Load Time
      
      const detail = {
        team: this.teamName,
        version: this.version,
        measureType: 'TLT',
        ...metadata
      }
      
      // Create a measure from navigation start to now
      performance.measure(measureName, {
        start: 0,
        end: now,
        detail
      })
      
          const measure = performance.getEntriesByName(measureName)[0]
          if (measure && measure.duration !== undefined) {
            console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`, detail)
            
            // Send to New Relic Browser Agent
            this.sendToNewRelic(measureName, measure.duration, detail)
            
            // Log summary of all measures
            this.logPerformanceSummary()
          }
    } catch (error) {
      console.warn('[Performance] Could not calculate TLT:', error)
    }
  }

  /**
   * Log a summary of all performance measures
   */
  logPerformanceSummary(): void {
    const measures = this.getAllMeasures()
    
    if (measures.length > 0) {
      console.group('[Performance Summary]')
      measures.forEach(measure => {
        console.log(`${measure.name}: ${measure.duration?.toFixed(2)}ms`)
      })
      console.groupEnd()
    }
  }

  /**
   * Get all performance measures for this app
   */
  getAllMeasures(): PerformanceEntry[] {
    return performance.getEntriesByType('measure')
      .filter(entry => entry.name.startsWith(`${this.appName}:`))
  }

  /**
   * Send performance data to New Relic Browser Agent
   */
  private sendToNewRelic(measureName: string, duration: number, metadata: PerformanceMetadata): void {
    try {
      // Check if New Relic is available
      if (typeof window !== 'undefined' && (window as any).newrelic) {
        const nr = (window as any).newrelic
        
        // Send as custom event with performance data
        if (typeof nr.addPageAction === 'function') {
          nr.addPageAction('PerformanceMeasure', {
            measureName,
            duration: Math.round(duration),
            measureType: metadata.measureType || 'unknown',
            team: metadata.team || this.teamName,
            version: metadata.version || this.version,
            ...metadata
          })
        }
        
        // Also send as custom attribute for aggregation
        if (typeof nr.setCustomAttribute === 'function') {
          nr.setCustomAttribute(`perf_${measureName.replace(/:/g, '_')}`, Math.round(duration))
          nr.setCustomAttribute(`perf_${metadata.measureType || 'unknown'}`, Math.round(duration))
        }
        
        console.log(`[New Relic] ✅ Sent performance data: ${measureName} (${duration.toFixed(2)}ms)`)
      } else {
        console.log(`[New Relic] ⚠️ Agent not available, performance data not sent: ${measureName}`)
      }
    } catch (error) {
      console.warn(`[New Relic] ❌ Failed to send performance data for ${measureName}:`, error)
    }
  }

  /**
   * Clear all performance marks and measures for this app
   */
  clearMeasures(): void {
    const entries = performance.getEntriesByType('measure')
      .concat(performance.getEntriesByType('mark'))
      .filter(entry => entry.name.startsWith(`${this.appName}:`))
    
    entries.forEach(entry => {
      try {
        if (entry.entryType === 'mark') {
          performance.clearMarks(entry.name)
        } else {
          performance.clearMeasures(entry.name)
        }
      } catch (error) {
        // Ignore errors when clearing
      }
    })
  }
}

// Create singleton instance for host app
// Update team and version to match your deployment
export const perfMonitor = new PerformanceMonitor('host-app-vue-3', 'platform-team', '1.0.0')
