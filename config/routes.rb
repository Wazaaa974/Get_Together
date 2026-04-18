Rails.application.routes.draw do
  devise_for :users
  root "trips#index"

  get "/trips/shared/:share_token", to: "trips#shared", as: :shared_trip
  post "/trips/shared/:share_token/participants", to: "shared_participants#create", as: :shared_trip_participants

  resources :trips do
    resources :participants, only: [:edit, :create, :update, :destroy]
    resources :candidate_cities, only: [:create, :destroy]
    resources :votes, only: [:create]
    member do
      post :optimize
      get  :results
      get  :waiting
      get  :optimization_status
      get  :claim
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
  match "/422", to: "errors#unprocessable", via: :all
  match "/500", to: "errors#internal_error", via: :all
end
