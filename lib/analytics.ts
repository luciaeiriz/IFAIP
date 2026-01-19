'use client'

/**
 * Generic event tracking function for Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * Track when a user views a course detail page
 */
export const trackCourseView = (
  courseId: string,
  courseTitle: string,
  courseTag?: string,
  courseProvider?: string
) => {
  trackEvent('view_course', {
    course_id: courseId,
    course_title: courseTitle,
    course_tag: courseTag,
    course_provider: courseProvider,
  })
}

/**
 * Track when a user successfully signs up for a course
 */
export const trackCourseSignup = (
  courseId: string,
  courseTitle: string,
  landingTag?: string,
  utmParams?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
) => {
  trackEvent('signup_course', {
    course_id: courseId,
    course_title: courseTitle,
    landing_tag: landingTag,
    ...utmParams,
  })
}

/**
 * Track when a user submits a lead capture form
 */
export const trackLeadCapture = (
  tag: string,
  utmParams?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
) => {
  trackEvent('capture_lead', {
    landing_tag: tag,
    ...utmParams,
  })
}

/**
 * Track when a user clicks on a course card
 */
export const trackCourseCardClick = (
  courseId: string,
  courseTitle: string,
  actionType: 'view' | 'signup' | 'external',
  courseTag?: string,
  courseProvider?: string
) => {
  trackEvent('click_course_card', {
    course_id: courseId,
    course_title: courseTitle,
    action_type: actionType,
    course_tag: courseTag,
    course_provider: courseProvider,
  })
}

/**
 * Track when a user clicks on an external course link
 */
export const trackExternalLinkClick = (
  courseId: string,
  courseTitle: string,
  url: string
) => {
  trackEvent('click_external_link', {
    course_id: courseId,
    course_title: courseTitle,
    external_url: url,
  })
}

/**
 * Track when a user clicks on a CTA button
 */
export const trackCTAClick = (
  ctaText: string,
  ctaLocation: string,
  destinationUrl?: string
) => {
  trackEvent('click_cta', {
    cta_text: ctaText,
    cta_location: ctaLocation,
    destination_url: destinationUrl,
  })
}
