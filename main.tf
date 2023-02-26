terraform {
  required_providers {
    discord = {
      source  = "aequasi/discord"
      version = "0.0.4"
    }
  }
}

provider "discord" {
  token = var.discord_token
}

variable "discord_token" {
  type      = string
  sensitive = true
}

variable "server_id" {
  default = "1062609208106832002"
}

resource "discord_category_channel" "ratchagitja_category" {
  name      = "Ratchagitja"
  server_id = var.server_id
}

resource "discord_text_channel" "ratchagitja_text" {
  name      = "ratchagitja-text"
  server_id = var.server_id
  category  = discord_category_channel.ratchagitja_category.id
}

resource "discord_category_channel" "greenspaces_category" {
  name      = "Green Spaces"
  server_id = var.server_id
}

resource "discord_text_channel" "greenspaces_text" {
  name      = "greenspaces-text"
  server_id = var.server_id
  category  = discord_category_channel.greenspaces_category.id
}

resource "discord_category_channel" "bankforthepoor_category" {
  name      = "Bank for the Poor"
  server_id = var.server_id
}

resource "discord_text_channel" "bankforthepoor_text" {
  name      = "bankforthepoor-text"
  server_id = var.server_id
  category  = discord_category_channel.bankforthepoor_category.id
}

resource "discord_category_channel" "fillyouintheblank_category" {
  name      = "Fill You In The Blank"
  server_id = var.server_id
}

resource "discord_text_channel" "fillyouintheblank_text" {
  name      = "fillyouintheblank-text"
  server_id = var.server_id
  category  = discord_category_channel.fillyouintheblank_category.id
}

resource "discord_category_channel" "smarttrafficlights_category" {
  name      = "Smart Traffic Lights"
  server_id = var.server_id
}

resource "discord_text_channel" "smarttrafficlights_text" {
  name      = "smarttrafficlights-text"
  server_id = var.server_id
  category  = discord_category_channel.smarttrafficlights_category.id
}

resource "discord_category_channel" "bkkchangelog_category" {
  name      = "bkkchangelog"
  server_id = var.server_id
}

resource "discord_text_channel" "bkkchangelog_text" {
  name      = "bkkchangelog-text"
  server_id = var.server_id
  category  = discord_category_channel.bkkchangelog_category.id
}
