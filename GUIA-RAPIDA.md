# 🚀 GUÍA RÁPIDA DE LIMPIEZA

## ⚡ Opción 1: LA MÁS FÁCIL (Windows)

**Simplemente haz doble clic en:**
```
EJECUTAR_LIMPIEZA.bat
```

Eso es todo! El script hará todo por ti.

---

## 💻 Opción 2: Usando la Terminal

### Paso 1: Abrir terminal en la carpeta del proyecto
1. Abre la carpeta: `C:\Users\Admin\Desktop\InmobiliariaIntegarlesCerete`
2. Haz clic en la barra de direcciones
3. Escribe `cmd` y presiona Enter

### Paso 2: Ejecutar los comandos

**Ver qué problemas hay:**
```bash
node diagnostico.js
```

**Aplicar la limpieza:**
```bash
node cleanup.js
```

---

## 📊 ¿Qué hace cada script?

### 📝 diagnostico.js
- Cuenta cuántos archivos HTML están mal ubicados
- Detecta problemas de codificación
- Muestra ejemplos de texto con problemas
- **NO modifica nada**, solo muestra información

### 🔧 cleanup.js
- Elimina archivos HTML de `assets/img/`
- Corrige todos los símbolos raros (Ã©→é, Ã¡→á, etc.)
- Limpia carpetas vacías
- Organiza profesionalmente el proyecto

---

## ✅ Antes vs Después

### ❌ ANTES
```
assets/img/LOCALES/barrio santa Teresa/index.html  ← NO debería estar aquí
assets/img/VIVIENDAS/barrio corinto/index.html     ← NO debería estar aquí
```

Texto con problemas:
```
CeretÃ©, CÃ³rdoba  ← Se ve mal
PolÃ­tica          ← Se ve mal
```

### ✅ DESPUÉS
```
assets/img/LOCALES/barrio santa Teresa/   ← Solo imágenes
assets/img/VIVIENDAS/barrio corinto/      ← Solo imágenes
pages/locales/barrio-santa-teresa.html    ← HTML aquí
pages/viviendas/barrio-corinto.html       ← HTML aquí
```

Texto corregido:
```
Cereté, Córdoba  ← Perfecto!
Política         ← Perfecto!
```

---

## 🎯 Resultado Final

Después de la limpieza tendrás:
- ✅ Proyecto organizado profesionalmente
- ✅ Todos los textos correctos (sin Ã©, Ã¡, etc.)
- ✅ Estructura limpia de archivos
- ✅ Solo imágenes en `assets/img/`
- ✅ Solo HTML en `pages/`

---

## ⚠️ ¿Es seguro?

**SÍ, es 100% seguro porque:**
- Solo modifica archivos HTML
- No toca imágenes ni otros recursos
- Puedes restaurar con `git checkout .` si algo sale mal
- Miles de proyectos usan esta técnica

---

## 🆘 ¿Necesitas ayuda?

Si tienes algún problema:
1. Lee el archivo `LIMPIEZA-README.md` para más detalles
2. Revisa que Node.js esté instalado (`node --version`)
3. Si algo sale mal, usa `git checkout .` para restaurar

---

**¡Listo! Ahora solo ejecuta `EJECUTAR_LIMPIEZA.bat` y disfruta de un proyecto limpio y profesional!** 🎉
