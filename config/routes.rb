Rails.application.routes.draw do
  root "trips#index"

  resources :trips do
    resources :participants, only: [:create, :destroy]
    resources :candidate_cities, only: [:create, :destroy]
    member do
      post :optimize
      get  :results
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
