import { defineResource, reconcile } from '../src/Reconciler.js'
import {
  Category,
  ChannelPermission,
  Role,
  TextChannel,
} from '../src/Discord.js'
import { colord } from 'colord'
import { PermissionFlagsBits } from 'discord-api-types/v10'

const guildId = '1062609208106832002'

function build() {
  team('ratchagitja', {
    slug: 'ratchagitja',
    name: 'Ratchagitja',
  })

  team('greenspaces', {
    slug: 'green-population',
    name: 'Green Population',
  }).withTextChannel('wespace', { name: 'we-space' })

  team('bankforthepoor', {
    slug: 'bank4all',
    name: 'Bank4all',
  })

  team('fillyouintheblank', {
    slug: 'fill-you-in-the-blank',
    name: 'Fill You In The Blank',
  }).withTextChannel('wikibangkok', { name: 'wikibangkok' })

  team('smarttrafficlights', {
    slug: 'smart-traffic-lights',
    name: 'Smart Traffic Lights',
  })

  team('BKKRewardHunter', {
    slug: 'bkk-reward-hunter',
    name: 'BKK Reward Hunter',
  })

  team('bkkchangelog', {
    slug: 'bkkchangelog',
    name: 'bkkchangelog',
  })

  team('policytracka', {
    slug: 'policytracka',
    name: 'policytracka',
  })

  team('mobility4all', {
    slug: 'mobility4all',
    name: 'Mobility4All',
  })

  team('spendingvisualizer', {
    slug: 'spending-visualizer',
    name: 'Spending Visualizer',
  })

  team('thailandarearanking', {
    slug: 'thailand-area-ranking',
    name: 'Thailand Area Ranking',
  })

  team('vote66', {
    slug: 'vote66',
    name: 'Vote 66',
  })

  team('wonderfulsoftware', {
    slug: 'wonderfulsoftware',
    name: 'wonderful.software',
  }).withTextChannel('webring', { name: 'webring' })
}

async function main() {
  build()
  reconcile(process.argv.includes('--confirm'))
}

interface TeamData {
  slug: string
  name: string
}
const teamSlugs: string[] = []
function team(id: string, data: TeamData) {
  teamSlugs.push(data.slug)
  teamSlugs.sort()
  const getColor = () => {
    const index = teamSlugs.indexOf(data.slug)
    const hue = Math.round((index * 360) / teamSlugs.length)
    const color = colord({ h: hue, s: 80, l: 64 }).toRgb()
    return (color.r << 16) + (color.g << 8) + color.b
  }
  const category = defineResource(Category, id, () => ({
    name: data.name,
    guildId,
  }))
  defineResource(TextChannel, id, (ctx) => ({
    name: data.slug,
    guildId,
    parentId: category.getState(ctx).id,
  }))
  const role = defineResource(Role, id, () => ({
    name: 'proj-' + data.slug,
    guildId,
    color: getColor(),
    mentionable: true,
  }))
  defineResource(ChannelPermission, id, (ctx) => ({
    id: role.getState(ctx).id,
    channelId: category.getState(ctx).id,
    allow: String(
      PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageWebhooks,
    ),
    type: 'role' as const,
  }))
  const o = {
    withTextChannel: (chId: string, data: { name: string }) => {
      defineResource(TextChannel, [id, chId].join('_'), (ctx) => ({
        name: data.name,
        guildId,
        parentId: category.getState(ctx).id,
      }))
      return o
    },
  }
  return o
}

await main()