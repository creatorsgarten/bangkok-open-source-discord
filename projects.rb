Team = Struct.new(:id, :slug, :name, keyword_init: true)

teams = [
  Team.new(id: 'ratchagitja',        slug: 'ratchagitja',        name: 'Ratchagitja'),
  Team.new(id: 'greenspaces',        slug: 'greenspaces',        name: 'Green Spaces'),
  Team.new(id: 'bankforthepoor',     slug: 'bankforthepoor',     name: 'Bank for the Poor'),
  Team.new(id: 'fillyouintheblank',  slug: 'fillyouintheblank',  name: 'Fill You In The Blank'),
  Team.new(id: 'smarttrafficlights', slug: 'smarttrafficlights', name: 'Smart Traffic Lights'),
  Team.new(id: 'bkkchangelog',       slug: 'bkkchangelog',       name: 'bkkchangelog'),
]

File.open 'projects.tf', 'w' do |f|
  teams.each do |team|
    f.puts <<~EOF
      resource "discord_category_channel" "#{team.id}_category" {
        name      = "#{team.name}"
        server_id = var.server_id
      }
      resource "discord_text_channel" "#{team.id}_text" {
        name      = "#{team.id}"
        server_id = var.server_id
        category  = discord_category_channel.#{team.id}_category.id
      }
      resource "discord_role" "#{team.id}_role" {
        name        = "proj-#{team.id}"
        server_id   = var.server_id
        mentionable = true
      }
      resource discord_message "#{team.id}_rolemessage" {
        channel_id = discord_text_channel.#{team.id}_text.id
        content    = "Welcome to the **#{team.name}** project! (React to this message to join.)"
      }
    EOF
  end
end