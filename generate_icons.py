#!/usr/bin/env python3
"""
Script pour générer les icônes de l'extension User Agent Switcher
Nécessite Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Pillow n'est pas installé. Installez-le avec: pip install Pillow")
    exit(1)

def create_icon(size, filename):
    """Crée une icône avec le texte 'UA' sur fond bleu"""
    
    # Créer une nouvelle image avec fond bleu
    img = Image.new('RGBA', (size, size), (66, 133, 244, 255))  # Bleu Google
    draw = ImageDraw.Draw(img)
    
    # Ajouter une bordure
    border_width = max(1, size // 32)
    draw.rectangle([0, 0, size-1, size-1], outline=(26, 115, 232, 255), width=border_width)
    
    # Calculer la taille de la police
    font_size = int(size * 0.4)
    
    # Essayer d'utiliser une police système, sinon utiliser la police par défaut
    try:
        # Essayer différentes polices selon l'OS
        font_paths = [
            "/System/Library/Fonts/Arial.ttf",  # macOS
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux
            "C:/Windows/Fonts/arial.ttf",  # Windows
        ]
        
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, font_size)
                break
        
        if font is None:
            font = ImageFont.load_default()
            
    except:
        font = ImageFont.load_default()
    
    # Dessiner le texte "UA" au centre
    text = "UA"
    
    # Calculer la position pour centrer le texte
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    # Dessiner le texte en blanc
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Sauvegarder l'image
    os.makedirs('icons', exist_ok=True)
    img.save(f'icons/{filename}', 'PNG')
    print(f"Icône créée: icons/{filename}")

def main():
    """Génère toutes les icônes nécessaires"""
    print("Génération des icônes pour l'extension User Agent Switcher...")
    
    # Créer les icônes aux différentes tailles
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    
    print("Toutes les icônes ont été générées avec succès!")
    print("Vous pouvez maintenant installer l'extension dans Chrome.")

if __name__ == "__main__":
    main()
