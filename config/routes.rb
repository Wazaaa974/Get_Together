Rails.application.routes.draw do
  devise_for :users
  root "trips#index"

  get "/trips/shared/:share_token", to: "trips#shared", as: :shared_trip
  get "/trips/shared/:share_token/results", to: "trips#shared_results", as: :shared_trip_results
  post "/trips/shared/:share_token/participants", to: "shared_participants#create", as: :shared_trip_participants
  get "/trips/shared/:share_token/og.png", to: "og_images#show", as: :trip_og_image

  resources :trips do
    resources :participants, only: [:edit, :create, :update, :destroy]
    resources :candidate_cities, only: [:create, :destroy] do
      member do
        patch :toggle_excluded
      end
    end
    resources :votes, only: [:create]
    member do
      post :optimize
      get  :results
      get  :waiting
      get  :optimization_status
      get  :claim
      post :save_notification_email
    end
  end

  post "/t", to: "tracking#create", as: :track_event

  namespace :admin do
    get "metrics", to: "metrics#show"
  end

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
  match "/422", to: "errors#unprocessable", via: :all
  match "/500", to: "errors#internal_error", via: :all
end
