class UsersController < ApplicationController

    def create
        # create user from params, render json response to be sent back to frontend
        # no user auth, anybody can login with any username
        # when js posts user sign up data how/what is returned??
        # ---->JSON.stringify needs to POST a dataset matching user_params
        if user = User.find_or_create_by(username: user_params[:username])
            games = user.games
            if games.any?
                render json: {username: user.username, games: games}
            else
                render json: {username: user.username}
            end
        else
            render json: {message: "Something happened in UsersController#create"}
        end
    end

    # vvv Do I even need this?? vvv
    def show
        # what flow is needed to find User?? find_by(id: user_params[:id or :username])?
        # user = User.find_by(id: user_params[:id])
        # if authenticated/logged in, return user json to frontend
        # render json: user
    end

    def destroy
    end



    private

    def user_params
        params.require(:user).permit(:username, games_attributes: [:id, :score])
    end


end