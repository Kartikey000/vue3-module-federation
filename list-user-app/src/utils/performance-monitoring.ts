/**
 * Performance Monitoring Utilities for List User Remote App
 * Based on New Relic's best practices for MFE monitoring
 * Reference: https://newrelic.com/blog/how-to-relic/monitor-and-optimize-complex-web-apps-with-new-relic
 */

export class PerformanceMonitor {
  private appName: string

  constructor(appName: string) {
    this.appName = appName
  }

  /**
   * Mark the start of component load
   */
  markComponentLoadStart(componentName: string): void {
    const markName = `${this.appName}:${componentName}:load:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of component load and create a measure
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
   * Track data load time (API calls)
   */
  markDataLoadStart(operation: string): void {
    const markName = `${this.appName}:data:${operation}:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of data load
   */
  markDataLoadEnd(operation: string): void {
    const startMark = `${this.appName}:data:${operation}:start`
    const endMark = `${this.appName}:data:${operation}:end`
    const measureName = `${this.appName}:data:${operation}:CDLT` // Component Data Load Time

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
   * Track user interaction time
   */
  markInteractionStart(interactionName: string): void {
    const markName = `${this.appName}:interaction:${interactionName}:start`
    performance.mark(markName)
  }

  /**
   * Mark the end of user interaction
   */
  markInteractionEnd(interactionName: string): void {
    const startMark = `${this.appName}:interaction:${interactionName}:start`
    const endMark = `${this.appName}:interaction:${interactionName}:end`
    const measureName = `${this.appName}:interaction:${interactionName}:duration`

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
   * Get all performance measures for this app
   */
  getAllMeasures(): PerformanceEntry[] {
    return performance.getEntriesByType('measure')
      .filter(entry => entry.name.startsWith(`${this.appName}:`))
  }

  /**
   * Log a summary of all performance measures
   */
  logPerformanceSummary(): void {
    const measures = this.getAllMeasures()
    
    if (measures.length > 0) {
      console.group(`[${this.appName} Performance Summary]`)
      measures.forEach(measure => {
        console.log(`${measure.name}: ${measure.duration?.toFixed(2)}ms`)
      })
      console.groupEnd()
    }
  }
}

// Create singleton instance for list-user-app
export const perfMonitor = new PerformanceMonitor('list-user-app')

