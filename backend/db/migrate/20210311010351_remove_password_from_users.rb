class RemovePasswordFromUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :password_digest
    remove_column :games, :accuracy
  end
end
