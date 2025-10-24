#!/usr/bin/env python3
"""
Script para reemplazar el chatbot en todas las páginas HTML dentro de assets/img
con el bloque EXACTO del chatbot del index.html principal.
También asegura que el script property-info-extractor.js esté presente.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path('assets/img')
MAIN_INDEX = Path('index.html')


def extract_chatbot_block(main_index_path: Path) -> str:
    """Extrae el bloque del chatbot desde el index principal, como texto HTML."""
    content = main_index_path.read_text(encoding='utf-8')
    start_marker = '<!-- Chatbot Widget -->'
    # Tomar desde el marcador hasta justo antes de </body>
    start_idx = content.find(start_marker)
    if start_idx == -1:
        raise RuntimeError('No se encontró el marcador del chatbot en el index principal')
    end_match = re.search(r'</body>\s*</html>\s*$', content, flags=re.IGNORECASE|re.MULTILINE)
    if not end_match:
        raise RuntimeError('No se encontró el cierre </body></html> en el index principal')
    chatbot_html = content[start_idx:end_match.start()]  # bloque exacto
    return chatbot_html.strip() + "\n"


def remove_existing_chatbot(content: str) -> tuple[str, bool]:
    """Elimina cualquier bloque de chatbot existente en el contenido."""
    changed = False
    # 1) Si tiene el módulo con el marcador de comentario, quitar ese bloque
    pattern_with_marker = r'<!--\s*Chatbot Widget\s*-->[\s\S]*?(?=</body>)'
    new_content, n = re.subn(pattern_with_marker, '', content, flags=re.IGNORECASE)
    if n > 0:
        content = new_content
        changed = True
    # 2) Si no tenía el marcador pero sí un div con id="chatbot", quitarlo de manera robusta
    pattern_div_only = r'<div\s+id="chatbot"[\s\S]*?</div>\s*'
    new_content, n = re.subn(pattern_div_only, '', content, flags=re.IGNORECASE)
    if n > 0:
        content = new_content
        changed = True
    return content, changed


def insert_chatbot(content: str, chatbot_html: str) -> tuple[str, bool]:
    """Inserta el bloque del chatbot antes de </body>."""
    # Asegurar que el cierre </body> existe
    if not re.search(r'</body>', content, flags=re.IGNORECASE):
        return content, False
    new_content = re.sub(r'(</body>\s*</html>)', chatbot_html + '\n\\1', content, flags=re.IGNORECASE|re.MULTILINE)
    return new_content, (new_content != content)


def ensure_property_extractor(content: str, script_path: str) -> tuple[str, bool]:
    """Asegura que property-info-extractor.js esté referenciado tras AOS.init();"""
    if 'property-info-extractor.js' in content:
        return content, False
    pattern = r'(\s*AOS\.init\(\);\s*</script>\s*)(</body>\s*</html>)'
    replacement = f'\\1    <script src="{script_path}"></script>\n\\2'
    new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    return new_content, (new_content != content)


def update_all_html_in_assets_img():
    chatbot_html = extract_chatbot_block(MAIN_INDEX)

    html_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        for name in files:
            if name.lower().endswith('.html'):
                html_files.append(Path(root) / name)

    print(f"Encontrados {len(html_files)} HTML en assets/img")

    replaced_count = 0
    inserted_extractor = 0
    modified_total = 0

    for page_path in html_files:
        try:
            content = page_path.read_text(encoding='utf-8')

            # 1) Quitar cualquier chatbot existente
            content, removed = remove_existing_chatbot(content)

            # 2) Insertar el chatbot del index principal
            content, inserted = insert_chatbot(content, chatbot_html)

            # 3) Asegurar extractor
            relative_path = page_path.relative_to(BASE_DIR)
            depth = len(relative_path.parts) - 1
            script_path = '../' * depth + '../js/property-info-extractor.js'
            content, did_extractor = ensure_property_extractor(content, script_path)

            if removed or inserted or did_extractor:
                page_path.write_text(content, encoding='utf-8')
                modified_total += 1
                replaced_count += int(removed or inserted)
                inserted_extractor += int(did_extractor)
                print(f"✓ Actualizado: {page_path}")
            else:
                print(f"• Sin cambios: {page_path}")
        except Exception as e:
            print(f"✗ Error en {page_path}: {e}")

    print(f"\n🎉 Reemplazo completado: {modified_total} archivos modificados")
    print(f"   - Chatbot reemplazado/insertado: {replaced_count}")
    print(f"   - Extractor insertado: {inserted_extractor}")


if __name__ == '__main__':
    update_all_html_in_assets_img()