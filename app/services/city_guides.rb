class CityGuides
  GUIDES = {
    "AMS" => {
      tagline:    "Vélos, canaux et coffeeshops",
      hero:       "Pédalez le long des canaux puis flânez dans le Jordaan jusqu'à la nuit tombée.",
      must_do:    ["Croisière sur les canaux", "Musée Van Gogh", "Quartier Jordaan"],
      cost:       "€€€",
      cost_label: "Cher",
      season:     "Mai – Sept",
      vibes:      ["Vélo", "Musées", "Bières"]
    },
    "BCN" => {
      tagline:    "Soleil, Gaudí et tapas en terrasse",
      hero:       "Plongez dans Barcelone : architecture surréaliste, plages urbaines et tapas au coucher du soleil.",
      must_do:    ["Sagrada Família", "Park Güell", "Barri Gòtic & Las Ramblas"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Avr – Juin",
      vibes:      ["Plage", "Architecture", "Tapas"]
    },
    "PRG" => {
      tagline:    "Capitale d'or aux ponts médiévaux",
      hero:       "La ville aux cent clochers : ponts en pierre, châteaux et bières à 2€ pour finir la soirée.",
      must_do:    ["Pont Charles", "Château de Prague", "Horloge astronomique"],
      cost:       "€",
      cost_label: "Bon marché",
      season:     "Mai – Sept",
      vibes:      ["Histoire", "Bière", "Gothique"]
    },
    "LIS" => {
      tagline:    "Tramways jaunes, fado et pastéis",
      hero:       "Sept collines, des azulejos partout et un océan à perte de vue depuis Belém.",
      must_do:    ["Alfama & tramway 28", "Tour de Belém", "Pastéis de Belém"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Mar – Mai",
      vibes:      ["Océan", "Fado", "Azulejos"]
    },
    "VIE" => {
      tagline:    "Valses, palais et cafés viennois",
      hero:       "Capitale impériale : palais, opéras et cafés où l'on s'attarde des heures sur une sachertorte.",
      must_do:    ["Palais de Schönbrunn", "Cathédrale Saint-Étienne", "Café Sacher"],
      cost:       "€€€",
      cost_label: "Cher",
      season:     "Mai – Sept",
      vibes:      ["Impérial", "Musique", "Cafés"]
    },
    "FCO" => {
      tagline:    "Empire, pizza al taglio et dolce vita",
      hero:       "Marchez sur 2 500 ans d'histoire entre deux gelati, finissez par un spritz au Trastevere.",
      must_do:    ["Colisée & Forum", "Vatican & Chapelle Sixtine", "Fontaine de Trevi"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Avr – Juin",
      vibes:      ["Antique", "Gelato", "Piazzas"]
    },
    "BUD" => {
      tagline:    "Bains thermaux et nuits sous le Danube",
      hero:       "Détendez-vous dans des thermes centenaires le matin, dansez dans une ruin bar le soir.",
      must_do:    ["Bains Széchenyi", "Parlement & Pont des Chaînes", "Ruin bars du quartier juif"],
      cost:       "€",
      cost_label: "Bon marché",
      season:     "Mai – Sept",
      vibes:      ["Thermes", "Architecture", "Festif"]
    },
    "OPO" => {
      tagline:    "Vins doux et façades en azulejos",
      hero:       "Le Douro à vos pieds, un verre de porto à la main, le tout dans un dédale médiéval.",
      must_do:    ["Caves de Vila Nova de Gaia", "Librairie Lello", "Coucher de soleil sur la Ribeira"],
      cost:       "€",
      cost_label: "Bon marché",
      season:     "Mai – Sept",
      vibes:      ["Vin", "Fleuve", "Azulejos"]
    },
    "BER" => {
      tagline:    "Histoire, street art et nuits sans fin",
      hero:       "Capitale alternative par excellence : musées le jour, clubs mythiques jusqu'au lundi matin.",
      must_do:    ["East Side Gallery", "Île aux musées", "Marché de Mauerpark"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Mai – Sept",
      vibes:      ["Alternatif", "Histoire", "Clubs"]
    },
    "CPH" => {
      tagline:    "Hygge, vélos et design scandinave",
      hero:       "Bonheur danois en mode lent : à vélo entre cafés cosy, design épuré et eau partout.",
      must_do:    ["Jardins de Tivoli", "Nyhavn & Petite Sirène", "Christianshavn à vélo"],
      cost:       "€€€€",
      cost_label: "Très cher",
      season:     "Juin – Août",
      vibes:      ["Hygge", "Design", "Cyclable"]
    },
    "DUB" => {
      tagline:    "Pubs, littérature et vert d'Irlande",
      hero:       "Une pinte de Guinness, du folk live et 1 000 ans d'histoire à chaque coin de rue.",
      must_do:    ["Trinity College & Book of Kells", "Temple Bar", "Guinness Storehouse"],
      cost:       "€€€",
      cost_label: "Cher",
      season:     "Mai – Sept",
      vibes:      ["Pubs", "Folk", "Littérature"]
    },
    "ATH" => {
      tagline:    "Berceau de la civilisation occidentale",
      hero:       "Marbre antique, mezze à 5€ et un cap Sounion qui plonge dans la mer Égée au crépuscule.",
      must_do:    ["Acropole & Parthénon", "Plaka & Monastiraki", "Cap Sounion au coucher"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Avr – Juin",
      vibes:      ["Antique", "Méditerranée", "Mezze"]
    },
    "KRK" => {
      tagline:    "Joyau médiéval polonais",
      hero:       "La plus belle place médiévale d'Europe, des pierogi à volonté et une mémoire vibrante.",
      must_do:    ["Place du Marché Rynek", "Château du Wawel", "Mémorial d'Auschwitz"],
      cost:       "€",
      cost_label: "Bon marché",
      season:     "Mai – Sept",
      vibes:      ["Médiéval", "Mémoire", "Pierogi"]
    },
    "EDI" => {
      tagline:    "Châteaux, kilts et pubs cosy",
      hero:       "Une forteresse perchée, des ruelles hantées et un dram de whisky pour conclure.",
      must_do:    ["Château d'Édimbourg", "Royal Mile & Arthur's Seat", "Scotch Whisky Experience"],
      cost:       "€€€",
      cost_label: "Cher",
      season:     "Mai – Sept",
      vibes:      ["Highland", "Festival", "Whisky"]
    },
    "ARN" => {
      tagline:    "Archipel scandinave et innovation",
      hero:       "14 îles reliées par des ponts, un design qui défie les lois de la pesanteur, et l'été qui ne dort jamais.",
      must_do:    ["Gamla Stan", "Musée Vasa", "Tour des îles en kayak"],
      cost:       "€€€€",
      cost_label: "Très cher",
      season:     "Juin – Août",
      vibes:      ["Îles", "Design", "Nature"]
    },
    "SVQ" => {
      tagline:    "Flamenco, oranges et chaleur andalouse",
      hero:       "Patios fleuris, cathédrale géante et soirées flamenco qui finissent au petit matin.",
      must_do:    ["Cathédrale & Giralda", "Alcázar & Plaza de España", "Flamenco à Triana"],
      cost:       "€€",
      cost_label: "Modéré",
      season:     "Mar – Mai",
      vibes:      ["Flamenco", "Tapas", "Andalou"]
    }
  }.freeze

  DEFAULT = {
    tagline:    "Une nouvelle aventure vous attend",
    hero:       "Une fiche de présentation détaillée arrive bientôt pour cette destination.",
    must_do:    ["Centre historique", "Spécialités locales", "Vie nocturne"],
    cost:       "€€",
    cost_label: "Modéré",
    season:     "Toute l'année",
    vibes:      ["Découverte"]
  }.freeze

  def self.for(airport_code)
    GUIDES[airport_code.to_s.upcase] || DEFAULT
  end

  def self.all
    GUIDES
  end
end
