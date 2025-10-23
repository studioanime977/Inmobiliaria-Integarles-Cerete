# 📱 Integración de WhatsApp - Chatbot Inmobiliaria

## 🎯 Funcionalidad Implementada

Cuando un usuario hace clic en **"💬 Consultar por WhatsApp"** en cualquier propiedad, el sistema:

1. ✅ **Genera un mensaje profesional** con todos los detalles de la propiedad
2. ✅ **Copia el mensaje al portapapeles** automáticamente
3. ✅ **Abre WhatsApp** con el mensaje pre-cargado
4. ✅ **Incluye el enlace directo** a la página de la propiedad

---

## 📝 Formato del Mensaje

El mensaje que se envía por WhatsApp tiene este formato:

```
¡Hola! 👋

Me interesa esta propiedad que vi en su página web:

🏠 *Barrio Santa Clara*
📍 Tipo: Vivienda
💰 Precio: $600.000

🔗 Ver detalles completos:
http://localhost:8000/assets/img/VIVIENDAS/barrio santa clara/index.html

¿Podrían darme más información sobre disponibilidad y condiciones de arriendo?

¡Gracias!
```

---

## 🔧 Cómo Funciona

### **1. Usuario hace clic en el botón**
```javascript
<button class="wa-item" 
        data-path="assets/img/VIVIENDAS/..."
        data-title="Barrio Santa Clara"
        data-category="viviendas"
        data-price="600000"
        data-info="...">
  💬 Consultar por WhatsApp
</button>
```

### **2. Sistema construye el mensaje**
```javascript
function buildWhatsAppText(title, category, path, info, price){
  const kind = category === 'locales' ? 'local comercial' : 'vivienda';
  const url = buildAbsUrl(path); // URL completa
  
  const message = `¡Hola! 👋

Me interesa esta propiedad que vi en su página web:

🏠 *${title}*
📍 Tipo: ${kind}
💰 Precio: $${price.toLocaleString('es-CO')}

🔗 Ver detalles completos:
${url}

¿Podrían darme más información sobre disponibilidad y condiciones de arriendo?

¡Gracias!`;
  
  return message;
}
```

### **3. Sistema copia al portapapeles**
```javascript
await navigator.clipboard.writeText(text);
```

### **4. Sistema abre WhatsApp**
```javascript
const phoneNumber = '573015717622'; // Número de la inmobiliaria
const encodedText = encodeURIComponent(text);
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
window.open(whatsappUrl, '_blank');
```

---

## 💡 Ventajas de Esta Implementación

### ✅ **Automático**
- El mensaje se copia automáticamente
- WhatsApp se abre con el mensaje pre-cargado
- El usuario solo presiona "Enviar"

### ✅ **Profesional**
- Mensaje bien estructurado
- Incluye todos los detalles importantes
- Formato limpio y fácil de leer

### ✅ **Trazable**
- Incluye el enlace directo a la propiedad
- El asesor sabe exactamente qué propiedad le interesa
- Facilita el seguimiento

### ✅ **Compatible**
- Funciona en móvil y escritorio
- Si falla la copia automática, muestra el mensaje para copiar manualmente
- Compatible con todos los navegadores modernos

---

## 📱 Experiencia del Usuario

### **En Escritorio:**
1. Usuario hace clic en "Consultar por WhatsApp"
2. Chatbot muestra: "✅ ¡Perfecto! Copié el mensaje al portapapeles."
3. Se abre WhatsApp Web en nueva pestaña
4. Usuario pega el mensaje (Ctrl+V) y envía

### **En Móvil:**
1. Usuario hace clic en "Consultar por WhatsApp"
2. Chatbot muestra: "✅ ¡Perfecto! Copié el mensaje al portapapeles."
3. Se abre la app de WhatsApp
4. Usuario pega el mensaje y envía

---

## 🔄 Flujo Completo de Conversación

```
👤 Usuario: "local"

🤖 Bot: ¡Perfecto! Tenemos locales comerciales disponibles. 🏪
🤖 Bot: ¿El local es para arriendo o venta?

👤 Usuario: "arriendo"

🤖 Bot: Perfecto, propiedades en arriendo. 📝
🤖 Bot: ¿Cuál es tu presupuesto mensual? 💰
       Nuestros locales van desde $400.000 hasta $160.000.000

👤 Usuario: "500k-700k"

🤖 Bot: ¡Excelente! Déjame buscar las mejores opciones para ti... 🔍
🤖 Bot: ✨ Encontré 3 propiedades entre $500.000 y $700.000:

       [Tarjeta de Propiedad 1]
       📄 Ver detalle completo
       💬 Consultar por WhatsApp  ← Usuario hace clic aquí

🤖 Bot: ✅ ¡Perfecto! Copié el mensaje al portapapeles.
🤖 Bot: 📱 Abriendo WhatsApp... Solo pega el mensaje (Ctrl+V) y envía.

[Se abre WhatsApp con el mensaje pre-cargado]
```

---

## 🎨 Personalización del Mensaje

Para cambiar el formato del mensaje, edita la función `buildWhatsAppText` en `main.js`:

```javascript
// Línea 1003-1029 en main.js
function buildWhatsAppText(title, category, path, info, price){
  // Personaliza el mensaje aquí
  const message = `Tu mensaje personalizado...`;
  return message;
}
```

---

## 📞 Configuración del Número de WhatsApp

El número de WhatsApp está configurado en la línea 1052:

```javascript
const phoneNumber = '573015717622'; // Formato: código país + número
```

**Formato correcto:**
- ✅ `573015717622` (Colombia: 57 + 3015717622)
- ✅ `5491123456789` (Argentina: 54 + 9 + 11 + 23456789)
- ❌ `+573015717622` (No incluir el +)
- ❌ `3015717622` (Incluir código de país)

---

## 🧪 Probar la Funcionalidad

1. Abre: `http://localhost:8000/index.html`
2. Abre el chatbot 💬
3. Busca una propiedad (ej: "local")
4. Haz clic en "💬 Consultar por WhatsApp"
5. Verifica que:
   - ✅ El mensaje se copió
   - ✅ WhatsApp se abrió
   - ✅ El mensaje incluye el enlace correcto
   - ✅ El precio está formateado correctamente

---

## 🔍 Troubleshooting

### **Problema: No se copia el mensaje**
**Solución:** El navegador bloquea el acceso al portapapeles. El chatbot mostrará el mensaje para copiar manualmente.

### **Problema: WhatsApp no se abre**
**Solución:** Verifica que WhatsApp esté instalado o que WhatsApp Web funcione en el navegador.

### **Problema: El enlace no funciona**
**Solución:** Verifica que el servidor esté corriendo y que la URL base sea correcta.

### **Problema: El mensaje está en blanco**
**Solución:** Verifica que los datos de la propiedad (title, category, path, price) estén en el botón.

---

## 📊 Estadísticas de Uso

Para rastrear cuántas personas usan el botón de WhatsApp, puedes agregar analytics:

```javascript
// En el evento click del botón WhatsApp
gtag('event', 'whatsapp_click', {
  'property_title': title,
  'property_category': category,
  'property_price': price
});
```

---

## ✅ Checklist de Implementación

- [x] Mensaje profesional con formato
- [x] Copia automática al portapapeles
- [x] Apertura automática de WhatsApp
- [x] Enlace directo a la propiedad
- [x] Precio formateado en pesos colombianos
- [x] Manejo de errores (si falla la copia)
- [x] Feedback visual al usuario
- [x] Compatible con móvil y escritorio
- [x] Mensaje pre-cargado en WhatsApp

---

¡La integración de WhatsApp está completa y lista para usar! 🎉
