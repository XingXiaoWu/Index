import { readonly, shallowRef } from 'vue'

import { AITools, develop, hackTools, homeData, maybeTools, myselfTools } from '@/const'
import type { PortalCollection, PortalConfig, PortalGroup, PortalLinkItem } from '@/types/portal'

interface LegacyLinkItem {
  title: string
  link: string
  text: string
  icon?: string
}

function normalizeLink(link: string): string {
  return link.startsWith('/#/') ? link.slice(2) : link
}

function normalizeItems(items: readonly LegacyLinkItem[]): PortalLinkItem[] {
  return items.map(item => ({
    title: item.title,
    link: normalizeLink(item.link),
    text: item.text,
  }))
}

function createGroup(id: string, title: string, items: readonly LegacyLinkItem[], description = ''): PortalGroup {
  return {
    id,
    title,
    description,
    items: normalizeItems(items),
  }
}

function buildCollections(): PortalCollection[] {
  return [
    {
      id: 'myself-tools',
      route: '/myself-tools',
      navLabel: '自制工具',
      eyebrow: 'Build',
      title: '阿星的自制工具',
      summary: '由 src/const/myself.ts 聚合',
      accent: 'signal',
      groups: [
        createGroup('proxy', '自己做的小工具', myselfTools.proxy),
      ],
    },
    {
      id: 'maybe-tools',
      route: '/maybe-tools',
      navLabel: '稀奇古怪',
      eyebrow: 'Maybe',
      title: '阿星收集的稀奇古怪',
      summary: '由 src/const/maybe.ts 聚合',
      accent: 'steel',
      groups: [
        createGroup('proxy', '稀奇古怪的小工具', maybeTools.proxy),
        createGroup('jetbra', 'JB激活', maybeTools.jetbra),
      ],
    },
    {
      id: 'hack-tools',
      route: '/hack-tools',
      navLabel: '安全工具',
      eyebrow: 'Hack',
      title: '阿星的安全工具',
      summary: '由 src/const/hack.ts 聚合',
      accent: 'danger',
      groups: [
        createGroup('proxy', '代理工具', hackTools.proxy),
      ],
    },
    {
      id: 'develop-tools',
      route: '/develop-tools',
      navLabel: '开发支援',
      eyebrow: 'Dev',
      title: '阿星的开发工具',
      summary: '由 src/const/develop.ts 聚合',
      accent: 'sky',
      groups: [
        createGroup('docker-origin', 'Docker工具', develop.dockerOrigin),
        createGroup('picture-bed', '图床', develop.pictureBed),
      ],
    },
    {
      id: 'ai-tools',
      route: '/ai-tools',
      navLabel: 'AI 入口',
      eyebrow: 'AI',
      title: '阿星发现的AI工具',
      summary: '由 src/const/ai.ts 聚合',
      accent: 'lime',
      groups: [
        createGroup('public-welfare', '公益站', AITools.publicelfare),
        createGroup('supplement', '补充站', AITools.supplement),
      ],
    },
    {
      id: 'ai-tools2',
      route: '/ai-tools2',
      navLabel: 'AI 资料',
      eyebrow: 'Archive',
      title: 'AI资料库',
      summary: '由 src/const/ai.ts 聚合',
      accent: 'oxide',
      groups: [
        createGroup('public-data', '资料库', AITools.publicData),
      ],
    },
  ]
}

function buildPortalConfig(): PortalConfig {
  return {
    site: {
      name: 'AXING INDEX',
      owner: '阿星',
      eyebrow: 'Expert Mode',
      description: '个人工具、资料入口与实验页面的聚合站。',
      status: '持续更新',
      configPath: 'src/const/*',
    },
    hero: {
      title: 'AXING INDEX',
      summary: '',
      announcement: '',
      chips: [
        'Const Source',
        'Tool Aggregation',
        'Hard-Edge UI',
        'Lightweight Vue',
      ],
    },
    quickAccess: normalizeItems(homeData),
    collections: buildCollections(),
  }
}

const configRef = shallowRef<PortalConfig>(buildPortalConfig())
const loadingRef = shallowRef(false)
const errorRef = shallowRef<string | null>(null)

export async function loadPortalConfig(): Promise<PortalConfig> {
  const config = buildPortalConfig()
  configRef.value = config
  errorRef.value = null
  loadingRef.value = false
  return config
}

export function usePortalConfig() {
  return {
    config: readonly(configRef),
    loading: readonly(loadingRef),
    error: readonly(errorRef),
    reload: () => loadPortalConfig(),
  }
}
