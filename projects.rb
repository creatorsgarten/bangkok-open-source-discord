Team = Struct.new(:id, :slug, :name, :text_channels, keyword_init: true) do
  def with_text_channels(**channels)
    self.text_channels ||= {}
    self.text_channels.merge!(channels)
    self
  end
end

teams = [
  Team.new(id: 'ratchagitja',         slug: 'ratchagitja',            name: 'Ratchagitja'),
  Team.new(id: 'greenspaces',         slug: 'green-population',       name: 'Green Population')
    .with_text_channels(wespace: 'we-space'),
  Team.new(id: 'bankforthepoor',      slug: 'bank4all',               name: 'Bank4all'),
  Team.new(id: 'fillyouintheblank',   slug: 'fill-you-in-the-blank',  name: 'Fill You In The Blank')
    .with_text_channels(wikibangkok: 'wikibangkok'),
  Team.new(id: 'smarttrafficlights',  slug: 'smart-traffic-lights',   name: 'Smart Traffic Lights'),
  Team.new(id: 'bkkchangelog',        slug: 'bkkchangelog',           name: 'bkkchangelog'),
  Team.new(id: 'policytracka',        slug: 'policytracka',           name: 'policytracka'),
  Team.new(id: 'mobility4all',        slug: 'mobility4all',           name: 'Mobility4All'),
  Team.new(id: 'spendingvisualizer',  slug: 'spending-visualizer',    name: 'Spending Visualizer'),
  Team.new(id: 'A123456',             slug: 'a123456',                name: 'A123456 Gambling Den'),
  Team.new(id: 'thailandarearanking',             slug: 'thailand-area-ranking',                name: 'Thailand Area Ranking'),
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
    (team.text_channels || []).each do |key, channel_name|
      f.puts <<~EOF
        resource "discord_text_channel" "#{team.id}_#{key}_text" {
          name      = "#{channel_name}"
          server_id = var.server_id
          category  = discord_category_channel.#{team.id}_category.id
        }
      EOF
    end
  end
end
