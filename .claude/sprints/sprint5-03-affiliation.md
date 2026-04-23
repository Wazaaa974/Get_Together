# Sprint 5 — Ticket #3 : Deep links affiliation + tracking clics

**PM :** Alex · **Priorité :** 🚀 Maintenant · **RICE :** 2.1 · **Effort :** 2j

## 🎯 Problème utilisateur
Aujourd'hui, la page résultats affiche un prix Duffel + un lien Google Flights (non-monétisable). L'utilisateur doit re-copier origin/destination/date dans Google/Skyscanner pour acheter. Friction → perte de contexte, et nous passons à côté de la seule monétisation naturelle du produit.

**Job to be done utilisateur :** *"Je veux cliquer une fois et réserver mon vol, sans re-saisir mes dates."*
**Job to be done business :** *"Chaque intention de réservation doit être monétisée via affiliation."*

## 💡 Proposition
Pour chaque RouteQuote affiché, proposer 2-3 CTA de réservation qui pointent vers des deep links Kiwi.com (programme d'affiliation avec commission ~2%) + Skyscanner (si programme approuvé) + Google Flights (fallback non-monétisé mais solide).

Tous les clics passent par un endpoint interne `/bookings/out` qui :
1. Log l'event Ahoy `booking_link_clicked` (cf. ticket #2)
2. Redirige en 302 vers le deep link provider avec nos tracking IDs

## ✅ Critères d'acceptance
- [ ] Méthode `RouteQuote#booking_urls` → `{kiwi: "...", skyscanner: "...", google_flights: "..."}`
- [ ] Les URLs incluent : origin IATA, destination IATA, date aller, date retour (si `end_date`), 1 adulte, currency EUR
- [ ] Paramètres d'affiliation Kiwi (`affilid=xxx`) et Skyscanner (`associateid=xxx`) chargés depuis `Rails.application.credentials`
- [ ] Route `/bookings/out?route_quote_id=X&provider=Y` → log event + redirect 302
- [ ] Page résultats : sous chaque destination, bouton principal **"Réserver avec Kiwi"** (couleur gt-orange), + menu déroulant "Autres options : Skyscanner · Google Flights"
- [ ] Bouton **"Réserver"** par participant dans le détail (pas juste global) — car chacun réserve son propre vol
- [ ] Si `Rails.application.credentials.kiwi.affiliate_id` absent : masquer Kiwi, ne montrer que Google Flights (dégradation gracieuse — utile en dev)
- [ ] Compat mobile : le CTA principal reste cliquable sans ouvrir le menu
- [ ] Test : vérifier que les 3 deep links ouvrent le bon pays/ville/date dans un nouvel onglet (target="_blank" + `rel="noopener"`)

## ⚠️ Risques & points d'attention
- **Affiliation Kiwi :** inscription au [programme partenaire Kiwi.com](https://www.kiwi.com/en/pages/content/affiliates) — validation manuelle, peut prendre quelques jours. **Faire la demande en parallèle du dev.**
- **Affiliation Skyscanner :** programme via impact.com ou Travelpayouts — encore plus long à obtenir (approbation du site requise). Plan B : Travelpayouts qui agrège plusieurs OTAs d'un coup.
- **Sans IDs d'affiliation :** les liens fonctionnent quand même (juste pas de commission). Pas bloquant pour le sprint.
- **Conversion réelle :** le click-to-booking converti à ~1-3% dans le travel affiliate. Sur 100 clics → ~2 réservations → ~4€ de commission. **Ne pas sur-investir dans le design avant d'avoir du volume.**
- **Risque UX :** multiplier les boutons de réservation peut polluer la page résultats. Un CTA principal + un menu déroulant est le bon compromis.
- **Coût Duffel :** pas d'appel API supplémentaire — les deep links sont construits côté app, pas re-quotés chez Kiwi. Le prix affiché peut différer légèrement du prix Kiwi final (disclaimer à prévoir : *"Prix indicatif basé sur Duffel. Prix final chez le partenaire."*)
- **Tracking :** le lien `/bookings/out` doit être cachable par Turbo — ou pas ? Vérifier que le click track n'est pas intercepté par Turbo Drive (ajouter `data-turbo="false"` sur les liens sortants).

## 📋 Tickets suggérés
1. **Business :** Thomas s'inscrit aux programmes affiliation Kiwi + Travelpayouts (**à faire AVANT** le dev, car validation = plusieurs jours)
2. **Service :** créer `app/services/booking_url_builder.rb` avec pattern `.call(route_quote, provider:)` → string URL
3. **Model :** `RouteQuote#booking_urls` qui appelle le builder pour chaque provider disponible
4. **Controller :** `BookingsController#out` (params `route_quote_id`, `provider`) → log Ahoy event + redirect 302
5. **Route :** `get '/out', to: 'bookings#out', as: :booking_out`
6. **Credentials :** `rails credentials:edit` → ajouter `kiwi.affiliate_id` et `skyscanner.associate_id`
7. **Vue résultats :** composant partial `_booking_cta.html.erb` avec bouton principal Kiwi + menu secondaire
8. **Test :** vérifier les URLs générées pour 3 paires origin/destination connues (unit test du builder)
9. **Disclaimer :** ligne discrète sous les boutons : *"Vous serez redirigé vers notre partenaire. Le prix final peut varier."*

## 🔢 Priorisation
- **Impact :** Moyen — monétisation encore non prouvée tant que volume faible. MAIS critique pour valider l'hypothèse business AVANT d'investir ailleurs.
- **Effort :** Moyen (2 jours si IDs affiliation obtenus à temps, sinon 2j + attente validation)
- **Verdict :** 🚀 À faire en parallèle des tickets #1 et #2 — la partie "demande d'affiliation" doit démarrer aujourd'hui car elle est bloquante

## ❓ Questions à Thomas
1. Tu as déjà un compte Kiwi Tequila / Travelpayouts, ou on part de zéro sur les inscriptions ?
2. Tu veux un CTA principal unique (Kiwi) ou les 3 providers visibles à pied d'égalité ?
3. Réservation par participant dans le détail, ou un seul bouton global pour la destination (les utilisateurs peuvent avoir des dates/origines différentes) ?
4. Disclaimer prix indicatif : affichage permanent ou tooltip au survol ?

## 🔗 Notes de dépendance
- **Dépend de ticket #2 (Ahoy)** pour le tracking — si #2 est décalé, émettre juste un log Rails en attendant.
- **Indépendant de ticket #1** (OG image).
