class UsersController < ApplicationController

    def create
        # create user from params, render json response to be sent back to frontend
        # no user auth, anybody can login with any username
        # when js posts user sign up data how/what is returned??
        # ---->JSON.stringify needs to POST a dataset matching user_params
        
        user = User.find_or_create_by(username: user_params[:username])
        
        if user.save
            games = user.games.order(score: :desc).limit(5)
            # high_score = user.games.order(score: :desc).limit(1)
            
            if games.any?
                render json: {username: user.username, id: user.id, games: games}
            else
                render json: {username: user.username, id: user.id}
            end
        end
    end

    # vvv Do I even need this?? vvv
    def show
        # what flow is needed to find User?? find_by(id: user_params[:id or :username])?
        # user = User.find_by(id: user_params[:id])
        # if authenticated/logged in, return user json to frontend
        # render json: user
    end

    def update
        user = User.find_by(id: user_params[:id])
        
        game = user.games.new
        game.score = params[:score]
        if game.score != nil && game.score > 0 
            game.save
            games = user.games.order(score: :desc).limit(5)
            render json: {user: user, game: game, games: games}
        end
    end

    def destroy
    end



    private

    def user_params
        params.require(:user).permit(:id, :username)
    end


end