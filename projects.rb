Team = Struct.new(:slug, :name, keyword_init: true)

teams = [
  Team.new(slug: 'ratchagitja', name: 'Ratchagitja'),
  Team.new(slug: 'greenspaces', name: 'Green Spaces'),
  Team.new(slug: 'bankforthepoor', name: 'Bank for the Poor'),
  Team.new(slug: 'fillyouintheblank', name: 'Fill You In The Blank'),
  Team.new(slug: 'smarttrafficlights', name: 'Smart Traffic Lights'),
  Team.new(slug: 'bkkchangelog', name: 'bkkchangelog'),
]

File.open 'projects.tf', 'w' do |f|
  teams.each do |team|
    f.puts <<~EOF
      resource "discord_category_channel" "#{team.slug}_category" {
        name      = "#{team.name}"
        server_id = var.server_id
      }

      resource "discord_text_channel" "#{team.slug}_text" {
        name      = "#{team.slug}-text"
        server_id = var.server_id
        category  = discord_category_channel.#{team.slug}_category.id
      }
    EOF
  end
end