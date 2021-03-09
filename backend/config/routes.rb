Rails.application.routes.draw do
  namespace :api do
    resources :games, only: [:index]
  end
end
