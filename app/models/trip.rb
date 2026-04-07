class Trip < ApplicationRecord
  belongs_to :user, optional: true

  has_many :participants, dependent: :destroy
  has_many :candidate_cities, dependent: :destroy
  has_many :route_quotes, dependent: :destroy
  has_many :votes, dependent: :destroy

  validates :title, presence: true
  validate :end_date_after_start_date

  before_create :generate_share_token

  def generate_share_token
    self.share_token = SecureRandom.urlsafe_base64(20) until share_token.present? && !Trip.exists?(share_token: share_token)
  end

  private

  def end_date_after_start_date
    return unless start_date.present? && end_date.present?
    if end_date < start_date
      errors.add(:end_date, "doit être après la date de début")
    end
  end
end
