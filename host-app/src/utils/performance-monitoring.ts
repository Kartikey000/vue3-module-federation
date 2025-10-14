/**
 * Performance Monitoring Utilities for Module Federation
 * Based on New Relic's best practices for MFE monitoring
 * Reference: https://newrelic.com/blog/how-to-relic/monitor-and-optimize-complex-web-apps-with-new-relic
 */

export class PerformanceMonitor {
  private appName: string

  constructor(appName: string) {
    this.appName = appName
  }

  /**
   * Mark the start of a component load
   */
  markComponentLoadStart(componentName: string): void {
    const markName = `${this.appName}:${componentName}:load:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of a component load and create a measure
   */
  markComponentLoadEnd(componentName: string): void {
    const startMark = `${this.appName}:${componentName}:load:start`
    const endMark = `${this.appName}:${componentName}:load:end`
    const measureName = `${this.appName}:${componentName}:CTLT` // Component Total Load Time

    performance.mark(endMark)
    
    try {
      performance.measure(measureName, startMark, endMark)
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Mark the start of platform load
   */
  markPlatformLoadStart(): void {
    performance.mark(`${this.appName}:platform:load:start`)
  }

  /**
   * Mark the end of platform load
   */
  markPlatformLoadEnd(): void {
    const startMark = `${this.appName}:platform:load:start`
    const endMark = `${this.appName}:platform:load:end`
    const measureName = `${this.appName}:PTLT` // Platform Total Load Time

    performance.mark(endMark)
    
    try {
      performance.measure(measureName, startMark, endMark)
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Track remote component asset load time
   */
  markRemoteAssetLoadStart(remoteName: string): void {
    const markName = `${this.appName}:remote:${remoteName}:asset:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of remote asset load
   */
  markRemoteAssetLoadEnd(remoteName: string): void {
    const startMark = `${this.appName}:remote:${remoteName}:asset:start`
    const endMark = `${this.appName}:remote:${remoteName}:asset:end`
    const measureName = `${this.appName}:remote:${remoteName}:CALT` // Component Asset Load Time

    performance.mark(endMark)
    
    try {
      performance.measure(measureName, startMark, endMark)
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Track data load time for components
   */
  markDataLoadStart(componentName: string): void {
    const markName = `${this.appName}:${componentName}:data:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of data load
   */
  markDataLoadEnd(componentName: string): void {
    const startMark = `${this.appName}:${componentName}:data:start`
    const endMark = `${this.appName}:${componentName}:data:end`
    const measureName = `${this.appName}:${componentName}:CDLT` // Component Data Load Time

    performance.mark(endMark)
    
    try {
      performance.measure(measureName, startMark, endMark)
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.warn(`[Performance] Could not measure ${measureName}:`, error)
    }
  }

  /**
   * Calculate and report Total Load Time (TLT)
   * This combines platform load time with component load times
   */
  calculateTotalLoadTime(): void {
    try {
      // Get navigation start time
      const navigationStart = performance.timing?.navigationStart || 0
      const now = performance.now()
      
      const measureName = `${this.appName}:TLT` // Total Load Time
      
      // Create a measure from navigation start to now
      performance.measure(measureName, {
        start: 0,
        end: now
      })
      
      const measure = performance.getEntriesByName(measureName)[0]
      if (measure && measure.duration !== undefined) {
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
        
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
export const perfMonitor = new PerformanceMonitor('host')
