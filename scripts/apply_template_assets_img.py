import os
import re
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parents[1]
IMG_ROOT = ROOT / 'assets' / 'img'
CSS_REL = '../../../css'
JS_REL = '../../../js'
ICO_REL = '../../../ico'

HTML_TEMPLATE = Template(r'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$page_title - Inmobiliaria Integarles Cerete</title>
    <meta name="description" content="$meta_description">
    <link rel="icon" href="$ICO_REL/footer.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
    <link rel="stylesheet" href="$CSS_REL/style.css?v=2.0">
    <link rel="stylesheet" href="$CSS_REL/responsive.css?v=2.0">
    <link rel="stylesheet" href="$CSS_REL/property.css?v=1.0">
</head>
<body class="property-page">
    <header class="header">
        <div class="container">
            <div class="header-top">
                <div class="contact-info">
                    <span><i class="fas fa-phone"></i> +57 321 739 5050</span>
                    <span><i class="fas fa-envelope"></i> info@integarlescerete.com</span>
                </div>
                <div class="social-links">
                    <a href="https://www.facebook.com/profile.php?id=61556410361723" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://wa.me/qr/6WQZ2EFOAR46O1" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    <a href="https://www.instagram.com" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="header-main nav-wrapper">
                <div class="logo">
                    <a href="../../../../index.html" class="logo-link" aria-label="Ir al inicio">
                        <picture>
                            <source srcset="$ICO_REL/logo.png" type="image/svg+xml">
                            <img src="$ICO_REL/logo.png" alt="Integrales inmobiliaria & Abogados">
                        </picture>
                        <span class="brand-name">Integrales inmobiliaria & Abogados</span>
                    </a>
                </div>
                <nav class="main-nav" id="nav-menu">
                    <ul>
                        <li><a href="../../../../index.html#inicio" class="nav-link">Inicio</a></li>
                        <li><a href="../../../../index.html#servicios" class="nav-link">Servicios</a></li>
                        <li><a href="../../../../index.html#propiedades" class="nav-link">Propiedades</a></li>
                        <li><a href="../../../../index.html#nosotros" class="nav-link">Nosotros</a></li>
                        <li><a href="../../../../index.html#contacto" class="nav-link">Contacto</a></li>
                    </ul>
                </nav>
                <div class="mobile-menu-toggle" id="mobile-menu">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    </header>

    <section class="property-details">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2 class="section-title">$section_title</h2>
                <p class="section-subtitle">Detalles de la propiedad</p>
            </div>
            <div class="property-content-grid">
                <div class="property-gallery" data-aos="fade-up">
                    <div class="gallery-main" tabindex="0">
                        <img src="$main_image" alt="Portada - $section_title" id="main-image">
                        <button class="gallery-nav prev" type="button" aria-label="Imagen anterior"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-nav next" type="button" aria-label="Imagen siguiente"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <div class="gallery-thumbnails">
                        $thumbnails
                    </div>
                </div>
                <div class="property-info-details" data-aos="fade-up">
                    <h3>Información de la Propiedad</h3>
                    $info_blocks
                    <div class="property-features">
                        $features_block
                    </div>
                    <a href="https://wa.me/qr/6WQZ2EFOAR46O1" class="btn btn-primary" target="_blank"><img src="$ICO_REL/whatsapp.webp" alt="WhatsApp" class="btn-icon"> Contactar por WhatsApp</a>
                    <a href="tel:$tel_href" class="btn btn-outline">Llamar Ahora</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-col" data-aos="fade-up">
                    <div class="footer-logo">
                        <img src="$ICO_REL/footer.png" alt="Integrales inmobiliaria & Abogados">
                        <h3>Integrales inmobiliaria & Abogados</h3>
                    </div>
                    <p>Tu aliado confiable en el mercado inmobiliario de Cereté, Córdoba. Conectando personas con sus hogares ideales.</p>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/profile.php?id=61556410361723" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://wa.me/qr/6WQZ2EFOAR46O1" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
                <div class="footer-col" data-aos="fade-up" data-aos-delay="100">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><a href="index.html">Inicio</a></li>
                        <li><a href="#servicios">Servicios</a></li>
                        <li><a href="#propiedades">Propiedades</a></li>
                        <li><a href="#nosotros">Nosotros</a></li>
                        <li><a href="#contacto">Contacto</a></li>
                    </ul>
                </div>
                <div class="footer-col" data-aos="fade-up" data-aos-delay="200">
                    <h4>Servicios</h4>
                    <ul>
                        <li><a href="#servicios">Compra y Venta</a></li>
                        <li><a href="#servicios">Arriendo</a></li>
                        <li><a href="#servicios">Inversión</a></li>
                        <li><a href="#servicios">Asesoría Legal</a></li>
                        <li><a href="#servicios">Administración</a></li>
                    </ul>
                </div>
                <div class="footer-col" data-aos="fade-up" data-aos-delay="300">
                    <h4>Contacto</h4>
                    <ul class="footer-contact">
                        <li><i class="fas fa-map-marker-alt"></i><span>Cereté, Córdoba, Colombia</span></li>
                        <li><i class="fas fa-phone"></i><span>$tel_visible</span></li>
                        <li><i class="fas fa-clock"></i><span>Lun - Vie: 8:00 AM - 6:00 PM</span></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Inmobiliaria Integarles Cerete. Todos los derechos reservados.</p>
                <div class="footer-links">
                    <a href="#">Política de Privacidad</a>
                    <a href="#">Términos y Condiciones</a>
                </div>
            </div>
        </div>
    </footer>

    <button class="scroll-top" id="scrollTop" aria-label="Volver arriba"><i class="fas fa-arrow-up"></i></button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="$JS_REL/main.js"></script>
    <script>
        const thumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
        const images = Array.from(thumbnails).map(t => t.getAttribute('src'));
        const main = document.getElementById('main-image');
        let currentIndex = 0;
        function showImage(index) {
            currentIndex = (index + images.length) % images.length;
            main.style.opacity = 0;
            const nextSrc = images[currentIndex];
            const img = new Image();
            img.onload = () => { main.src = nextSrc; main.style.opacity = 1; };
            img.src = nextSrc;
            thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === currentIndex));
        }
        document.querySelector('.gallery-nav.prev').addEventListener('click', () => showImage(currentIndex - 1));
        document.querySelector('.gallery-nav.next').addEventListener('click', () => showImage(currentIndex + 1));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
        // Gestos táctiles (swipe)
        let startX = 0;
        main.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        main.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const dx = endX - startX;
            if (Math.abs(dx) > 30) {
                if (dx < 0) showImage(currentIndex + 1);
                else showImage(currentIndex - 1);
            }
        }, { passive: true });
        AOS.init();
    </script>
</body>
</html>
''')

IMG_EXTS = {'.jpg', '.jpeg', '.png', '.webp'}

def select_images(folder: Path):
    files = [f.name for f in folder.iterdir() if f.is_file() and f.suffix.lower() in IMG_EXTS]
    if not files:
        return None, []
    files_sorted = sorted(files, key=lambda s: s.lower())
    portada_candidates = [f for f in files_sorted if 'portada' in f.lower()]
    portada = portada_candidates[0] if portada_candidates else files_sorted[0]
    ordered = [portada] + [f for f in files_sorted if f != portada]
    return portada, ordered

def extract_info(info_text: str):
    desc = info_text.strip()
    valor_match = re.search(r'(VALOR\s*\$?\s*([\d\.,]+))', info_text, re.IGNORECASE)
    valor = valor_match.group(2) if valor_match else ''
    tel_match = re.search(r'TEL\s*([\d\-\s/]+)', info_text, re.IGNORECASE)
    tel_visible = tel_match.group(1).strip() if tel_match else '+57 301 571 7622 / +57 300 725 6161'
    num_match = re.search(r'(\d{7,})', tel_visible)
    tel_href = '+57' + num_match.group(1) if num_match else '+573015717622'
    return desc, valor, tel_visible, tel_href

def build_info_blocks(desc: str, valor: str):
    blocks = []
    if desc:
        blocks.append(f'<p><strong>Descripción:</strong> {desc}</p>')
    if valor:
        blocks.append(f'<p><strong>Valor:</strong> ${valor}</p>')
    return '\n                    '.join(blocks) if blocks else '<p><strong>Descripción:</strong> Información no disponible.</p>'

def build_features(desc: str):
    m = re.search(r'(\d+)\s*habitacion', desc, re.IGNORECASE)
    if m:
        return f'<span><i class="fas fa-bed"></i> {m.group(1)} habitaciones</span>'
    return ''

def generate_thumbnails(images):
    tags = []
    for i, f in enumerate(images):
        cls = 'thumbnail active' if i == 0 else 'thumbnail'
        tags.append(f'<img src="{f}" alt="{f}" class="{cls}" data-index="{i}" onclick="showImage({i})">')
    return '\n                        '.join(tags)


def apply_to_folder(folder: Path):
    info_path = folder / 'INFO.txt'
    info_text = info_path.read_text(encoding='utf-8', errors='ignore') if info_path.exists() else ''
    desc, valor, tel_visible, tel_href = extract_info(info_text)

    portada, images = select_images(folder)
    if not images:
        print(f'[skip] No images in {folder}')
        return

    thumbnails_html = generate_thumbnails(images)
    section_title = f"{folder.name}"
    meta_description = (desc[:160] if desc else f"Detalles de {folder.name}").replace('\n', ' ')

    html = HTML_TEMPLATE.substitute(
        page_title=section_title,
        meta_description=meta_description,
        ICO_REL=ICO_REL,
        CSS_REL=CSS_REL,
        JS_REL=JS_REL,
        section_title=section_title,
        main_image=portada,
        thumbnails=thumbnails_html,
        info_blocks=build_info_blocks(desc, valor),
        features_block=build_features(desc),
        tel_href=tel_href,
        tel_visible=tel_visible,
    )

    out_path = folder / 'index.html'
    out_path.write_text(html, encoding='utf-8')
    print(f'[ok] Wrote {out_path}')


def main():
    count = 0
    for category in ('VIVIENDAS', 'LOCALES'):
        base = IMG_ROOT / category
        if not base.exists():
            continue
        for item in base.iterdir():
            if item.is_dir():
                apply_to_folder(item)
                count += 1
    print(f'Done. Updated {count} folders.')

if __name__ == '__main__':
    main()