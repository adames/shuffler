class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.belongs_to :image, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.integer :moves, default: 0
      t.string :tiles_order
      t.string :solution
      t.timestamps
    end
  end
end
