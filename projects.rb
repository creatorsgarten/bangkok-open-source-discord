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

def hsv_to_rgb(hue, saturation, value)
  c = value * saturation
  x = c * (1 - ((hue / 60) % 2 - 1).abs)
  m = value - c

  r, g, b = if hue < 60
    [c, x, 0]
  elsif hue < 120
    [x, c, 0]
  elsif hue < 180
    [0, c, x]
  elsif hue < 240
    [0, x, c]
  elsif hue < 300
    [x, 0, c]
  else
    [c, 0, x]
  end

  [(r + m) * 255, (g + m) * 255, (b + m) * 255].map(&:round).inject(0) { |rgb, color| (rgb << 8) + color }
end

def role_color(i, total)
  hsv_to_rgb(i * 360 / total, 0.5, 0.75)
end

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
        color       = #{role_color(teams.index(team), teams.size)}
      }
      resource discord_message "#{team.id}_rolemessage" {
        channel_id = discord_text_channel.#{team.id}_text.id
        content    = "Welcome to the **#{team.name}** project! (React to this message to join.)"
      }
      resource "discord_channel_permission" "#{team.id}_rolepermission" {
        channel_id = discord_category_channel.#{team.id}_category.id
        type = "role"
        overwrite_id = discord_role.#{team.id}_role.id
        allow = data.discord_permission.team_member.allow_bits
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
