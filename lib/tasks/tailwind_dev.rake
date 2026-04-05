# Force Tailwind debug mode (no --minify) in development so that @source directives
# in app/assets/tailwind/application.css are correctly resolved.
# Without this, Tailwind v4.2.x ignores @source directives when --minify is active.
if Rails.env.development?
  ENV["TAILWINDCSS_DEBUG"] = "1"
end
