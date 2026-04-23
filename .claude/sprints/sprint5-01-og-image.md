# Sprint 5 — Ticket #1 : OG image dynamique partage

**PM :** Alex · **Priorité :** 🚀 Maintenant · **RICE :** 14.4 · **Effort :** 0.5j

## 🎯 Problème utilisateur
Quand un organisateur colle le lien de résultats dans WhatsApp / Telegram / iMessage / Slack, ses amis voient une preview générique "Get Together — Trouvez où se retrouver". Le lien se noie dans la conversation et ne déclenche pas le clic.

**Job to be done :** *"Je veux que mes potes voient tout de suite la ville gagnante + le prix, sans cliquer, pour qu'ils aient envie d'ouvrir."*

## 💡 Proposition
Générer à la volée une image OG 1200×630 personnalisée par trip : titre du trip, ville gagnante en grand, prix total, liste des villes de départ. Utiliser la stack Rails (ERB + Grover/Ferrum pour screenshot). L'infrastructure meta OG existe déjà dans le layout (`content_for :og_image`), il ne reste qu'à générer l'URL de l'image et à cabler le contenu.

## ✅ Critères d'acceptance
- [ ] Route `GET /trips/:share_token/og.png` renvoie une image 1200×630 PNG
- [ ] L'image affiche : titre du trip, ville gagnante (font Fraunces, gt-forest), prix total (gt-orange), liste des villes de participants (max 8, troncature "+3 autres")
- [ ] Avant calcul terminé : image fallback "Un trip est en cours de planification" (pas de prix)
- [ ] Après calcul : image avec vraies données
- [ ] Page publique `trips/show` (version partagée) appelle `content_for :og_image, trip_og_url(trip)` et `content_for :og_title, "#{trip.title} — Tout le monde à #{winning_city} pour #{total_price}€"`
- [ ] Image cachée sur disque (ou ActiveStorage) avec clé `trip_#{id}_v#{cache_key_version}.png` — régénérée si `trip.updated_at` ou `route_quotes` changent
- [ ] Test manuel : coller le lien dans WhatsApp Web, iMessage (mobile), Telegram, Slack → preview OK
- [ ] Fallback statique `og-image.png` conservé pour landing + pages non-trip

## ⚠️ Risques & points d'attention
- **Technique — Grover/Ferrum :** nécessite Chromium dans le container Railway. Vérifier le Dockerfile, ajouter `RUN apt-get install -y chromium` si besoin. Coût RAM non négligeable.
  - *Plan B simple :* MiniMagick + template PNG statique + overlay texte (moins joli mais zéro dépendance navigateur).
- **Cache invalidation :** si on régénère à chaque vue, coût CPU élevé. Toujours passer par le cache filesystem, et invalider seulement sur update du trip.
- **WhatsApp cache OG :** WhatsApp cache les previews agressivement (~7 jours). Si Thomas itère sur le design, tester via [opengraph.xyz](https://www.opengraph.xyz/) ou `?v=N` query string pour forcer le refresh côté dev.
- **CSP :** la route de l'image doit être accessible publiquement (pas de login required) — vérifier que `skip_before_action :authenticate_user!` est OK sur cette route.
- **Taille image :** viser < 300 KB pour éviter que Slack/iMessage ignorent.

## 📋 Tickets suggérés
1. **Backend :** créer `OgImageController#show` avec `params[:share_token]`, retour PNG binary
2. **Service :** créer `app/services/trip_og_image_generator.rb` (pattern `.call(trip)` → retourne Tempfile ou ActiveStorage blob)
3. **Template ERB :** `app/views/og_images/trip.html.erb` (HTML autonome avec `<style>` inline, font Fraunces, palette gt-*)
4. **Layout :** dans `trips/show.html.erb` (vue publique), ajouter `content_for :og_image, og_image_url(trip.share_token)` + `content_for :og_title` + `og_description`
5. **Route :** `get '/og/:share_token.png', to: 'og_images#show', as: :og_image`
6. **Test manuel** : pipeline WhatsApp / iMessage / Slack / Telegram / Twitter Card Validator

## 🔢 Priorisation
- **Impact :** Fort — premier point de contact du lien partagé
- **Effort :** Faible (0.5 jour si Grover déjà installable, 1 jour avec fallback MiniMagick)
- **Verdict :** 🚀 À faire en premier dans le sprint

## ❓ Questions à Thomas
1. Grover/Ferrum OK ou on part sur MiniMagick + template statique ?
2. On teste d'abord en dev avec ngrok ou on déploie direct sur Railway ?
3. Inclure le nom de l'organisateur (first_name) dans l'image ou juste le titre du trip ?
