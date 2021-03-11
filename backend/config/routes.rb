Rails.application.routes.draw do
    post '/login' => 'sessions#create'
    post '/users' => 'users#create'
    resources :user, only: [:show] do
        resources :games, only: [:index, :show]
    end
    resources :users, only: [:create, :show, :update]
end
