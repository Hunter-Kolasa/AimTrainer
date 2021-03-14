# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

    user = User.create(username: 'JohnnyBread')
    user.games.build(score: 20)
    user.games.build(score: 50)
    user2 = User.create(username: 'HerbertEButts')
    user2.games.build(score: 10)
    user2.games.build(score: 125)