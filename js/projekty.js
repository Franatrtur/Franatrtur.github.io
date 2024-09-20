// Function to check if element is in view using Intersection Observer
function isElementInView(element, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.0
    }

    const observerOptions = { ...defaultOptions, ...options }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            callback(entry.target, entry.isIntersecting)
        })
    }, observerOptions)

    observer.observe(element)

    return () => observer.unobserve(element)
}

// Function to handle animation of sections
function setupAnimatedSections() {
    const animatedSections = $("#content section")

    animatedSections.each(function() {
        isElementInView(
            this,
            (element, isIntersecting) => {
                if (isIntersecting && !$(element).hasClass("animate")) {
                    $(element).addClass("animate")
                }
            },
            { threshold: 0.4 }
        )
    })
}

$(document).ready(setupAnimatedSections)