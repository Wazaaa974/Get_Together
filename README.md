# Get Together

Get Together aide un groupe de personnes situees dans plusieurs villes a choisir le meilleur endroit pour se retrouver. L'application compare les prix de vols depuis chaque ville de depart vers plusieurs destinations candidates, additionne les couts pour le groupe, puis classe les destinations du moins cher au plus cher.

L'objectif du MVP est simple : donner une reponse claire a la question "ou est-ce qu'on se retrouve, sans faire un tableur ?".

## Fonctionnalites

- Creation d'un trip avec dates de depart et de retour.
- Ajout de participants avec ville ou aeroport de depart.
- Selection automatique de destinations europeennes populaires.
- Ajout, suppression ou exclusion de villes candidates.
- Recuperation de prix de vols via Duffel.
- Calcul asynchrone des resultats avec Solid Queue.
- Page d'attente avec polling Hotwire/Stimulus.
- Page de resultats avec classement, detail par participant et liens Google Flights.
- Lien public de partage pour rejoindre un trip ou consulter les resultats.
- Votes publics sur les destinations.
- Authentification Devise optionnelle pour retrouver ses trips.
- Analytics serveur avec Ahoy.
- Protection basique contre l'abus avec Rack::Attack.

## Stack

- Ruby 3.3.5
- Rails 8.1
- PostgreSQL
- Tailwind CSS v4
- Hotwire, Turbo et Stimulus
- Solid Queue, Solid Cache et Solid Cable
- Devise pour l'authentification
- Duffel API pour les offres de vols
- Mapbox pour l'autocomplete et la carte des resultats
- Grover + Puppeteer pour la generation d'images OG

## Prerequis

Installez localement :

- Ruby 3.3.5
- PostgreSQL
- Node.js et npm
- Bundler

Sur macOS, assurez-vous que PostgreSQL tourne avant de preparer la base.

## Installation Locale

Clonez le projet, puis installez les dependances Ruby et JavaScript :

```sh
bundle install
npm install
```

Preparez la base de donnees :

```sh
bin/rails db:prepare
```

Lancez l'application, le watcher Tailwind et le worker Solid Queue :

```sh
bin/dev
```

L'application est disponible par defaut sur :

```text
http://localhost:3000
```

## Variables D'environnement

Le projet attend certaines variables selon les fonctionnalites utilisees.

```sh
DUFFEL_API_KEY=...
MAPBOX_TOKEN=...
ADMIN_EMAILS=admin@example.com,other@example.com
DATABASE_URL=postgres://... # production uniquement
```

Details :

- `DUFFEL_API_KEY` est necessaire pour lancer un vrai calcul de prix.
- `MAPBOX_TOKEN` active l'autocomplete de villes et la carte des resultats.
- `ADMIN_EMAILS` donne acces a `/admin/metrics` aux emails listes.
- `DATABASE_URL` est utilise en production.

Sans cle Duffel, l'interface peut se lancer, mais l'optimisation de vols echouera au moment d'appeler l'API.

## Commandes Utiles

Lancer le serveur complet en developpement :

```sh
bin/dev
```

Lancer seulement Rails :

```sh
bin/rails server
```

Lancer le worker Solid Queue :

```sh
bin/jobs
```

Lancer les tests :

```sh
bin/rails test
```

Lancer Brakeman :

```sh
bin/brakeman
```

Lancer RuboCop :

```sh
bin/rubocop
```

## Architecture

Les principales entites metier sont :

- `Trip` : scenario de rencontre, dates, statut et tokens de partage.
- `Participant` : personne du groupe, ville et aeroport de depart.
- `CandidateCity` : destination candidate a evaluer.
- `RouteQuote` : prix et details d'un trajet participant vers destination.
- `Vote` : preference publique pour une destination.

La logique de calcul est regroupee dans `app/services` :

- `AirportResolver` convertit une ville en code IATA.
- `TransportQuoteFetcher` appelle Duffel et met les resultats en cache.
- `CandidateCityEvaluator` calcule les routes pour une destination.
- `ScoreCalculator` additionne les prix en centimes.
- `TripOptimizer` classe les destinations candidates.
- `PopularDestinations` ajoute les destinations europeennes par defaut.

Les jobs asynchrones sont dans `app/jobs`. Le calcul principal passe par `OptimizationJob`.

## Flux Produit

1. Un utilisateur cree un trip.
2. Il ajoute les participants ou partage un lien pour qu'ils s'ajoutent eux-memes.
3. L'application prepare des destinations candidates.
4. Le proprietaire lance l'optimisation.
5. `OptimizationJob` appelle `TripOptimizer`, qui evalue les villes en parallele.
6. Les prix sont stockes dans `route_quotes`.
7. La page resultats lit les prix stockes et affiche le classement.
8. Le lien public permet de partager le resultat et de voter.

## Notes De Developpement

- Les prix sont toujours stockes en centimes avec `price_cents`.
- Les vues affichent les prix en euros via `price_euros` ou une conversion explicite.
- Les trips anonymes sont geres avec un `owner_token` stocke en session.
- Les liens publics utilisent `share_token`.
- Les votes publics sont limites par IP avec Rack::Attack.
- Le projet utilise la locale francaise par defaut.

## Points A Surveiller

Avant une mise en production serieuse, verifier en priorite :

- les cas d'erreur Duffel : token absent, rate limit, aucune offre, timeout ;
- le comportement sans `MAPBOX_TOKEN` ;
- les scripts tiers charges dans le layout ;
- les liens publics de partage et d'administration ;
- la couverture de tests des services metier ;
- l'extraction progressive des grosses vues ERB en partials et controllers Stimulus.

## Documentation Interne

Le fichier `CLAUDE.md` contient l'historique produit et le contexte de developpement initial. Il est utile pour comprendre la vision du MVP, mais ce README reste la porte d'entree principale du projet.
