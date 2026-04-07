# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_04_07_070315) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "candidate_cities", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.string "city_name"
    t.string "country_code"
    t.string "airport_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_candidate_cities_on_trip_id"
  end

  create_table "participants", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.string "name"
    t.string "origin_city"
    t.string "origin_airport_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_participants_on_trip_id"
  end

  create_table "route_quotes", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.bigint "participant_id", null: false
    t.bigint "candidate_city_id", null: false
    t.integer "price_cents"
    t.string "currency"
    t.integer "duration_minutes"
    t.string "transport_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_city_id"], name: "index_route_quotes_on_candidate_city_id"
    t.index ["participant_id", "candidate_city_id"], name: "index_route_quotes_on_participant_id_and_candidate_city_id"
    t.index ["participant_id"], name: "index_route_quotes_on_participant_id"
    t.index ["trip_id", "candidate_city_id"], name: "index_route_quotes_on_trip_id_and_candidate_city_id"
    t.index ["trip_id"], name: "index_route_quotes_on_trip_id"
  end

  create_table "trips", force: :cascade do |t|
    t.string "title"
    t.date "start_date"
    t.date "end_date"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "optimization_status", default: "idle", null: false
    t.bigint "user_id"
    t.string "share_token"
    t.datetime "last_optimized_at"
    t.index ["optimization_status"], name: "index_trips_on_optimization_status"
    t.index ["share_token"], name: "index_trips_on_share_token", unique: true
    t.index ["user_id", "created_at"], name: "index_trips_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_trips_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.bigint "candidate_city_id", null: false
    t.string "voter_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_city_id"], name: "index_votes_on_candidate_city_id"
    t.index ["trip_id", "voter_name"], name: "index_votes_on_trip_id_and_voter_name", unique: true
    t.index ["trip_id"], name: "index_votes_on_trip_id"
  end

  add_foreign_key "candidate_cities", "trips"
  add_foreign_key "participants", "trips"
  add_foreign_key "route_quotes", "candidate_cities"
  add_foreign_key "route_quotes", "participants"
  add_foreign_key "route_quotes", "trips"
  add_foreign_key "trips", "users"
  add_foreign_key "votes", "candidate_cities"
  add_foreign_key "votes", "trips"
end