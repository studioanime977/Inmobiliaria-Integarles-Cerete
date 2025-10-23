# Chatbot Inmobiliaria Integrales Cereté

## 📋 Descripción

El chatbot ha sido implementado exitosamente en el sitio web de Inmobiliaria Integrales Cereté. Este asistente virtual permite a los usuarios buscar y consultar información sobre todas las propiedades disponibles (viviendas y locales comerciales).

## ✨ Características

### 1. **Búsqueda Inteligente**
- Búsqueda por tipo de propiedad (viviendas, locales)
- Búsqueda por estado (arriendo, venta)
- Búsqueda por barrio o ubicación
- Búsqueda por rango de precio (ej: 500k-800k, desde 600k, hasta 1M)
- Búsqueda por palabras clave

### 2. **Información Completa**
- Muestra el título de cada propiedad
- Precio formateado
- Descripción completa del INFO.txt
- Estado (arriendo/venta)
- Enlaces directos a la página de detalle

### 3. **Integración con WhatsApp**
- Botón para consultar por WhatsApp en cada propiedad
- Copia automática del mensaje con información de la propiedad
- Enlace directo al WhatsApp de la inmobiliaria

### 4. **Mensaje de Bienvenida**
- Saludo personalizado al abrir el chatbot
- Instrucciones claras de uso
- Opciones rápidas para comenzar

## 🚀 Cómo Usar

### Para Usuarios del Sitio Web

1. **Abrir el chatbot**: Haz clic en el botón flotante 💬 en la esquina inferior derecha
2. **Buscar propiedades**:
   - Escribe "viviendas" para ver todas las viviendas
   - Escribe "locales" para ver todos los locales
   - Escribe un barrio (ej: "santa clara", "el prado")
   - Escribe un rango de precio (ej: "500k-800k", "desde 600k")
3. **Ver detalles**: Haz clic en "Ver detalle completo" para ir a la página de la propiedad
4. **Consultar por WhatsApp**: Haz clic en "Consultar por WhatsApp" para enviar un mensaje

### Ejemplos de Búsqueda

**Por tipo de propiedad:**
- `viviendas` - Muestra todas las viviendas disponibles
- `locales` - Muestra todos los locales comerciales
- `arriendo` - Muestra propiedades en arriendo
- `venta` - Muestra propiedades en venta

**Por ubicación:**
- `santa clara` - Busca propiedades en el barrio Santa Clara
- `el prado` - Busca propiedades en el barrio El Prado
- `centro` - Busca propiedades en el centro

**Por precio (Pesos Colombianos):**
- `500k-800k` o `500 mil a 800 mil` - Entre $500,000 y $800,000
- `$500.000 - $800.000` - Formato colombiano con puntos
- `desde 1M` o `desde 1 millón` - Desde $1,000,000
- `hasta 700k` o `hasta 700 mil` - Hasta $700,000
- `más de 600k` - Más de $600,000
- `menos de 1M` - Menos de $1,000,000
- `entre 500.000 y 900.000` - Entre $500,000 y $900,000
- `máximo 800k` - Máximo $800,000
- `600000` - Busca alrededor de $600,000 (±15%)

**Por características:**
- `3 habitaciones` - Busca propiedades con 3 habitaciones
- `2 baños` - Busca propiedades con 2 baños

**Otros:**
- `contacto` - Muestra información de contacto
- `asesoría` - Información sobre servicios de asesoría

## 🔧 Para Administradores

### Actualizar el Índice de Propiedades

Cuando agregues o modifiques propiedades (INFO.txt), debes regenerar el índice:

```bash
node generate-index.js
```

Este script:
1. Escanea todas las carpetas en `assets/img/LOCALES` y `assets/img/VIVIENDAS`
2. Lee cada archivo `INFO.txt`
3. Extrae información (título, precio, estado, keywords)
4. Genera el archivo `assets/data/content-index.json`

### Estructura de Archivos

```
InmobiliariaIntegarlesCerete/
├── assets/
│   ├── data/
│   │   └── content-index.json       # Índice generado automáticamente
│   ├── img/
│   │   ├── LOCALES/
│   │   │   └── [nombre-local]/
│   │   │       ├── INFO.txt         # Información del local
│   │   │       ├── PORTADA.jpg      # Imagen principal
│   │   │       └── index.html       # Página de detalle
│   │   └── VIVIENDAS/
│   │       └── [nombre-vivienda]/
│   │           ├── INFO.txt         # Información de la vivienda
│   │           ├── PORTADA.jpg      # Imagen principal
│   │           └── index.html       # Página de detalle
│   └── js/
│       └── main.js                  # Lógica del chatbot
├── generate-index.js                # Script para generar índice
└── index.html                       # Página principal
```

### Formato del INFO.txt

Cada archivo INFO.txt debe contener:
- Tipo de propiedad (ARRIENDO/VENTA)
- Descripción completa
- Precio en formato: `VALOR $XXX.XXX` o `VALOR $ XXX.XXX`
- Teléfonos de contacto

Ejemplo:
```
SE ARRIENDA VIVIENDA URBANA: Esta ubicada en el barrio santa clara consta de 3 habitaciones todas con closet sala, comedor, cocina, 2 baños kiosco, buenos acabados, zona central VALOR $ 1.000.000 TEL 3015717622-3007256161
```

## 📊 Estadísticas Actuales

- **Total de propiedades**: 47
- **Locales comerciales**: 11
- **Viviendas**: 36
- **Última actualización**: 2025-10-23

## 🎨 Personalización

### Modificar el Mensaje de Bienvenida

Edita la función `showWelcomeMessage()` en `assets/js/main.js` (línea ~1069)

### Cambiar Número de WhatsApp

Busca y reemplaza `https://wa.me/qr/6WQZ2EFOAR46O1` en:
- `assets/js/main.js`
- `index.html`

### Ajustar Límite de Resultados

En `assets/js/main.js`, función `searchItems()`:
- Línea 830: Cambia `.slice(0, 10)` para mostrar más/menos resultados sin búsqueda
- Línea 837: Cambia `.slice(0, 6)` para mostrar más/menos resultados con búsqueda

## 🐛 Solución de Problemas

### El chatbot no muestra propiedades
1. Verifica que `assets/data/content-index.json` existe
2. Ejecuta `node generate-index.js` para regenerar el índice
3. Verifica que los archivos INFO.txt existen en las carpetas de propiedades

### Los precios no se muestran
1. Verifica que el formato en INFO.txt sea: `VALOR $XXX.XXX` o `VALOR $ XXX.XXX`
2. Regenera el índice con `node generate-index.js`

### El botón de WhatsApp no funciona
1. Verifica que el enlace de WhatsApp sea correcto
2. Asegúrate de que el navegador permita abrir ventanas emergentes

## 📝 Notas

- El chatbot carga automáticamente al abrir la página
- Se puede abrir haciendo clic en la imagen del hero
- El índice debe regenerarse cada vez que se agreguen o modifiquen propiedades
- Los precios se formatean automáticamente con separadores de miles

## 🔄 Mantenimiento

### Agregar Nueva Propiedad

1. Crea una carpeta en `assets/img/LOCALES` o `assets/img/VIVIENDAS`
2. Agrega el archivo `INFO.txt` con la información
3. Agrega la imagen `PORTADA.jpg`
4. Crea el archivo `index.html` para la página de detalle
5. Ejecuta `node generate-index.js`
6. Recarga el sitio web

### Actualizar Información de Propiedad

1. Edita el archivo `INFO.txt` correspondiente
2. Ejecuta `node generate-index.js`
3. Recarga el sitio web

## 📞 Soporte

Para soporte técnico o consultas:
- Teléfono: 3015717622 - 3007256161
- Email: info@integarlescerete.com
