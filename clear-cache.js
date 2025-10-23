// Script para limpiar cache y recargar la página
// Copia y pega esto en la consola del navegador (F12)

console.log('🧹 LIMPIANDO CACHE Y RECARGANDO...');

// Limpiar cache del navegador
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name);
      console.log('🗑️ Cache eliminado:', name);
    });
  });
}

// Forzar recarga con cache bypass
window.location.reload(true);

console.log('✅ Cache limpiado y página recargada');
console.log('🔄 La página se recargará automáticamente...');
