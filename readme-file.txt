# Doña Malena - PWA Restaurant Ordering System

## 🌮 Descripción

PWA (Progressive Web Application) completa para el restaurante "Doña Malena" en Mérida, Yucatán. Sistema de pedidos optimizado para móviles con integración directa a WhatsApp.

## ✨ Características

- **📱 Móvil-first**: Diseño optimizado para dispositivos móviles
- **🛒 Carrito dinámico**: Sistema de carrito en tiempo real sin localStorage
- **📞 WhatsApp integrado**: Pedidos directos vía WhatsApp (5219988467737)
- **⏰ Estado del restaurante**: Horarios automáticos (Mar-Dom 6:30 AM - 12:00 PM)
- **🌐 PWA completo**: Funciona offline, instalable en dispositivos
- **🎨 Diseño mexicano**: Colores y tipografía temática

## 📁 Estructura de Archivos

```
dona-malena-pwa/
├── index.html              # Archivo principal HTML
├── styles.css              # Estilos CSS completos
├── script.js               # Lógica JavaScript
├── sw.js                   # Service Worker para PWA
├── manifest.json           # Manifiesto PWA
├── icons/                  # Iconos de la aplicación
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── apple-touch-icon.png
└── README.md               # Este archivo
```

## 🚀 Instalación Rápida

### 1. Descargar Archivos
Guarda todos los archivos proporcionados en la misma carpeta.

### 2. Crear Iconos
Necesitarás crear los iconos en la carpeta `/icons/`. Puedes usar cualquier generador de iconos PWA online:

**Iconos requeridos:**
- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px)
- `icon-192x192.png` (192x192px)
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px)
- `favicon-16x16.png` (16x16px)
- `favicon-32x32.png` (32x32px)
- `apple-touch-icon.png` (180x180px)

**Recomendación de diseño:**
- Fondo rojo (#FF0000) o verde (#228B22)
- Icono de taco 🌮 o letra "D" estilizada
- Texto "Doña Malena" si hay espacio

### 3. Subir a Hosting
Sube todos los archivos a cualquier servicio de hosting que soporte HTTPS:

**Opciones gratuitas recomendadas:**
- **Netlify**: Arrastra la carpeta a netlify.com
- **Vercel**: Conecta con GitHub o arrastra archivos
- **GitHub Pages**: Sube a repositorio público
- **Firebase Hosting**: `firebase deploy`

### 4. Configurar HTTPS
⚠️ **IMPORTANTE**: PWAs requieren HTTPS. Todos los servicios mencionados proporcionan HTTPS automáticamente.

## 📋 Menú Configurado

### 🍽️ Comida
- Empanadas con carne - $8
- Empanadas con Q.hebra - $10
- Panuchós - $18
- Salbutes - $18
- Sopes - $25
- Polcanes sencillos - $8
- Polcanes rellenos con carne - $20
- Polcanes rellenos con carne y queso - $25
- Tortas (Bolillo) - $35
- Tortas especiales(jamón, queso y pollo) - $38
- Sandwiches - $25
- Sandwiches especiales - $28
- Hamburguesas sencilla - $55
- Hamburguesas con papas - $65
- Burritacos - $20
- Burritas - $15

### 🥤 Bebidas
- Coke Lite 600ml - $30
- Pepsi light - $35
- Jamaica - $20

## ⚙️ Configuración

### Cambiar Número de WhatsApp
En `script.js`, línea ~580:
```javascript
const whatsappNumber = '5219988467737'; // Cambiar por tu número
```

### Modificar Horarios
En `script.js`, función `updateRestaurantStatus()`:
```javascript
const isOpenHours = currentTime >= 6.5 && currentTime < 12; // 6:30 AM a 12:00 PM
```

### Actualizar Menú
En `script.js`, modifica el objeto `menuData`:
```javascript
const menuData = {
    food: [
        { id: 'nuevo-platillo', name: 'Nuevo Platillo', price: 25 }
        // ... más platillos
    ]
};
```

## 📱 Funcionalidades

### Sistema de Carrito
- ✅ Agregar/quitar productos
- ✅ Contador de cantidad en tiempo real
- ✅ Cálculo automático de totales
- ✅ Persistencia durante la sesión
- ✅ Botón flotante con contador

### WhatsApp Integration
- ✅ Mensaje formateado automáticamente
- ✅ Incluye todos los productos del carrito
- ✅ Timestamp y información del restaurante
- ✅ Abre WhatsApp directamente

### PWA Features
- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (vista básica)
- ✅ Service Worker implementado
- ✅ Manifest completo
- ✅ Splash screen de carga

## 🛠️ Desarrollo

### Estructura del Código

**HTML (index.html)**
- Estructura semántica
- Meta tags para PWA
- Accesibilidad integrada

**CSS (styles.css)**
- Variables CSS para colores
- Diseño responsive
- Animaciones suaves
- Modo de alto contraste

**JavaScript (script.js)**
- Gestión de estado del carrito
- Lógica de horarios automática
- Integración WhatsApp
- Event listeners optimizados

**Service Worker (sw.js)**
- Cache de archivos estáticos
- Estrategias de cache
- Funcionalidad offline
- Background sync

### Personalización Avanzada

**Colores del tema:**
```css
:root {
    --primary-red: #FF0000;
    --deep-green: #228B22;
    --golden-yellow: #FFD700;
}
```

**Fuentes:**
- Headers: 'Dancing Script' (estilo mexicano)
- Texto: 'Roboto' (legibilidad)

## 🧪 Testing

### Probar en Dispositivos
1. **Chrome DevTools**: F12 → Toggle device toolbar
2. **Dispositivo real**: Comparte la URL y prueba en móvil
3. **PWA Test**: chrome://flags → Enable PWA features

### Verificar PWA
1. Chrome DevTools → Lighthouse
2. Ejecutar audit de PWA
3. Verificar score de 90+

### Test de WhatsApp
1. Agregar productos al carrito
2. Presionar "Ordenar"
3. Verificar que abre WhatsApp
4. Confirmar formato del mensaje

## 📈 Optimización

### Performance
- ✅ Imágenes optimizadas (WebP recomendado)
- ✅ CSS y JS minificados
- ✅ Lazy loading implementado
- ✅ Service Worker con cache estratégico

### SEO
- ✅ Meta tags completos
- ✅ Open Graph para redes sociales
- ✅ Structured data para Google
- ✅ Sitemap XML (generar si necesario)

### Accesibilidad
- ✅ Contraste de colores WCAG AA
- ✅ Navegación por teclado
- ✅ Screen reader friendly
- ✅ Tamaños de botón táctil (44px+)

## 🔧 Troubleshooting

### PWA No Se Instala
1. Verificar HTTPS activo
2. Confirmar manifest.json accesible
3. Revisar Service Worker registrado
4. Iconos 192x192 y 512x512 disponibles

### WhatsApp No Abre
1. Verificar número de teléfono correcto
2. Probar en dispositivo real (no emulador)
3. Confirmar WhatsApp instalado
4. Revisar permisos del navegador

### Service Worker No Funciona
1. Abrir DevTools → Application → Service Workers
2. Verificar registro exitoso
3. Revisar errores en consola
4. Probar en modo incógnito

### Carrito Se Pierde
- Es normal: el carrito usa variables JavaScript
- No persiste entre sesiones (por diseño)
- Para persistencia, implementar IndexedDB

## 🚀 Deployment

### Netlify (Recomendado)
1. Ir a [netlify.com](https://netlify.com)
2. Arrastrar carpeta del proyecto
3. Confirmar URL generada
4. ¡Listo! PWA funcionando

### Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Importar proyecto
3. Deploy automático
4. Configurar dominio personalizado

### GitHub Pages
1. Subir archivos a repositorio
2. Settings → Pages
3. Seleccionar branch main
4. Acceder via username.github.io/repo

## 📞 Soporte

### Contacto del Desarrollador
Para soporte técnico o personalizaciones adicionales, contactar al desarrollador que implementó este sistema.

### Recursos Útiles
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Web App Manifest](https://web.dev/add-manifest/)
- [WhatsApp Business API](https://business.whatsapp.com/)

## 📄 Licencia

Este proyecto está desarrollado específicamente para Doña Malena Restaurant. Uso comercial permitido para el restaurante. Modificación y redistribución bajo autorización.

---

**¡Doña Malena PWA - Auténtica Comida Mexicana en Mérida, Yucatán! 🌮**