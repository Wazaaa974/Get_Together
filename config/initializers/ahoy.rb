class Ahoy::Store < Ahoy::DatabaseStore
end

# RGPD : masque le dernier octet des IPs avant stockage
Ahoy.mask_ips = true

# Pas de cookie persistant côté client — tracking server-side uniquement
Ahoy.cookies = :none

# Pas de géolocalisation (latence inutile)
Ahoy.geocode = false

# Pas d'API JS publique exposée (on track uniquement server-side)
Ahoy.api = false
