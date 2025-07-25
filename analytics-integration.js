// Advanced Analytics Integration for Doña Malena PWA
// This file provides comprehensive analytics tracking for restaurant operations

class DonaMatenaAnalytics {
    constructor(config = {}) {
        this.config = {
            gtag_id: config.gtag_id || null,
            facebook_pixel_id: config.facebook_pixel_id || null,
            hotjar_id: config.hotjar_id || null,
            custom_endpoint: config.custom_endpoint || null,
            debug: config.debug || false,
            ...config
        };
        
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.pageLoadTime = performance.now();
        
        this.init();
    }
    
    init() {
        this.setupGoogleAnalytics();
        this.setupFacebookPixel();
        this.setupHotjar();
        this.trackPageView();
        this.setupUserBehaviorTracking();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        
        if (this.config.debug) {
            console.log('Doña Malena Analytics initialized', this.config);
        }
    }
    
    // Google Analytics 4 Setup
    setupGoogleAnalytics() {
        if (!this.config.gtag_id) return;
        
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gtag_id}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', this.config.gtag_id, {
            page_title: 'Doña Malena - Auténtica Comida Mexicana',
            page_location: window.location.href,
            custom_map: {
                'restaurant_name': 'Doña Malena',
                'location': 'Mérida, Yucatán',
                'service_type': 'takeout_only'
            }
        });
    }
    
    // Facebook Pixel Setup
    setupFacebookPixel() {
        if (!this.config.facebook_pixel_id) return;
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        window.fbq('init', this.config.facebook_pixel_id);
        window.fbq('track', 'PageView');
    }
    
    // Hotjar Setup
    setupHotjar() {
        if (!this.config.hotjar_id) return;
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:this.config.hotjar_id,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
    
    // Core Tracking Methods
    track(event, properties = {}) {
        const eventData = {
            event: event,
            timestamp: Date.now(),
            session_id: this.sessionId,
            user_id: this.userId,
            page_url: window.location.href,
            restaurant: 'Doña Malena',
            location: 'Mérida, Yucatán',
            ...properties
        };
        
        // Google Analytics
        if (window.gtag) {
            window.gtag('event', event, {
                event_category: 'restaurant_ordering',
                event_label: properties.item_name || 'unknown',
                value: properties.price || 0,
                currency: 'MXN',
                custom_parameters: properties
            });
        }
        
        // Facebook Pixel
        if (window.fbq) {
            this.trackFacebookEvent(event, properties);
        }
        
        // Custom endpoint
        if (this.config.custom_endpoint) {
            this.sendToCustomEndpoint(eventData);
        }
        
        // Console debug
        if (this.config.debug) {
            console.log('Analytics Event:', event, eventData);
        }
    }
    
    trackFacebookEvent(event, properties) {
        const eventMap = {
            'add_to_cart': 'AddToCart',
            'remove_from_cart': 'AddToCart', // FB doesn't have remove
            'initiate_order': 'InitiateCheckout',
            'view_menu': 'ViewContent',
            'search_menu': 'Search'
        };
        
        const fbEvent = eventMap[event] || 'CustomEvent';
        const fbProperties = {
            content_name: properties.item_name,
            content_ids: properties.item_id ? [properties.item_id] : [],
            content_type: 'product',
            value: properties.price || properties.total_amount || 0,
            currency: 'MXN'
        };
        
        window.fbq('track', fbEvent, fbProperties);
    }
    
    async sendToCustomEndpoint(data) {
        try {
            await fetch(this.config.custom_endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            if (this.config.debug) {
                console.warn('Failed to send analytics to custom endpoint:', error);
            }
        }
    }
    
    // Restaurant-Specific Tracking Methods
    trackMenuView(section = 'all') {
        this.track('view_menu', {
            menu_section: section,
            total_items: this.getMenuItemCount()
        });
    }
    
    trackItemView(item) {
        this.track('view_item', {
            item_id: item.id,
            item_name: item.name,
            item_price: item.price,
            item_category: this.getItemCategory(item.id)
        });
    }
    
    trackAddToCart(item, quantity = 1) {
        this.track('add_to_cart', {
            item_id: item.id,
            item_name: item.name,
            item_price: item.price,
            quantity: quantity,
            total_value: item.price * quantity,
            item_category: this.getItemCategory(item.id)
        });
    }
    
    trackRemoveFromCart(item, quantity = 1) {
        this.track('remove_from_cart', {
            item_id: item.id,
            item_name: item.name,
            item_price: item.price,
            quantity: quantity,
            item_category: this.getItemCategory(item.id)
        });
    }
    
    trackCartView(cart) {
        const items = Object.values(cart);
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        this.track('view_cart', {
            cart_total: totalValue,
            cart_items: items.length,
            cart_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            cart_contents: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    }
    
    trackOrderInitiation(orderData) {
        this.track('initiate_order', {
            order_id: orderData.order_id,
            total_amount: orderData.total_amount,
            item_count: orderData.item_count,
            whatsapp_number: orderData.whatsapp_number,
            order_method: 'whatsapp',
            items: orderData.items,
            order_time: new Date().toISOString()
        });
        
        // Enhanced ecommerce tracking for GA4
        if (window.gtag) {
            window.gtag('event', 'begin_checkout', {
                currency: 'MXN',
                value: orderData.total_amount,
                items: orderData.items.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    category: this.getItemCategory(item.id),
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        }
    }
    
    trackRestaurantStatus(status, hours) {
        this.track('restaurant_status_check', {
            status: status, // 'open' or 'closed'
            current_time: new Date().toISOString(),
            business_hours: hours,
            day_of_week: new Date().toLocaleDateString('es-MX', { weekday: 'long' })
        });
    }
    
    trackUserEngagement(action, element) {
        this.track('user_engagement', {
            action: action, // 'click', 'scroll', 'hover', etc.
            element: element,
            page_time: performance.now() - this.pageLoadTime,
            scroll_depth: this.getScrollDepth()
        });
    }
    
    trackPerformanceMetrics(metrics) {
        this.track('performance_metrics', {
            page_load_time: metrics.loadTime,
            render_time: metrics.renderTime,
            interaction_latency: metrics.interactionTime,
            connection_type: navigator.connection?.effectiveType || 'unknown',
            device_memory: navigator.deviceMemory || 'unknown'
        });
    }
    
    trackError(error, context = {}) {
        this.track('error_occurred', {
            error_message: error.message,
            error_stack: error.stack,
            error_type: error.name,
            context: context,
            page_url: window.location.href,
            user_agent: navigator.userAgent
        });
    }
    
    trackOfflineEvent(event) {
        this.track('offline_event', {
            event_type: event, // 'went_offline', 'came_online', 'cached_interaction'
            connection_status: navigator.onLine,
            timestamp: Date.now()
        });
    }
    
    trackInstallPrompt(action) {
        this.track('pwa_install_prompt', {
            action: action, // 'shown', 'accepted', 'dismissed'
            platform: this.getPlatform(),
            standalone_mode: window.matchMedia('(display-mode: standalone)').matches
        });
    }
    
    // User Behavior Tracking
    setupUserBehaviorTracking() {
        // Scroll depth tracking
        let maxScroll = 0;
        window.addEventListener('scroll', this.debounce(() => {
            const scrollDepth = this.getScrollDepth();
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
                if (scrollDepth >= 25 && scrollDepth < 50) {
                    this.track('scroll_depth', { depth: '25%' });
                } else if (scrollDepth >= 50 && scrollDepth < 75) {
                    this.track('scroll_depth', { depth: '50%' });
                } else if (scrollDepth >= 75 && scrollDepth < 100) {
                    this.track('scroll_depth', { depth: '75%' });
                } else if (scrollDepth >= 100) {
                    this.track('scroll_depth', { depth: '100%' });
                }
            }
        }, 1000));
        
        // Time on page tracking
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 30;
            if (timeOnPage % 60 === 0) { // Every minute
                this.track('time_on_page', { 
                    seconds: timeOnPage,
                    minutes: Math.floor(timeOnPage / 60)
                });
            }
        }, 30000);
        
        // Click tracking for important elements
        document.addEventListener('click', (event) => {
            const element = event.target.closest('button, .menu-item, .cart-btn, .add-btn');
            if (element) {
                this.trackUserEngagement('click', this.getElementIdentifier(element));
            }
        });
        
        // Focus tracking for accessibility
        document.addEventListener('focusin', (event) => {
            if (event.target.matches('button, input, [tabindex]')) {
                this.trackUserEngagement('focus', this.getElementIdentifier(event.target));
            }
        });
    }
    
    // Performance Tracking
    setupPerformanceTracking() {
        // Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with web-vitals library if included
            // getCLS, getFID, getFCP, getLCP, getTTFB
        }
        
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.track('page_performance', {
                        dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
                        connection_time: perfData.connectEnd - perfData.connectStart,
                        request_time: perfData.responseEnd - perfData.requestStart,
                        response_time: perfData.responseEnd - perfData.responseStart,
                        dom_load_time: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        total_load_time: perfData.loadEventEnd - perfData.loadEventStart
                    });
                }
            }, 0);
        });
        
        // Memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                this.track('memory_usage', {
                    used_js_heap_size: performance.memory.usedJSHeapSize,
                    total_js_heap_size: performance.memory.totalJSHeapSize,
                    js_heap_size_limit: performance.memory.jsHeapSizeLimit
                });
            }, 60000); // Every minute
        }
    }
    
    // Error Tracking
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.trackError(event.error, {
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError(new Error('Unhandled Promise Rejection'), {
                reason: event.reason
            });
        });
    }
    
    // Business Intelligence Methods
    trackPeakHours() {
        const hour = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        
        this.track('peak_hours_analysis', {
            hour: hour,
            day_of_week: dayOfWeek,
            is_business_hours: hour >= 6 && hour < 12,
            time_period: this.getTimePeriod(hour)
        });
    }
    
    trackPopularItems(cart) {
        const items = Object.values(cart);
        if (items.length > 0) {
            this.track('popular_items_analysis', {
                most_ordered_category: this.getMostOrderedCategory(items),
                average_order_value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                items_per_order: items.reduce((sum, item) => sum + item.quantity, 0),
                unique_items: items.length
            });
        }
    }
    
    trackCustomerJourney(step, data = {}) {
        this.track('customer_journey', {
            journey_step: step, // 'landed', 'viewed_menu', 'added_to_cart', 'initiated_order', 'completed_order'
            session_duration: performance.now() - this.pageLoadTime,
            previous_step: this.getLastJourneyStep(),
            ...data
        });
        
        // Store for next step tracking
        sessionStorage.setItem('last_journey_step', step);
    }
    
    // Utility Methods
    generateSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }
    
    getItemCategory(itemId) {
        const foodItems = ['empanadas-carne', 'empanadas-qhebra', 'panuchos', 'salbutes', 'sopes', 
                          'polcanes-sencillos', 'polcanes-carne', 'polcanes-carne-queso', 'tortas-bolillo', 
                          'tortas-especiales', 'sandwiches', 'sandwiches-especiales', 'hamburguesas-sencilla', 
                          'hamburguesas-papas', 'burritacos', 'burritas'];
        
        return foodItems.includes(itemId) ? 'food' : 'beverage';
    }
    
    getMenuItemCount() {
        return document.querySelectorAll('.menu-item').length;
    }
    
    getScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }
    
    getPlatform() {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
        if (/Android/.test(ua)) return 'Android';
        if (/Windows/.test(ua)) return 'Windows';
        if (/Mac/.test(ua)) return 'macOS';
        return 'Unknown';
    }
    
    getElementIdentifier(element) {
        return element.id || element.className || element.tagName.toLowerCase();
    }
    
    getTimePeriod(hour) {
        if (hour >= 6 && hour < 9) return 'early_morning';
        if (hour >= 9 && hour < 12) return 'late_morning';
        if (hour >= 12 && hour < 15) return 'afternoon';
        if (hour >= 15 && hour < 18) return 'late_afternoon';
        if (hour >= 18 && hour < 21) return 'evening';
        return 'night';
    }
    
    getMostOrderedCategory(items) {
        const categories = items.map(item => this.getItemCategory(item.id));
        const categoryCount = categories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        
        return Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b
        );
    }
    
    getLastJourneyStep() {
        return sessionStorage.getItem('last_journey_step') || 'unknown';
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API for manual tracking
    pageView(path = window.location.pathname) {
        this.track('page_view', {
            page_path: path,
            page_title: document.title,
            referrer: document.referrer
        });
    }
    
    customEvent(name, properties = {}) {
        this.track(`custom_${name}`, properties);
    }
    
    // Data export for reporting
    exportSessionData() {
        return {
            session_id: this.sessionId,
            user_id: this.userId,
            session_start: this.pageLoadTime,
            current_time: performance.now(),
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection?.effectiveType || 'unknown',
            platform: this.getPlatform()
        };
    }
}

// Initialize analytics with configuration
const analytics = new DonaMatenaAnalytics({
    // gtag_id: 'GA_MEASUREMENT_ID', // Uncomment and add your GA4 ID
    // facebook_pixel_id: 'YOUR_PIXEL_ID', // Uncomment and add your Facebook Pixel ID
    // hotjar_id: 'YOUR_HOTJAR_ID', // Uncomment and add your Hotjar ID
    // custom_endpoint: 'https://your-api.com/analytics', // Custom analytics endpoint
    debug: true // Set to false in production
});

// Export for use in main application
if (typeof window !== 'undefined') {
    window.DonaMatenaAnalytics = analytics;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DonaMatenaAnalytics;
}