Team = Struct.new(:id, :slug, :name, keyword_init: true)

teams = [
  Team.new(id: 'ratchagitja',        slug: 'ratchagitja',            name: 'Ratchagitja'),
  Team.new(id: 'greenspaces',        slug: 'green-population',       name: 'Green Population'),
  Team.new(id: 'bankforthepoor',     slug: 'bank-for-the-poor',      name: 'Bank for the Poor'),
  Team.new(id: 'fillyouintheblank',  slug: 'fill-you-in-the-blank',  name: 'Fill You In The Blank'),
  Team.new(id: 'smarttrafficlights', slug: 'smart-traffic-lights',   name: 'Smart Traffic Lights'),
  Team.new(id: 'bkkchangelog',       slug: 'bkkchangelog',           name: 'bkkchangelog'),
  Team.new(id: 'policytracka',       slug: 'policytracka',           name: 'policytracka'),
]

File.open 'projects.tf', 'w' do |f|
  teams.each do |team|
    f.puts <<~EOF
      resource "discord_category_channel" "#{team.id}_category" {
        name      = "#{team.name}"
        server_id = var.server_id
      }
      resource "discord_text_channel" "#{team.id}_text" {
        name      = "#{team.slug}"
        server_id = var.server_id
        category  = discord_category_channel.#{team.id}_category.id
      }
      resource "discord_role" "#{team.id}_role" {
        name        = "proj-#{team.slug}"
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
