# Sprint 5 — Ticket #2 : Instrumentation analytics

**PM :** Alex · **Priorité :** 🚀 Maintenant · **RICE :** 8.1 · **Effort :** 1j

## 🎯 Problème utilisateur
(Celui-ci est pour *nous*, pas pour l'utilisateur final.) On ne sait rien aujourd'hui :
- Combien de trips créés / semaine ?
- Quel % de trips vont jusqu'au calcul lancé ?
- Combien de liens partagés sont ouverts par un tiers ?
- Combien de votes par trip ?
- Y a-t-il un drop-off massif entre "résultats affichés" et "vote cliqué" ?

Sans ces données, impossible de savoir si la boucle virale fonctionne ou de prioriser les sprints suivants.

## 💡 Proposition
Installer **Ahoy** (gem Rails, stockage Postgres, RGPD-safe car tout reste chez nous). Définir un set minimal de ~7 events business critiques, les instrumenter dans les controllers/mailers. Créer un dashboard ultra-simple (Blazer ou une page admin custom) avec les 5-6 métriques clés.

**Pourquoi Ahoy et pas PostHog / GA4 :**
- Zéro service externe = pas de RGPD / cookie banner
- Thomas est confortable SQL (data analyst) → Blazer + SQL brut = parfait pour itérer
- Stockage PG : on peut joindre les events aux tables métier (trips, users) facilement

## ✅ Critères d'acceptance
- [ ] Gem `ahoy_matey` installée + migrations `ahoy_visits` / `ahoy_events`
- [ ] Visit tracking automatique activé (sans cookie banner — Ahoy peut être configuré en mode anonyme / sans JS cookies)
- [ ] Les 7 events suivants sont émis avec les bonnes propriétés :
  - `trip_created` {trip_id, participants_count, candidates_count, has_end_date, user_signed_in}
  - `optimization_started` {trip_id}
  - `optimization_completed` {trip_id, duration_s, quotes_count, winning_city, total_price_cents}
  - `share_link_copied` {trip_id} *(front : Stimulus sur bouton copy-to-clipboard)*
  - `trip_opened_via_share` {trip_id, is_owner: bool} *(backend : détection via referrer absent ou via param `?src=share`)*
  - `vote_cast` {trip_id, city_id}
  - `booking_link_clicked` {trip_id, city_id, provider} *(dépend du ticket #3)*
- [ ] Dashboard admin `/admin/metrics` (protégé par `current_user.admin?` — à ajouter un flag `admin` sur User si absent) qui montre sur 30 jours :
  - Trips créés / jour (courbe)
  - Funnel : created → optimized → results_viewed → voted
  - Taux d'ouverture des liens partagés (share_copies vs share_opens)
  - Votes moyens par trip
  - Nombre de bookings cliqués
- [ ] Aucun PII supplémentaire envoyé (pas d'emails, pas de noms) — juste IDs
- [ ] Doc rapide dans `CONTEXT.md` ou `.claude/analytics.md` : "Pour ajouter un event, faire `ahoy.track 'name', {...}`"

## ⚠️ Risques & points d'attention
- **RGPD :** même si self-hosted, tracker les visites = stocker IP + user-agent. Ahoy a un mode `mask_ips` → activer. Pas de cookie persistant (Ahoy peut fonctionner server-side only).
- **Performance :** chaque event = 1 INSERT PG. Sur un MVP c'est négligeable, mais si ça grossit, passer en async via SolidQueue.
- **Volume BDD :** sur 1 an à 100 events/jour = ~36k rows. OK. Prévoir un job de purge > 1 an plus tard.
- **Front events (`share_link_copied`) :** besoin d'un endpoint JSON `/track` côté Rails qui accepte `{event, properties}` → contrôler qu'on n'expose pas un event-forge. Whitelist des events acceptés côté controller.
- **Admin gate :** aujourd'hui pas de flag admin sur User. Option simple : `ADMIN_EMAILS=thomas.alonso93@gmail.com` en ENV, check `current_user.email.in?(ENV['ADMIN_EMAILS'].split(','))`.

## 📋 Tickets suggérés
1. **Setup :** ajouter `ahoy_matey` au Gemfile, `rails g ahoy:install`, migration
2. **Config :** `config/initializers/ahoy.rb` → mode anonymous, mask IPs, no cookie
3. **Events backend :** émettre les events dans `TripsController#create`, `TripsController#optimize`, `TripOptimizer` (completed), `VotesController#create`
4. **Event front :** Stimulus controller `share-button` qui POST `/track` après copy → `TrackingController#create` (whitelist d'events)
5. **Detection share-open :** middleware ou before_action dans `TripsController#show` qui check `request.referrer` (absent + user != owner → `trip_opened_via_share`)
6. **Admin metrics :** route `/admin/metrics`, guard ENV-based, vue SQL directe (pas besoin de Blazer pour 5 métriques)
7. **Doc :** section "Analytics" dans CONTEXT.md

## 🔢 Priorisation
- **Impact :** Fort — débloque toutes les décisions sprints suivants
- **Effort :** Moyen (1 jour, un peu de plomberie front + back)
- **Verdict :** 🚀 À faire après ticket #1 (OG image) car les métriques #1 auront besoin de `trip_opened_via_share` pour mesurer l'effet OG

## ❓ Questions à Thomas
1. OK avec Ahoy + dashboard custom, ou tu préfères un outil SaaS (PostHog EU gratuit jusqu'à 10k events) pour gagner du temps sur les dashboards ?
2. Blazer acceptable ou on reste sur une vue Rails custom ?
3. Flag admin → ENV `ADMIN_EMAILS` OK pour le MVP, ou on ajoute un boolean `admin` sur User tout de suite ?
