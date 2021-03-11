class UsersController < ApplicationController

    def new
        user = User.new
    end

    def create
        # create user from params, render json response to be sent back to frontend
        # should user auth take place here or in js??
        # when js posts user sign up data how/what is returned??
        # ---->JSON.stringify needs to POST a dataset matching user_params
        
        user = User.new(user_params)
        
        if user.save
            render json: user, except: [:password_digest, :created_at, :updated_at]
        else
            render json: {message: "You made it to the userController create method before erroring"}
        end
    end

    def show
        # what flow is needed to find User?? find_by(id: user_params[:id or :username])?
        user = User.find_by(id: user_params[:id])
        # if authenticated/logged in, return user json to frontend
        render json: user
    end

    def edit
    end

    def destroy
    end



    private

    def user_params
        params.require(:user).permit(:username, :password_digest, games_attributes: [:id, :score, :accuracy])
    end


end