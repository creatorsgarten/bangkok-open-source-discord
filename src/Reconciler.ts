import { z, ZodType } from 'zod'
import { getState, setState } from './StageStorage.js'
import { isDeepStrictEqual } from 'util'
import { inspect } from 'bun'

const resources = new Map<string, Resource>()

export interface ResourceKind<T extends ZodType, S extends ZodType> {
  id: string
  spec: T
  state?: S
  reconcile: (
    state: z.infer<S> | undefined,
    spec: z.infer<T>,
  ) => Promise<z.infer<S>>
}

export interface Resource {
  id: string
  kind: ResourceKind<any, any>
  resolveSpec: (resolutionContext: ResolutionContext) => any
}

export interface ResolutionContext {
  getState(resourceId: string): Promise<any>
}

export function defineResource<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
  id: string,
  resolveSpec: (resolutionContext: ResolutionContext) => z.infer<T>,
) {
  const key = [id, kind.id].join('#')
  if (resources.has(key)) {
    throw new Error(`Resource "${key}" already exists`)
  }
  const resource: Resource = {
    id,
    kind,
    resolveSpec,
  }
  resources.set(key, resource)
  return {
    getState(ctx: ResolutionContext) {
      return ctx.getState(key) as z.infer<S>
    },
  }
}

export function defineResourceKind<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
) {
  return kind
}

class NeedsDependency extends Error {
  constructor(public readonly dependency: string) {
    super(`Resource "${dependency}" is required`)
    this.name = 'NeedsDependency'
  }
}

class DryRun extends Error {
  constructor(key: string) {
    super(`Wait for dependencies incl. ${key}`)
    this.name = 'DryRun'
  }
}

export async function reconcile(confirm = false) {
  const promises = Object.create(null)
  const results = Object.create(null)

  for (const [key, resource] of resources) {
    await reconcileResource(key, resource)
  }

  function reconcileResource(key: string, resource: Resource) {
    promises[key] ??= doReconcileResource(key, resource)
    return promises[key]
  }

  async function doReconcileResource(
    key: string,
    resource: Resource,
  ): Promise<void> {
    try {
      const oldData = await getState(key)
      const oldSpec = oldData?.spec
      const oldState = oldData?.state
        ? resource.kind.state.parse(oldData?.state)
        : undefined
      const newSpec = await (async () => {
        for (;;) {
          try {
            return resource.kind.spec.parse(
              resource.resolveSpec({
                getState: (key) => {
                  if (results[key]) {
                    if (results[key].resolved) {
                      return results[key].resolved.state
                    }
                    throw new DryRun(key)
                  }
                  throw new NeedsDependency(key)
                },
              }),
            )
          } catch (err) {
            if (err instanceof NeedsDependency) {
              const dependency = resources.get(err.dependency)
              if (!dependency) {
                throw new Error(
                  `Dependency resource "${err.dependency}" not found`,
                )
              }
              await reconcileResource(err.dependency, dependency)
              continue
            }
            throw err
          }
        }
      })()
      if (isDeepStrictEqual(oldSpec, newSpec)) {
        console.log(`* ${key}: Skip (unchanged)`)
        results[key] = {
          resolved: {
            spec: oldSpec,
            state: oldState,
          },
        }
        return
      }
      const printDiff = () => {
        const keys = [
          ...new Set([
            ...Object.keys(oldSpec || {}),
            ...Object.keys(newSpec || {}),
          ]),
        ].sort()
        for (const key of keys) {
          const before = oldSpec?.[key]
          const after = newSpec?.[key]
          if (isDeepStrictEqual(before, after)) continue
          console.log(`    * ${key}: ${inspect(before)} -> ${inspect(after)}`)
        }
      }
      if (!confirm) {
        console.log(`* ${key}: Would ${oldState ? 'update' : 'create'}`)
        printDiff()
        results[key] = {}
        return
      }
      console.log(
        `* ${key}: Reconciling (${oldState ? 'update' : 'create'})...`,
      )
      printDiff()
      const started = Date.now()
      const newState = await resource.kind.reconcile(oldState, newSpec)
      await setState(key, {
        spec: newSpec,
        state: newState,
      })
      console.log(`    -> Done in ${Date.now() - started} ms`)
      results[key] = {
        resolved: {
          spec: newSpec,
          state: newState,
        },
      }
    } catch (err) {
      if (err instanceof DryRun) {
        results[key] = {}
        console.log(`* ${key}: ${err.message}`)
        return
      }
      throw err
    }
  }
}

export async function injectState<T extends ZodType, S extends ZodType>(
  kind: ResourceKind<T, S>,
  id: string,
  spec: z.infer<T>,
  state: z.infer<S>,
) {
  const key = [id, kind.id].join('#')
  await setState(key, {
    spec: kind.spec.parse(spec),
    state: kind.state ? kind.state.parse(state) : undefined,
  })
}
