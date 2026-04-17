import { readonly, shallowRef } from 'vue'

import type { PortalCollection, PortalConfig, PortalGroup } from '@/types/portal'

const configRef = shallowRef<PortalConfig | null>(null)
const loadingRef = shallowRef(false)
const errorRef = shallowRef<string | null>(null)

let pendingRequest: Promise<PortalConfig> | null = null

function normalizeGroups(groups: readonly PortalGroup[] | undefined): PortalGroup[] {
  return Array.isArray(groups)
    ? groups.map((group) => ({
      ...group,
      items: Array.isArray(group.items) ? group.items : [],
    }))
    : []
}

function normalizeCollections(collections: readonly PortalCollection[] | undefined): PortalCollection[] {
  return Array.isArray(collections)
    ? collections.map((collection) => ({
      ...collection,
      groups: normalizeGroups(collection.groups),
    }))
    : []
}

function normalizeConfig(config: PortalConfig): PortalConfig {
  return {
    ...config,
    hero: {
      ...config.hero,
      chips: Array.isArray(config.hero?.chips) ? config.hero.chips : [],
    },
    quickAccess: Array.isArray(config.quickAccess) ? config.quickAccess : [],
    collections: normalizeCollections(config.collections),
  }
}

export async function loadPortalConfig(force = false): Promise<PortalConfig> {
  if (configRef.value && !force)
    return configRef.value

  if (pendingRequest && !force)
    return pendingRequest

  loadingRef.value = true
  errorRef.value = null

  pendingRequest = fetch(`${import.meta.env.BASE_URL}site.config.json`, {
    cache: force ? 'no-store' : 'default',
  })
    .then(async (response) => {
      if (!response.ok)
        throw new Error(`配置加载失败: HTTP ${response.status}`)

      const payload = await response.json() as PortalConfig
      const normalized = normalizeConfig(payload)
      configRef.value = normalized
      return normalized
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : '配置加载失败'
      errorRef.value = message
      throw error
    })
    .finally(() => {
      loadingRef.value = false
      pendingRequest = null
    })

  return pendingRequest
}

export function usePortalConfig() {
  if (!configRef.value && !loadingRef.value)
    void loadPortalConfig()

  return {
    config: readonly(configRef),
    loading: readonly(loadingRef),
    error: readonly(errorRef),
    reload: () => loadPortalConfig(true),
  }
}
