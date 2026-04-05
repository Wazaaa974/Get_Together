# Get Together — Contexte projet pour Claude Code

## Résumé du projet

**Get Together** est une application web Rails qui aide un groupe de personnes vivant dans des villes différentes à trouver le meilleur lieu de rencontre selon un critère principal : **le coût total du déplacement pour le groupe**.

Le constat : quand plusieurs personnes veulent se voir, personne ne teste vraiment les villes intermédiaires. Get Together automatise ce calcul et propose une décision objectivée.

---

## Vision produit

> **Aider un groupe de personnes dispersées géographiquement à trouver le meilleur endroit pour se retrouver selon un score optimisé.**

**Pitch court :**
*Get Together helps groups of people living in different cities find the cheapest place to meet by comparing the total travel cost for everyone.*

---

## Périmètre du MVP

### Ce que le MVP doit faire
1. Créer un scénario de rencontre (Trip)
2. Ajouter plusieurs participants avec leur ville d'origine
3. Définir une liste de villes candidates
4. Interroger l'API Amadeus pour les prix de vols
5. Calculer le coût total par ville candidate (somme des prix de tous les participants)
6. Classer les résultats et afficher une recommandation claire

### Ce que le MVP ne doit PAS faire
- Réservation directe
- Authentification utilisateur (ajoutée plus tard)
- Optimisation multi-objectifs (CO2, coût de la vie, temps)
- Calendrier complexe
- Train + autres transports (avion uniquement pour commencer)
- Europe uniquement dans un premier temps

### Score MVP
```
Score = somme des coûts de transport de tous les participants vers une ville candidate
```
Exemple :
- Paris → Dublin = 80€
- Madrid → Dublin = 60€
- Londres → Dublin = 40€
- **Score Dublin = 180€** ← la ville avec le score le plus bas gagne

---

## Stack technique

| Composant | Choix |
|-----------|-------|
| Backend | Ruby on Rails |
| Base de données | PostgreSQL |
| CSS | Tailwind CSS |
| Frontend | Rails views + Hotwire/Stimulus |
| API transport | **Amadeus API** (sandbox gratuite) |
| Auth | Aucune pour le MVP |
| Environnement dev | Mac |

---

## Ce qui est déjà fait

### Initialisation
- [x] App Rails créée : `rails new get_together --database=postgresql --css=tailwind`
- [x] Base de données créée : `rails db:create`
- [x] Serveur fonctionnel sur `http://127.0.0.1:3000`

### Modèles & migrations (tous migrés)
- [x] `Trip` — title, start_date, end_date, status
- [x] `Participant` — trip:references, name, origin_city, origin_airport_code
- [x] `CandidateCity` — trip:references, city_name, country_code, airport_code
- [x] `RouteQuote` — trip:references, participant:references, candidate_city:references, price_cents, currency, duration_minutes, transport_type

### Associations dans les modèles
```ruby
# Trip
has_many :participants, dependent: :destroy
has_many :candidate_cities, dependent: :destroy
has_many :route_quotes, dependent: :destroy

# Participant
belongs_to :trip
has_many :route_quotes, dependent: :destroy

# CandidateCity
belongs_to :trip
has_many :route_quotes, dependent: :destroy

# RouteQuote
belongs_to :trip
belongs_to :participant
belongs_to :candidate_city
def price_euros = price_cents / 100.0  # méthode utilitaire
```

### Note importante sur price_cents
Les prix sont stockés en **centimes** (entier) pour éviter les bugs d'arrondi. 180.50€ = 18050. Utiliser `route_quote.price_euros` dans les vues.

---

## Ce qui reste à faire (par ordre de priorité)

### Sprint 2 — Routes, Controllers, Vues de base ✅ (2026-04-05)
- [x] Routes Rails (nested resources : Trip > Participants, Trip > CandidateCities)
- [x] TripsController (CRUD)
- [x] ParticipantsController (create, destroy)
- [x] CandidateCitiesController (create, destroy)
- [x] Vues : formulaire de création de trip, ajout participants, ajout villes candidates

### Sprint 3 — Logique métier (services) ✅ (2026-04-05)
- [x] `AirportResolver` — transforme une ville en code aéroport (ex: Paris → CDG, ORY)
- [x] `TransportQuoteFetcher` — mock déterministe, structure prête pour Amadeus
- [x] `CandidateCityEvaluator` — calcule le coût total pour une ville candidate
- [x] `TripOptimizer` — boucle sur toutes les villes candidates et trie les résultats
- [x] `ScoreCalculator` — somme des prix (extensible plus tard)

### Sprint 4 — Branchement API Amadeus (partiel)
- [ ] Inscription sandbox Amadeus : https://developers.amadeus.com
- [ ] Clés API dans les credentials Rails (`AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`)
- [ ] Remplacer `TransportQuoteFetcher#fetch_mock` par `#fetch_amadeus`
- [x] Stockage des `RouteQuote` en base (fait dans CandidateCityEvaluator)
- [x] Gestion des erreurs et cas sans itinéraire

### Sprint 5 — Page résultats & UI ✅ (2026-04-05)
- [x] Page résultat avec ville recommandée
- [x] Coût total affiché
- [x] Détail par participant
- [x] Top 5 alternatives en tableau comparatif
- [x] Bug fix surcoût : `.round` → `.ceil` pour éviter "+€0" quand diff < 50 centimes

### Tests navigateur ✅ (2026-04-05)
- [x] Formulaire création — erreurs de validation visibles (bg-red-50)
- [x] Créer un trip → redirect show + flash notice verte
- [x] Ajout participants + villes candidates depuis show
- [x] Lancer le calcul → page résultats complète
- [x] Édition trip — formulaire pré-rempli, flash "Trip mis à jour"
- [x] Confirmation de suppression (turbo_confirm) — dialog natif bloquant ✅
- [x] Fix Tailwind v4 @source + TAILWINDCSS_DEBUG=1 (lib/tasks/tailwind_dev.rake)

---

## Architecture des routes (cible)

```ruby
Rails.application.routes.draw do
  root "trips#index"

  resources :trips do
    resources :participants, only: [:create, :destroy]
    resources :candidate_cities, only: [:create, :destroy]
    member do
      post :optimize   # lance le calcul TripOptimizer
    end
  end
end
```

---

## Architecture des services (cible)

```
app/
└── services/
    ├── airport_resolver.rb
    ├── transport_quote_fetcher.rb
    ├── candidate_city_evaluator.rb
    ├── trip_optimizer.rb
    └── score_calculator.rb
```

Chaque service utilise le pattern `.call` :
```ruby
TripOptimizer.call(trip)
CandidateCityEvaluator.call(trip, candidate_city)
TransportQuoteFetcher.call(origin: "CDG", destination: "DUB", date: "2025-06-15")
```

---

## Structure de la page résultat (cible)

```
[Bloc 1 — Recommandation]
Best meeting point: Dublin
Total travel cost: €184

[Bloc 2 — Détail par personne]
Thomas (Paris) → Dublin: €62
Margot (Madrid) → Dublin: €71
Bryan (London) → Dublin: €51

[Bloc 3 — Alternatives]
1. Dublin      — €184
2. Brussels    — €196
3. Barcelona   — €211
4. Amsterdam   — €224

[Bloc 4 — Explication]
"Dublin is the cheapest total option for the group
based on available transport prices for the selected dates."
```

---

## Roadmap future (post-MVP)

| Version | Nouveauté |
|---------|-----------|
| V2 | Coût de la vie, budget total séjour |
| V3 | Empreinte carbone, durée de trajet |
| V4 | Score personnalisable par l'utilisateur |
| V4 | Suggestions automatiques de villes candidates |
| V4 | Partage de résultat via lien |
| V5 | Authentification utilisateur |
| V5 | Historique des recherches |

---

## Conventions de code à respecter

- Prix toujours en **centimes** en base (`price_cents`), convertis en euros avec `price_euros`
- Services dans `app/services/`, pattern `.call`
- Pas de logique métier dans les controllers
- Nommage anglais partout dans le code, français autorisé dans les vues
- Garder le code simple et lisible — Thomas est ingénieur chimiste reconverti data analyst avec une expérience Rails du bootcamp Le Wagon
