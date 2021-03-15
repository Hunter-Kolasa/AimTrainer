class GamesController < ApplicationController
    def index
        games = Game.all
        
        render json: games
    end

    # def create
    #     user = User.find_by(username: user_params[:username])
    #     byebug
    #     user.games.build(game_params)
    # end

    # private

    # def game_params
    #     params.require(:game).permit(:score)
    # end

    # def user_params
    #     params.require(:user).permit(:username)
    # end
end