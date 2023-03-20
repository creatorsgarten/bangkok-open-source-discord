import { z } from 'zod'
import {
  defineResource,
  defineResourceKind,
  reconcile,
} from '../src/Reconciler.js'

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
}

async function main() {
  build()
  reconcile()
}

interface TeamData {
  slug: string
  name: string
}
function team(id: string, data: TeamData) {
  defineResource(Category, id, () => ({ name: data.name }))
  const o = {
    withTextChannel: (id: string, data: { name: string }) => {
      return o
    },
  }
  return o
}

const Category = defineResourceKind({
  id: 'category',
  spec: z.object({
    name: z.string(),
  }),
  state: z.object({
    id: z.string(),
  }),
  reconcile: async (state, data) => {
    throw new Error('unimplemented')
  },
})

// try {
//   const result = await ky.get(`guilds/${guildId}/roles`).json()
//   console.log(result)
// } catch (e) {
//   console.error(e)
// }
await main()
