#!/usr/bin/env python3
"""
Script para añadir automáticamente el extractor de información
a todas las páginas de propiedades existentes
"""

import os
import re
from pathlib import Path

def update_property_pages():
    """Actualiza todas las páginas de propiedades con el nuevo script"""
    
    # Directorio base de propiedades
    base_dir = Path("assets/img")
    
    # Buscar todos los archivos index.html en subdirectorios
    property_pages = []
    for root, dirs, files in os.walk(base_dir):
        if "index.html" in files:
            property_pages.append(Path(root) / "index.html")
    
    print(f"Encontradas {len(property_pages)} páginas de propiedades")
    
    updated_count = 0
    
    for page_path in property_pages:
        try:
            # Leer el contenido actual
            with open(page_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Verificar si ya tiene el script
            if 'property-info-extractor.js' in content:
                print(f"✓ Ya actualizada: {page_path}")
                continue
            
            # Calcular la ruta relativa al script
            # Contar niveles de profundidad desde assets/img
            relative_path = page_path.relative_to(base_dir)
            depth = len(relative_path.parts) - 1  # -1 porque el último es index.html
            script_path = "../" * depth + "../js/property-info-extractor.js"
            
            # Buscar el patrón donde insertar el script
            pattern = r'(\s+AOS\.init\(\);\s+</script>\s*)(</body>\s*</html>)'
            replacement = f'\\1    <script src="{script_path}"></script>\n\\2'
            
            new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
            
            if new_content != content:
                # Escribir el archivo actualizado
                with open(page_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"✓ Actualizada: {page_path}")
                updated_count += 1
            else:
                print(f"⚠ No se pudo actualizar: {page_path}")
                
        except Exception as e:
            print(f"✗ Error en {page_path}: {e}")
    
    print(f"\n🎉 Proceso completado: {updated_count} páginas actualizadas")

if __name__ == "__main__":
    update_property_pages()