/**
 * Performance Monitoring Utilities for Create User Remote App
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

  constructor(appName: string, teamName = 'create-user-team', version = '1.0.0') {
    this.appName = appName
    this.teamName = teamName
    this.version = version
  }

  /**
   * Mark the start of component load
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
   * Mark the end of component load and create a measure with custom attributes
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
    const markName = `${this.appName}:data:${operationName}:start`
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
    const startMark = `${this.appName}:data:${operationName}:start`
    const endMark = `${this.appName}:data:${operationName}:end`
    const measureName = `${this.appName}:data:${operationName}:CDLT` // Component Data Load Time

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

// Create singleton instance for this remote app
// Update team and version to match your deployment
export const perfMonitor = new PerformanceMonitor('create-user-app', 'create-user-team', '1.0.0')
