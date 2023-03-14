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

data "discord_permission" "team_member" {
  manage_messages = "allow"
}
