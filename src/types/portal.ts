export interface PortalLinkItem {
  title: string
  link: string
  text: string
  badge?: string
}

export interface PortalGroup {
  id: string
  title: string
  description?: string
  items: readonly PortalLinkItem[]
}

export interface PortalCollection {
  id: string
  route: string
  navLabel: string
  eyebrow: string
  title: string
  summary: string
  accent?: string
  groups: readonly PortalGroup[]
}

export interface PortalSiteInfo {
  name: string
  owner: string
  eyebrow: string
  description: string
  status: string
  configPath: string
}

export interface PortalHero {
  title: string
  summary: string
  announcement: string
  chips: readonly string[]
}

export interface PortalConfig {
  site: PortalSiteInfo
  hero: PortalHero
  quickAccess: readonly PortalLinkItem[]
  collections: readonly PortalCollection[]
}
