# Guide de Conversion - Colorful PWA Extension

## 📦 Résumé de la Conversion

Cette extension Chrome a été convertie de:
- ❌ React 16.14 + TypeScript + Webpack + npm
- ✅ HTML + JavaScript vanilla + CSS (sans dépendances)

## 🚀 Installation et Chargement

1. **Ouvrir Chrome/Chromium**
2. **Aller à `chrome://extensions/`**
3. **Activer "Mode de développeur"** (en haut à droite)
4. **Cliquer sur "Charger l'extension non empaquetée"**
5. **Sélectionner le dossier `extension/`**

L'extension est maintenant prête à utiliser!

## 📁 Structure des Fichiers

```
extension/
├── manifest.json          # Configuration de l'extension (Manifest V3)
├── popup.html             # Interface UI du popup
├── popup.css              # Styles du popup
├── popup.js               # Logic JavaScript vanilla
├── contentScript.js       # Script injecté dans les pages web
├── background.js          # Service worker
├── offscreen.html         # Document hors-écran
├── offscreen.js           # Logic hors-écran
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon16_dark.png
│   ├── icon48_dark.png
│   └── icon128_dark.png
└── README.md
```

## 🔄 Changements par Fichier

### popup.tsx → popup.html + popup.js + popup.css

**Avant (React + Material-UI):**
- Composant React avec hooks
- Material-UI pour les inputs
- react-color pour le color picker

**Après (Vanilla JavaScript):**
- HTML simple avec inputs standards
- CSS personnalisé mimant le design Material
- Gestion d'état JavaScript native
- Color picker HTML5 natif

**Fonctionnalités conservées:**
- ✓ Dark mode support
- ✓ Lecture/écriture de l'URL active
- ✓ Stockage Chrome Sync
- ✓ Communication avec les content scripts
- ✓ UI responsive

### contentScript.ts → contentScript.js

- Conversion TypeScript → JavaScript brut
- Toute la logique conservée
- Gestion des meta tags theme-color
- Communication avec le popup

### eventPage.ts → background.js

- Conversion en Service Worker (Manifest V3)
- Gestion des icônes en dark/light mode
- Changement en temps réel du media query

### offscreen.ts → offscreen.html + offscreen.js

- Détection du dark mode
- Communication avec le background worker

## ⚙️ Manifest.json (v3)

Mise à jour vers **Manifest V3** (requis par Chrome):
- ✓ `permissions` pour storage, tabs, offscreen
- ✓ `host_permissions` pour <all_urls>
- ✓ `content_scripts` pour injection
- ✓ `service_worker` au lieu de background page

## 💾 Stockage Chrome

L'extension utilise `chrome.storage.sync`:
- Stockage par URL du site
- Synchronisation multi-appareils
- Format: `{ [url]: { enabled: boolean, color: string } }`

## 🎨 Avantages de cette Version

1. **Pas de build process** - Édition directe des fichiers
2. **Pas de dépendances npm** - Fichier source ~40KB total
3. **Performance** - Pas d'overhead React/webpack
4. **Maintenance** - Code simple et compréhensible
5. **Déploiement** - Directement sur Chrome Web Store

## 🔧 Développement

Pour modifier l'extension:

1. Éditez les fichiers dans `extension/`
2. Allez à `chrome://extensions/`
3. Cliquez sur l'icône rafraîchir de l'extension
4. Testez dans les pages web

**Conseil:** Ouvrez la console de développement de Chrome (F12) pour voir les logs du background et des content scripts.

## 📝 Notes Importantes

- Les icônes sont copiées de `dist/`
- Le code utilise les APIs Chrome standard (chrome.storage, chrome.tabs, etc.)
- Compatibilité: Chrome 88+ (Manifest V3)
- Pour Firefox: adaptations mineures nécessaires (chrome → browser API)

## 🆘 Dépannage

**L'extension ne se charge pas?**
- Vérifiez que `manifest.json` est valide
- Assurez-vous que le Mode de développeur est activé
- Rechargez l'extension

**Les couleurs ne changent pas?**
- Vérifiez que le site est dans la liste des permissions
- Ouvrez la console du site (F12) pour les erreurs
- Vérifiez que "Enabled" est coché

**Dark mode ne fonctionne pas?**
- Les icônes dark ne s'affichent que si elles existent dans `icons/`
- Vérifiez votre préférence système dark/light

## 📦 Production

Pour packager l'extension:

```bash
cd extension/
zip -r colorful-pwa.zip . -x "*.git*"
```

Uploadez sur [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)

---

**Version:** 1.0.0
**Convertie le:** 2026-04-17
**Original:** React 16.14 + TypeScript
**Convertie en:** HTML + JavaScript Vanilla
