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
   * Get all performance measures for this app
   */
  getAllMeasures(): PerformanceEntry[] {
    return performance.getEntriesByType('measure')
      .filter(entry => entry.name.startsWith(`${this.appName}:`))
  }
}

// Create singleton instance for host app
export const perfMonitor = new PerformanceMonitor('host')
