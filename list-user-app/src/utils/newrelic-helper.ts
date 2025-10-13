// New Relic Helper for Remote Apps
// The New Relic agent is initialized by the host app and available via window.newrelic

/**
 * Check if New Relic is available
 */
export const isNewRelicAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.newrelic !== 'undefined'
}

/**
 * Add a custom page action (user interaction tracking)
 * @param actionName - Name of the action
 * @param attributes - Additional attributes to track
 */
export const addPageAction = (actionName: string, attributes?: Record<string, any>) => {
  if (isNewRelicAvailable()) {
    window.newrelic.addPageAction(actionName, attributes)
    console.log(`[New Relic] Page Action: ${actionName}`, attributes)
  }
}

/**
 * Set custom attributes for the current page view
 * @param name - Attribute name
 * @param value - Attribute value
 */
export const setCustomAttribute = (name: string, value: string | number | boolean) => {
  if (isNewRelicAvailable()) {
    window.newrelic.setCustomAttribute(name, value)
    console.log(`[New Relic] Custom Attribute: ${name} = ${value}`)
  }
}

/**
 * Report a custom error to New Relic
 * @param error - Error object or message
 * @param customAttributes - Additional context
 */
export const noticeError = (error: Error | string, customAttributes?: Record<string, any>) => {
  if (isNewRelicAvailable()) {
    window.newrelic.noticeError(error, customAttributes)
    console.error('[New Relic] Error reported:', error, customAttributes)
  }
}

/**
 * Track component load time
 * @param componentName - Name of the component
 * @param loadTimeMs - Load time in milliseconds
 */
export const trackComponentLoad = (componentName: string, loadTimeMs: number) => {
  if (isNewRelicAvailable()) {
    window.newrelic.addPageAction('componentLoaded', {
      component: componentName,
      loadTime: loadTimeMs,
      remoteApp: 'list-user-app'
    })
    console.log(`[New Relic] Component ${componentName} loaded in ${loadTimeMs}ms`)
  }
}

/**
 * Track user interactions specific to this remote app
 */
export const trackUserInteraction = (
  action: string, 
  target: string, 
  metadata?: Record<string, any>
) => {
  if (isNewRelicAvailable()) {
    window.newrelic.addPageAction('userInteraction', {
      action,
      target,
      remoteApp: 'list-user-app',
      ...metadata
    })
  }
}

/**
 * Track API calls performance
 * @param endpoint - API endpoint
 * @param duration - Request duration in ms
 * @param status - HTTP status code
 */
export const trackApiCall = (endpoint: string, duration: number, status: number) => {
  if (isNewRelicAvailable()) {
    window.newrelic.addPageAction('apiCall', {
      endpoint,
      duration,
      status,
      remoteApp: 'list-user-app'
    })
  }
}

// TypeScript declaration for window.newrelic
declare global {
  interface Window {
    newrelic?: {
      addPageAction: (name: string, attributes?: Record<string, any>) => void
      setCustomAttribute: (name: string, value: string | number | boolean) => void
      noticeError: (error: Error | string, customAttributes?: Record<string, any>) => void
      setCurrentRouteName: (routeName: string) => void
      interaction: () => any
      finished: (timestamp: number) => void
    }
  }
}

export default {
  isNewRelicAvailable,
  addPageAction,
  setCustomAttribute,
  noticeError,
  trackComponentLoad,
  trackUserInteraction,
  trackApiCall
}

