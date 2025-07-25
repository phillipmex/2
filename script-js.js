// Doña Malena PWA - Main JavaScript File
// Author: Generated for Doña Malena Restaurant
// Location: Mérida, Yucatán, Mexico

// Global Variables
let cart = {};
let cartTotal = 0;
let cartItemCount = 0;
let isCartOpen = false;

// Menu Data - Exact order as specified
const menuData = {
    food: [
        { id: 'empanadas-carne', name: 'Empanadas con carne', price: 8 },
        { id: 'empanadas-qhebra', name: 'Empanadas con Q.hebra', price: 10 },
        { id: 'panuchos', name: 'Panuchós', price: 18 },
        { id: 'salbutes', name: 'Salbutes', price: 18 },
        { id: 'sopes', name: 'Sopes', price: 25 },
        { id: 'polcanes-sencillos', name: 'Polcanes sencillos', price: 8 },
        { id: 'polcanes-carne', name: 'Polcanes rellenos con carne', price: 20 },
        { id: 'polcanes-carne-queso', name: 'Polcanes rellenos con carne y queso', price: 25 },
        { id: 'tortas-bolillo', name: 'Tortas (Bolillo)', price: 35 },
        { id: 'tortas-especiales', name: 'Tortas especiales(jamón, queso y pollo)', price: 38 },
        { id: 'sandwiches', name: 'Sandwiches', price: 25 },
        { id: 'sandwiches-especiales', name: 'Sandwiches especiales', price: 28 },
        { id: 'hamburguesas-sencilla', name: 'Hamburguesas sencilla', price: 55 },
        { id: 'hamburguesas-papas', name: 'Hamburguesas con papas', price: 65 },
        { id: 'burritacos', name: 'Burritacos', price: 20 },
        { id: 'burritas', name: 'Burritas', price: 15 }
    ],
    beverages: [
        { id: 'coke-lite', name: 'Coke Lite 600ml', price: 30 },
        { id: 'pepsi-light', name: 'Pepsi light', price: 35 },
        { id: 'jamaica', name: 'Jamaica', price: 20 }
    ]
};

// Utility Functions
function formatCurrency(amount) {
    return `${amount}`;
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString('es-MX', {
        timeZone: 'America/Merida',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function debounce(func, wait) {
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

// Restaurant Status Management
function updateRestaurantStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);

    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');

    if (!statusBar || !statusText) return;

    // Monday = 1 (closed), Tuesday = 2, Sunday = 0
    const isMonday = day === 1;
    const isOpenHours = currentTime >= 6.5 && currentTime < 12; // 6:30 AM to 12:00 PM

    if (isMonday) {
        statusBar.className = 'status-bar status-closed';
        statusText.innerHTML = '<i class="fas fa-times-circle"></i> CERRADO - Lunes de descanso';
    } else if (isOpenHours) {
        statusBar.className = 'status-bar status-open';
        statusText.innerHTML = '<i class="fas fa-check-circle"></i> ABIERTO - Solo para llevar';
    } else {
        statusBar.className = 'status-bar status-closed';
        statusText.innerHTML = '<i class="fas fa-clock"></i> CERRADO - Horario: Martes a Domingo 6:30 AM - 12:00 PM';
    }
}

// Menu Initialization
function initializeMenu() {
    const foodMenu = document.getElementById('foodMenu');
    const beverageMenu = document.getElementById('beverageMenu');

    if (!foodMenu || !beverageMenu) {
        console.error('Menu containers not found');
        return;
    }

    // Clear existing content
    foodMenu.innerHTML = '';
    beverageMenu.innerHTML = '';

    // Populate food menu
    menuData.food.forEach((item, index) => {
        const menuItem = createMenuItem(item, index);
        foodMenu.appendChild(menuItem);
    });

    // Populate beverage menu
    menuData.beverages.forEach((item, index) => {
        const menuItem = createMenuItem(item, index + menuData.food.length);
        beverageMenu.appendChild(menuItem);
    });

    console.log('Menu initialized successfully');
}

// Create Menu Item Element
function createMenuItem(item, index) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.style.animationDelay = `${index * 0.1}s`;
    
    menuItem.innerHTML = `
        <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${formatCurrency(item.price)}</div>
        </div>
        <div class="item-controls">
            <button class="quantity-btn" 
                    onclick="decreaseQuantity('${item.id}')" 
                    id="decrease-${item.id}"
                    aria-label="Disminuir cantidad de ${item.name}"
                    tabindex="0">
                <i class="fas fa-minus" aria-hidden="true"></i>
            </button>
            <div class="quantity-display" 
                 id="quantity-${item.id}" 
                 aria-label="Cantidad actual">0</div>
            <button class="quantity-btn" 
                    onclick="increaseQuantity('${item.id}')"
                    aria-label="Aumentar cantidad de ${item.name}"
                    tabindex="0">
                <i class="fas fa-plus" aria-hidden="true"></i>
            </button>
            <button class="add-btn" 
                    onclick="addToCart('${item.id}')" 
                    id="add-${item.id}"
                    aria-label="Agregar ${item.name} al carrito"
                    tabindex="0">
                Agregar
            </button>
        </div>
    `;
    
    return menuItem;
}

// Cart Management Functions
function findItemById(itemId) {
    return [...menuData.food, ...menuData.beverages].find(item => item.id === itemId);
}

function addToCart(itemId) {
    const item = findItemById(itemId);
    if (!item) {
        console.error(`Item with id ${itemId} not found`);
        return;
    }

    if (!cart[itemId]) {
        cart[itemId] = { ...item, quantity: 0 };
    }
    
    cart[itemId].quantity += 1;
    updateQuantityDisplay(itemId);
    updateCartUI();
    animateAddToCart();
    
    // Analytics tracking (if implemented)
    trackEvent('add_to_cart', { item_id: itemId, item_name: item.name });
}

function increaseQuantity(itemId) {
    const item = findItemById(itemId);
    if (!item) {
        console.error(`Item with id ${itemId} not found`);
        return;
    }

    if (!cart[itemId]) {
        cart[itemId] = { ...item, quantity: 0 };
    }
    
    cart[itemId].quantity += 1;
    updateQuantityDisplay(itemId);
    updateCartUI();
    
    trackEvent('increase_quantity', { item_id: itemId });
}

function decreaseQuantity(itemId) {
    if (!cart[itemId] || cart[itemId].quantity <= 0) {
        return;
    }
    
    cart[itemId].quantity -= 1;
    
    if (cart[itemId].quantity === 0) {
        delete cart[itemId];
    }
    
    updateQuantityDisplay(itemId);
    updateCartUI();
    
    trackEvent('decrease_quantity', { item_id: itemId });
}

function removeFromCart(itemId) {
    if (cart[itemId]) {
        delete cart[itemId];
        updateQuantityDisplay(itemId);
        updateCartUI();
        
        trackEvent('remove_from_cart', { item_id: itemId });
    }
}

function clearCart() {
    cart = {};
    
    // Reset all quantity displays
    Object.keys(menuData.food.concat(menuData.beverages)).forEach(item => {
        updateQuantityDisplay(item.id);
    });
    
    updateCartUI();
    trackEvent('clear_cart');
}

// UI Update Functions
function updateQuantityDisplay(itemId) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    const decreaseButton = document.getElementById(`decrease-${itemId}`);
    
    if (!quantityElement || !decreaseButton) return;
    
    const quantity = cart[itemId] ? cart[itemId].quantity : 0;
    quantityElement.textContent = quantity;
    
    decreaseButton.disabled = quantity <= 0;
    
    // Add visual feedback
    if (quantity > 0) {
        quantityElement.classList.add('has-items');
    } else {
        quantityElement.classList.remove('has-items');
    }
}

function updateCartUI() {
    calculateCartTotals();
    updateCartCounter();
    updateCartModal();
}

function calculateCartTotals() {
    cartTotal = 0;
    cartItemCount = 0;
    
    Object.values(cart).forEach(item => {
        cartTotal += item.price * item.quantity;
        cartItemCount += item.quantity;
    });
}

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (!counter) return;
    
    counter.textContent = cartItemCount;
    
    if (cartItemCount > 0) {
        counter.classList.add('show');
    } else {
        counter.classList.remove('show');
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const orderBtn = document.getElementById('orderBtn');
    
    if (!cartItems || !cartTotalElement || !orderBtn) return;
    
    if (cartItemCount === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega algunos platillos deliciosos!</p>
            </div>
        `;
        orderBtn.disabled = true;
        orderBtn.style.opacity = '0.5';
        orderBtn.setAttribute('aria-disabled', 'true');
    } else {
        cartItems.innerHTML = '';
        
        Object.values(cart).forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" 
                            onclick="decreaseQuantity('${item.id}')"
                            aria-label="Disminuir cantidad de ${item.name}">
                        <i class="fas fa-minus" aria-hidden="true"></i>
                    </button>
                    <div class="quantity-display">${item.quantity}</div>
                    <button class="quantity-btn" 
                            onclick="increaseQuantity('${item.id}')"
                            aria-label="Aumentar cantidad de ${item.name}">
                        <i class="fas fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        orderBtn.disabled = false;
        orderBtn.style.opacity = '1';
        orderBtn.setAttribute('aria-disabled', 'false');
    }
    
    cartTotalElement.textContent = `Total: ${formatCurrency(cartTotal)}`;
}

// Cart Modal Functions
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    if (isCartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.style.display = 'flex';
    cartModal.setAttribute('aria-hidden', 'false');
    
    // Trigger animation
    setTimeout(() => {
        cartModal.classList.add('show');
    }, 10);
    
    updateCartModal();
    isCartOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstFocusableElement = cartModal.querySelector('button');
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
    
    trackEvent('open_cart');
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.classList.remove('show');
    cartModal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
        cartModal.style.display = 'none';
    }, 300);
    
    isCartOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.focus();
    }
    
    trackEvent('close_cart');
}

// Animation Functions
function animateAddToCart() {
    const cartBtn = document.getElementById('cartBtn');
    if (!cartBtn) return;
    
    cartBtn.classList.add('bounce');
    setTimeout(() => {
        cartBtn.classList.remove('bounce');
    }, 600);
}

// WhatsApp Integration
function sendToWhatsApp() {
    if (cartItemCount === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de ordenar.');
        return;
    }
    
    const timestamp = getCurrentDateTime();
    const whatsappNumber = '5219988467737';
    
    let message = `*🌮 PEDIDO - DOÑA MALENA 🌮*\n\n`;
    message += `📅 Fecha: ${timestamp}\n`;
    message += `📍 Mérida, Yucatán\n\n`;
    message += `*📋 DETALLES DEL PEDIDO:*\n`;
    
    Object.values(cart).forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: ${formatCurrency(item.price)} c/u = ${formatCurrency(item.price * item.quantity)}\n\n`;
    });
    
    message += `*💰 TOTAL: ${formatCurrency(cartTotal)}*\n\n`;
    message += `*🚗 Servicio: SOLO PARA LLEVAR*\n`;
    message += `⏰ Horario: Martes a Domingo 6:30 AM - 12:00 PM\n\n`;
    message += `¡Gracias por elegir Doña Malena! 🙏`;
    
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Track order attempt
    trackEvent('initiate_order', {
        total_amount: cartTotal,
        item_count: cartItemCount,
        items: Object.keys(cart)
    });
    
    // Open WhatsApp
    try {
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showNotification('Redirigiendo a WhatsApp...', 'success');
        
        // Optional: Clear cart after order (uncomment if desired)
        // setTimeout(clearCart, 2000);
        
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        showNotification('Error al abrir WhatsApp. Por favor intenta de nuevo.', 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced Analytics Tracking with detailed events
function trackEvent(eventName, eventData = {}) {
    // Console logging for development
    console.log('Analytics Event:', eventName, eventData);
    
    // Google Analytics 4 (if configured)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'restaurant_ordering',
            event_label: eventData.item_name || 'unknown',
            value: eventData.price || 0,
            custom_map: {
                item_id: eventData.item_id,
                quantity: eventData.quantity,
                total_amount: eventData.total_amount
            }
        });
    }
    
    // Facebook Pixel (if configured)
    if (typeof fbq !== 'undefined') {
        if (eventName === 'add_to_cart') {
            fbq('track', 'AddToCart', {
                content_name: eventData.item_name,
                content_ids: [eventData.item_id],
                content_type: 'product',
                value: eventData.price,
                currency: 'MXN'
            });
        } else if (eventName === 'initiate_order') {
            fbq('track', 'InitiateCheckout', {
                value: eventData.total_amount,
                currency: 'MXN',
                num_items: eventData.item_count
            });
        }
    }
    
    // Custom analytics endpoint (if implemented)
    if (navigator.onLine) {
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventName,
                data: eventData,
                timestamp: Date.now(),
                session_id: getSessionId(),
                user_agent: navigator.userAgent
            })
        }).catch(() => {
            // Silently fail if analytics endpoint not available
        });
    }
}

// Enhanced session management
function getSessionId() {
    let sessionId = sessionStorage.getItem('dona_malena_session');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('dona_malena_session', sessionId);
    }
    return sessionId;
}

// Advanced notification system with actions
function showNotification(message, type = 'info', actions = []) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107',
        install: '#228B22'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            ${actions.length > 0 ? `
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-btn" onclick="${action.onclick}">${action.text}</button>
                    `).join('')}
                </div>
            ` : ''}
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 320px;
        word-wrap: break-word;
        font-family: 'Roboto', sans-serif;
    `;
    
    // Add CSS for notification components
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }
            .notification-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.2s ease;
            }
            .notification-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            .notification-close {
                position: absolute;
                top: 8px;
                right: 12px;
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after delay (except for install prompts)
    if (type !== 'install') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, type === 'error' ? 5000 : 3000);
    }
}

// Enhanced offline detection with retry mechanism
let isOffline = false;
let retryQueue = [];

function handleOnlineStatus() {
    const wasOffline = isOffline;
    isOffline = !navigator.onLine;
    
    if (wasOffline && !isOffline) {
        showNotification('Conexión restaurada. Sincronizando datos...', 'success');
        processRetryQueue();
    } else if (!wasOffline && isOffline) {
        showNotification('Sin conexión. La app funcionará en modo offline.', 'warning');
    }
    
    // Update UI to reflect offline status
    document.body.classList.toggle('offline', isOffline);
}

function processRetryQueue() {
    while (retryQueue.length > 0) {
        const request = retryQueue.shift();
        try {
            request();
        } catch (error) {
            console.error('Failed to process queued request:', error);
        }
    }
}

function queueForRetry(requestFunction) {
    retryQueue.push(requestFunction);
}

// Advanced performance monitoring
const performanceMonitor = {
    metrics: {
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
        menuLoadTime: 0
    },
    
    init() {
        this.measureLoadTime();
        this.measureRenderTime();
        this.measureInteractionLatency();
    },
    
    measureLoadTime() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (performance.getEntriesByType) {
                    const [navigation] = performance.getEntriesByType('navigation');
                    if (navigation) {
                        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
                        console.log(`App load time: ${this.metrics.loadTime}ms`);
                        
                        trackEvent('performance_load', {
                            load_time: this.metrics.loadTime,
                            connection: navigator.connection?.effectiveType || 'unknown'
                        });
                    }
                }
            }, 0);
        });
    },
    
    measureRenderTime() {
        const startTime = performance.now();
        requestAnimationFrame(() => {
            this.metrics.renderTime = performance.now() - startTime;
            console.log(`Render time: ${this.metrics.renderTime}ms`);
        });
    },
    
    measureInteractionLatency() {
        let interactionStart = 0;
        
        document.addEventListener('touchstart', () => {
            interactionStart = performance.now();
        });
        
        document.addEventListener('touchend', () => {
            if (interactionStart > 0) {
                this.metrics.interactionTime = performance.now() - interactionStart;
                if (this.metrics.interactionTime > 100) {
                    console.warn(`Slow interaction detected: ${this.metrics.interactionTime}ms`);
                }
            }
        });
    }
};

// Enhanced error handling and reporting
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
    });
    
    // Show user-friendly error message
    showNotification('Ocurrió un error inesperado. Recarga la página si persiste.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    trackEvent('promise_rejection', {
        reason: event.reason?.toString() || 'unknown'
    });
});

// Enhanced accessibility features
function enhanceAccessibility() {
    // Add high contrast mode support
    const preferredContrast = window.matchMedia('(prefers-contrast: high)');
    if (preferredContrast.matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Add reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Enhanced keyboard navigation
    let isTabbing = false;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            isTabbing = true;
            document.body.classList.add('user-is-tabbing');
        }
    });
    
    document.addEventListener('mousedown', () => {
        isTabbing = false;
        document.body.classList.remove('user-is-tabbing');
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const container = document.querySelector('.container');
    if (container) {
        container.id = 'main-content';
        container.setAttribute('tabindex', '-1');
    }
}

// Advanced cart persistence (optional enhancement)
const cartPersistence = {
    enabled: false, // Set to true to enable persistence
    
    save() {
        if (!this.enabled) return;
        
        try {
            const cartData = {
                cart: cart,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('dona_malena_cart', JSON.stringify(cartData));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    },
    
    load() {
        if (!this.enabled) return;
        
        try {
            const savedData = localStorage.getItem('dona_malena_cart');
            if (savedData) {
                const cartData = JSON.parse(savedData);
                const hoursSinceUpdate = (Date.now() - cartData.timestamp) / (1000 * 60 * 60);
                
                // Only restore if less than 24 hours old
                if (hoursSinceUpdate < 24) {
                    cart = cartData.cart || {};
                    updateCartUI();
                    
                    if (Object.keys(cart).length > 0) {
                        showNotification('Carrito restaurado desde tu última visita', 'info');
                    }
                }
            }
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
        }
    },
    
    clear() {
        if (!this.enabled) return;
        
        try {
            localStorage.removeItem('dona_malena_cart');
        } catch (error) {
            console.warn('Could not clear cart from localStorage:', error);
        }
    }
};

// Enhanced WhatsApp integration with order tracking
function sendToWhatsApp() {
    if (cartItemCount === 0) {
        showNotification('Tu carrito está vacío. Agrega algunos productos antes de ordenar.', 'warning');
        return;
    }
    
    const timestamp = getCurrentDateTime();
    const whatsappNumber = '5219988467737';
    const orderId = generateOrderId();
    
    let message = `*🌮 PEDIDO - DOÑA MALENA 🌮*\n\n`;
    message += `📅 Fecha: ${timestamp}\n`;
    message += `🆔 Pedido: #${orderId}\n`;
    message += `📍 Mérida, Yucatán\n\n`;
    message += `*📋 DETALLES DEL PEDIDO:*\n`;
    
    Object.values(cart).forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: ${formatCurrency(item.price)} c/u = ${formatCurrency(item.price * item.quantity)}\n\n`;
    });
    
    message += `*💰 TOTAL: ${formatCurrency(cartTotal)}*\n\n`;
    message += `*🚗 Servicio: SOLO PARA LLEVAR*\n`;
    message += `⏰ Horario: Martes a Domingo 6:30 AM - 12:00 PM\n\n`;
    message += `¡Gracias por elegir Doña Malena! 🙏\n\n`;
    message += `_Pedido generado desde nuestra app web_`;
    
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Enhanced order tracking
    const orderData = {
        order_id: orderId,
        total_amount: cartTotal,
        item_count: cartItemCount,
        items: Object.values(cart).map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        timestamp: Date.now(),
        whatsapp_number: whatsappNumber
    };
    
    trackEvent('initiate_order', orderData);
    
    try {
        // Store order attempt for analytics
        storeOrderAttempt(orderData);
        
        window.open(whatsappURL, '_blank');
        
        showNotification(`Pedido #${orderId} enviado a WhatsApp`, 'success', [
            {
                text: 'Limpiar carrito',
                onclick: 'clearCartAfterOrder()'
            }
        ]);
        
        // Optional: Auto-clear cart after successful order
        setTimeout(() => {
            if (confirm('¿Deseas limpiar el carrito? Tu pedido ya fue enviado.')) {
                clearCart();
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        showNotification('Error al abrir WhatsApp. Por favor intenta de nuevo.', 'error');
        
        // Queue for retry if offline
        if (!navigator.onLine) {
            queueForRetry(() => sendToWhatsApp());
        }
    }
}

function generateOrderId() {
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const randomStr = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `DM${dateStr}${timeStr}${randomStr}`;
}

function storeOrderAttempt(orderData) {
    try {
        const attempts = JSON.parse(sessionStorage.getItem('order_attempts') || '[]');
        attempts.push(orderData);
        sessionStorage.setItem('order_attempts', JSON.stringify(attempts));
    } catch (error) {
        console.warn('Could not store order attempt:', error);
    }
}

function clearCartAfterOrder() {
    clearCart();
    showNotification('Carrito limpiado. ¡Gracias por tu pedido!', 'success');
}

// Initialize enhanced features
function initializeEnhancements() {
    performanceMonitor.init();
    enhanceAccessibility();
    handleOnlineStatus();
    
    // Load persisted cart if enabled
    cartPersistence.load();
    
    // Set up event listeners for enhanced features
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Enhanced resize handling with debouncing
    window.addEventListener('resize', debounce(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Track orientation changes
        trackEvent('orientation_change', {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: screen.orientation?.type || 'unknown'
        });
    }, 250));
    
    // Enhanced touch feedback
    document.addEventListener('touchstart', (e) => {
        if (e.target.matches('button, .quantity-btn, .add-btn, .cart-btn')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (e.target.matches('button, .quantity-btn, .add-btn, .cart-btn')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
    
    // Save cart on changes if persistence enabled
    const originalUpdateCartUI = updateCartUI;
    updateCartUI = function() {
        originalUpdateCartUI();
        cartPersistence.save();
    };
    
    console.log('Enhanced features initialized');
}

// Loading Screen Management
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Event Listeners
function setupEventListeners() {
    // Cart modal close on background click
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCart();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key to close cart
        if (e.key === 'Escape' && isCartOpen) {
            closeCart();
        }
        
        // Enter key on focused buttons
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
            e.target.click();
        }
    });
    
    // Touch feedback for all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    // Prevent double-tap zoom on buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
    
    // Online/Offline detection
    window.addEventListener('online', function() {
        showNotification('Conexión restaurada', 'success');
    });
    
    window.addEventListener('offline', function() {
        showNotification('Sin conexión a internet', 'error');
    });
}

// Debounced resize handler
const handleResize = debounce(function() {
    // Adjust UI for screen size changes
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250);

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                trackEvent('page_performance', {
                    load_time: loadTime,
                    dom_ready: perfData.domContentLoadedEventEnd - perfData.navigationStart
                });
            }, 0);
        });
    }
}

// Service Worker Communication
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', function(event) {
            if (event.data && event.data.type) {
                switch (event.data.type) {
                    case 'SW_UPDATED':
                        showNotification('Nueva versión disponible. Recarga la página.', 'info');
                        break;
                    case 'SW_OFFLINE':
                        showNotification('Modo sin conexión activado', 'info');
                        break;
                }
            }
        });
    }
}

// App Initialization with Enhanced Features
function initializeApp() {
    console.log('Initializing Doña Malena PWA with enhancements...');
    
    try {
        // Initialize core components
        initializeMenu();
        updateRestaurantStatus();
        updateCartUI();
        setupEventListeners();
        setupServiceWorker();
        
        // Initialize enhanced features
        initializeEnhancements();
        
        // Set up periodic updates
        setInterval(updateRestaurantStatus, 60000); // Update every minute
        
        // Handle window resize with performance optimization
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
        
        // Hide loading screen with fade effect
        setTimeout(hideLoadingScreen, 1000);
        
        // Track successful initialization
        trackEvent('app_initialized', {
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
            screen_size: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection?.effectiveType || 'unknown'
        });
        
        console.log('Doña Malena PWA initialized successfully with enhanced features');
        
        // Show welcome message for first-time users
        if (!sessionStorage.getItem('returning_user')) {
            setTimeout(() => {
                showNotification('¡Bienvenido a Doña Malena! 🌮 Auténtica comida mexicana en Mérida.', 'success');
                sessionStorage.setItem('returning_user', 'true');
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error al cargar la aplicación. Recarga la página.', 'error');
        
        trackEvent('app_initialization_error', {
            error_message: error.message,
            error_stack: error.stack
        });
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        calculateCartTotals,
        updateRestaurantStatus,
        formatCurrency
    };
}