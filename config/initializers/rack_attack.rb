class Rack::Attack
  # ── Throttles ──────────────────────────────────────────────────────────────

  # Votes publics : max 20 votes par IP par heure.
  # Couvre le cas où quelqu'un essaierait de spammer des votes pour un trip.
  throttle("votes/ip", limit: 20, period: 1.hour) do |req|
    req.ip if req.path.include?("/votes") && req.post?
  end

  # Connexions Devise : max 10 tentatives par IP sur 20 minutes.
  # Limite le brute-force sur les mots de passe.
  throttle("logins/ip", limit: 10, period: 20.minutes) do |req|
    req.ip if req.path == "/users/sign_in" && req.post?
  end

  # Inscriptions : max 5 comptes par IP par heure.
  throttle("signups/ip", limit: 5, period: 1.hour) do |req|
    req.ip if req.path == "/users" && req.post?
  end

  # ── Response pour les requêtes bloquées ────────────────────────────────────

  self.throttled_responder = lambda do |env|
    req = Rack::Request.new(env)
    if req.get_header("HTTP_ACCEPT")&.include?("text/vnd.turbo-stream.html")
      # Retourne un Turbo Stream avec message d'erreur pour les votes
      [
        429,
        { "Content-Type" => "text/vnd.turbo-stream.html; charset=utf-8", "Retry-After" => "3600" },
        ["<turbo-stream action=\"update\" target=\"flash-notice\"><template>" \
         "<p class='text-red-600 text-sm'>Trop de tentatives. Réessayez dans une heure.</p>" \
         "</template></turbo-stream>"]
      ]
    else
      [
        429,
        { "Content-Type" => "text/html; charset=utf-8", "Retry-After" => "3600" },
        ["<h1>Trop de tentatives</h1><p>Réessayez dans une heure.</p>"]
      ]
    end
  end
end
