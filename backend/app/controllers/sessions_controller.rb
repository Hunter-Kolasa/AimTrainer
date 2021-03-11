class SessionsController < ApplicationController
    def create
        user = User.find_by(username: params[:username])
        if user
            render json: user
        else
            render json: {message: "You made it to the create sessions controller before error"}
        end
    end
end