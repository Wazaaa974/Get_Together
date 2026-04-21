class ErrorsController < ApplicationController
  skip_before_action :authenticate_user!, raise: false

  def not_found
    render status: :not_found
  end

  def unprocessable
    render status: :unprocessable_entity
  end

  def internal_error
    render status: :internal_server_error
  end
end
