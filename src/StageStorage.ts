import { dump, load } from 'js-yaml'
import fs from 'fs'
import { cloneDeep, isEqual } from 'lodash-es'

let state: Record<string, any> | undefined

export async function loadState() {
  state = load(fs.readFileSync('state.yml', 'utf8')) as Record<string, any>
}

export async function getState(key: string) {
  if (!state) {
    await loadState()
  }
  return cloneDeep(state![key])
}

export async function setState(key: string, data: any) {
  if (!state) {
    await loadState()
  }
  const oldState = cloneDeep(state![key])
  const newState = cloneDeep(data)
  if (isEqual(oldState, newState)) {
    return
  }
  state![key] = newState
  fs.writeFileSync(
    'state.yml',
    dump(state, {
      sortKeys: true,
      forceQuotes: true,
      lineWidth: -1,
    }),
  )
}
