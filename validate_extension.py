#!/usr/bin/env python3
"""
Script de validation pour l'extension User Agent Switcher
Vérifie que tous les fichiers nécessaires sont présents et valides
"""

import os
import json
import sys

def check_file_exists(filepath, description):
    """Vérifie qu'un fichier existe"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} MANQUANT: {filepath}")
        return False

def validate_manifest():
    """Valide le fichier manifest.json"""
    try:
        with open('manifest.json', 'r') as f:
            manifest = json.load(f)
        
        required_fields = ['manifest_version', 'name', 'version', 'permissions', 'background', 'action']
        missing_fields = []
        
        for field in required_fields:
            if field not in manifest:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"❌ Champs manquants dans manifest.json: {missing_fields}")
            return False
        
        if manifest['manifest_version'] != 3:
            print(f"❌ Manifest version incorrecte: {manifest['manifest_version']} (attendu: 3)")
            return False
        
        print("✅ manifest.json valide")
        return True
        
    except json.JSONDecodeError:
        print("❌ manifest.json contient du JSON invalide")
        return False
    except FileNotFoundError:
        print("❌ manifest.json introuvable")
        return False

def validate_icons():
    """Valide la présence des icônes"""
    icons = ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png']
    all_present = True
    
    for icon in icons:
        if not check_file_exists(icon, f"Icône {icon}"):
            all_present = False
    
    return all_present

def validate_js_files():
    """Valide les fichiers JavaScript"""
    js_files = [
        ('popup.js', 'Script de l\'interface'),
        ('background.js', 'Service Worker'),
        ('content.js', 'Content Script'),
        ('inject.js', 'Script d\'injection')
    ]
    
    all_valid = True
    
    for filepath, description in js_files:
        if check_file_exists(filepath, description):
            # Vérification basique du contenu
            try:
                with open(filepath, 'r') as f:
                    content = f.read()
                
                if len(content.strip()) == 0:
                    print(f"⚠️  {description} est vide: {filepath}")
                    all_valid = False
                elif 'chrome.' not in content:
                    print(f"⚠️  {description} ne semble pas utiliser l'API Chrome: {filepath}")
                
            except Exception as e:
                print(f"❌ Erreur lors de la lecture de {filepath}: {e}")
                all_valid = False
        else:
            all_valid = False
    
    return all_valid

def validate_html():
    """Valide le fichier HTML"""
    if check_file_exists('popup.html', 'Interface HTML'):
        try:
            with open('popup.html', 'r') as f:
                content = f.read()
            
            required_elements = ['<table', 'input[type="radio"]', 'name="useragent"']
            missing_elements = []
            
            for element in required_elements:
                if element not in content:
                    missing_elements.append(element)
            
            if missing_elements:
                print(f"⚠️  Éléments manquants dans popup.html: {missing_elements}")
                return False
            
            print("✅ popup.html contient les éléments requis")
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la validation de popup.html: {e}")
            return False
    
    return False

def main():
    """Fonction principale de validation"""
    print("🔍 Validation de l'extension User Agent Switcher\n")
    
    # Vérifier que nous sommes dans le bon répertoire
    if not os.path.exists('manifest.json'):
        print("❌ Veuillez exécuter ce script depuis le répertoire de l'extension")
        sys.exit(1)
    
    # Tests de validation
    tests = [
        ("Manifest", validate_manifest),
        ("Icônes", validate_icons),
        ("Fichiers JavaScript", validate_js_files),
        ("Interface HTML", validate_html)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n📋 Test: {test_name}")
        result = test_func()
        results.append((test_name, result))
    
    # Fichiers optionnels
    print(f"\n📋 Fichiers optionnels:")
    optional_files = [
        ('README.md', 'Documentation'),
        ('test.html', 'Page de test'),
        ('install.md', 'Guide d\'installation')
    ]
    
    for filepath, description in optional_files:
        check_file_exists(filepath, description)
    
    # Résumé
    print(f"\n📊 Résumé de la validation:")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSÉ" if result else "❌ ÉCHEC"
        print(f"  {test_name}: {status}")
    
    print(f"\nRésultat global: {passed}/{total} tests passés")
    
    if passed == total:
        print("\n🎉 Extension prête pour l'installation !")
        print("📝 Suivez les instructions dans install.md pour installer l'extension")
    else:
        print("\n⚠️  Certains problèmes doivent être corrigés avant l'installation")
        sys.exit(1)

if __name__ == "__main__":
    main()
