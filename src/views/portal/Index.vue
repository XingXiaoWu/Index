<script setup lang="ts">
import chatHead from '@/assets/imgs/ChatHead.jpeg'
import { usePortalConfig } from '@/composables/usePortalConfig'
import type { PortalCollection, PortalLinkItem } from '@/types/portal'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const { config, loading, error, reload } = usePortalConfig()

const flattenItems = (collection: PortalCollection) => collection.groups.flatMap(group => group.items)

const isInternalLink = (link: string) => link.startsWith('/') && !link.startsWith('/#/')

const collectionCards = computed(() =>
  (config.value?.collections ?? []).map((collection) => {
    const items = flattenItems(collection)

    return {
      ...collection,
      groupCount: collection.groups.length,
      itemCount: items.length,
      internalCount: items.filter(item => isInternalLink(item.link)).length,
      samples: items.slice(0, 3).map(item => item.title),
    }
  }),
)

const dashboardMetrics = computed(() => {
  const collections = config.value?.collections ?? []
  const totalGroups = collections.reduce((sum, collection) => sum + collection.groups.length, 0)
  const totalItems = collections.reduce((sum, collection) => sum + flattenItems(collection).length, 0)
  const totalInternal = collections.reduce((sum, collection) => sum + flattenItems(collection).filter(item => isInternalLink(item.link)).length, 0)
  const totalExternal = totalItems - totalInternal

  return [
    {
      label: '分类域',
      value: collections.length.toString().padStart(2, '0'),
      detail: '按场景拆分的功能面板',
    },
    {
      label: '分组簇',
      value: totalGroups.toString().padStart(2, '0'),
      detail: '每个面板继续做子类型聚合',
    },
    {
      label: '站内页',
      value: totalInternal.toString().padStart(2, '0'),
      detail: '直接由当前项目托管的页面能力',
    },
    {
      label: '外部入口',
      value: totalExternal.toString().padStart(2, '0'),
      detail: '统一收纳的外链资源位',
    },
  ]
})

const radarItems = computed(() => {
  const items: PortalLinkItem[] = []

  for (const collection of config.value?.collections ?? []) {
    const [firstItem] = flattenItems(collection)
    if (!firstItem)
      continue

    items.push({
      ...firstItem,
      badge: collection.navLabel,
    })
  }

  return items
})

const handleReload = () => {
  void reload()
}
</script>

<template>
  <div class="index-shell">
    <section v-if="loading && !config" class="state-panel">
      <p class="eyebrow">Loadout</p>
      <h1>正在装载首页聚合</h1>
      <p>正在从 `src/const` 读取聚合数据。</p>
    </section>

    <section v-else-if="error && !config" class="state-panel state-panel--error">
      <p class="eyebrow">Fault</p>
      <h1>配置加载失败</h1>
      <p>{{ error }}</p>
      <button class="action-button action-button--solid" type="button" @click="handleReload">
        重新加载
      </button>
    </section>

    <template v-else-if="config">
      <section class="hero-grid">
        <div class="panel panel--hero">
          <p class="eyebrow">{{ config.site.eyebrow }}</p>
          <h1 class="hero-title">{{ config.site.name }}</h1>

          <div class="chip-row">
            <span v-for="chip in config.hero.chips" :key="chip" class="chip">{{ chip }}</span>
          </div>

          <div class="hero-actions">
            <RouterLink class="action-button action-button--solid" to="/myself-tools">
              进入自制工具
            </RouterLink>
            <RouterLink class="action-button" to="/ai-tools">
              查看 AI 聚合
            </RouterLink>
          </div>
        </div>

        <div class="hero-side">
          <div class="panel profile-card">
            <div class="profile-card__media">
              <img :src="chatHead" alt="阿星头像" class="profile-card__image">
            </div>
            <div class="profile-card__content">
              <p class="eyebrow">Profile</p>
              <h2>{{ config.site.name }}</h2>
              <div class="profile-card__meta">
                <span>Owner / {{ config.site.owner }}</span>
                <span>Status / {{ config.site.status }}</span>
                <span>Source / CONST</span>
              </div>
            </div>
          </div>

          <div class="metric-grid">
            <article v-for="metric in dashboardMetrics" :key="metric.label" class="panel metric-card">
              <p class="metric-card__label">{{ metric.label }}</p>
              <strong class="metric-card__value">{{ metric.value }}</strong>
            </article>
          </div>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <p class="eyebrow">Primary Access</p>
            <h2>主入口</h2>
          </div>
        </div>
        <GridComponent :productList="config.quickAccess" :min-width="228" />
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <p class="eyebrow">Type Matrix</p>
            <h2>分类</h2>
          </div>
        </div>

        <div class="collection-grid">
          <RouterLink
            v-for="collection in collectionCards"
            :key="collection.id"
            :to="collection.route"
            class="collection-card"
            :data-accent="collection.accent ?? 'steel'"
          >
            <p class="collection-card__eyebrow">{{ collection.eyebrow }}</p>
            <div class="collection-card__top">
              <h3>{{ collection.title }}</h3>
              <span>{{ collection.itemCount }} items</span>
            </div>
            <div class="collection-card__stats">
              <span>{{ collection.groupCount }} groups</span>
              <span>{{ collection.internalCount }} local</span>
            </div>
            <div class="collection-card__samples">
              <span v-for="sample in collection.samples" :key="sample">{{ sample }}</span>
            </div>
          </RouterLink>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <p class="eyebrow">Radar</p>
            <h2>样本</h2>
          </div>
        </div>
        <GridComponent :productList="radarItems" :min-width="250" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.index-shell {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 24px;
}

.panel,
.state-panel,
.collection-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 34, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(240, 244, 247, 0.96)),
    linear-gradient(135deg, rgba(255, 122, 0, 0.12), transparent 44%);
  box-shadow: 14px 14px 0 rgba(15, 23, 34, 0.08);
}

.panel::after,
.state-panel::after,
.collection-card::after {
  position: absolute;
  inset: auto 0 0 auto;
  width: 74px;
  height: 74px;
  background: linear-gradient(135deg, rgba(255, 122, 0, 0.16), transparent 70%);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  content: '';
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.95fr);
  gap: 18px;
}

.panel--hero,
.state-panel {
  padding: clamp(22px, 4vw, 34px);
}

.panel--hero {
  display: flex;
  min-height: 360px;
  flex-direction: column;
  justify-content: flex-end;
}

.hero-title,
.state-panel h1 {
  margin-top: 8px;
  color: #0f1722;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.state-panel p:last-of-type {
  margin-top: 16px;
  max-width: 62ch;
  color: rgba(15, 23, 34, 0.74);
  font-size: 1.02rem;
  line-height: 1.8;
}

.eyebrow {
  color: #ff6a00;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.chip {
  border: 1px solid rgba(15, 23, 34, 0.12);
  background: rgba(15, 23, 34, 0.04);
  padding: 6px 10px;
  color: #0f1722;
  font-family: 'Fira Code', monospace;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(15, 23, 34, 0.14);
  padding: 12px 18px;
  color: #0f1722;
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.action-button:hover {
  transform: translate(-2px, -2px);
  border-color: rgba(255, 122, 0, 0.44);
}

.action-button--solid {
  border-color: #0f1722;
  background: #0f1722;
  color: #f8fafc;
}

.hero-side {
  display: grid;
  gap: 18px;
}

.profile-card {
  display: grid;
  grid-template-columns: 124px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 20px;
}

.profile-card__media {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 34, 0.14);
  background: linear-gradient(135deg, rgba(255, 122, 0, 0.16), rgba(15, 23, 34, 0.08));
}

.profile-card__media::after {
  position: absolute;
  inset: 0;
  border: 8px solid rgba(255, 255, 255, 0.16);
  content: '';
  pointer-events: none;
}

.profile-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.02) contrast(1.02);
}

.profile-card__content h2 {
  margin-top: 6px;
  color: #0f1722;
  font-size: 1.4rem;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.profile-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.profile-card__meta span {
  border: 1px solid rgba(15, 23, 34, 0.12);
  padding: 5px 10px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.metric-card {
  padding: 18px;
}

.metric-card__label {
  color: rgba(15, 23, 34, 0.6);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.metric-card__value {
  display: block;
  margin-top: 10px;
  color: #0f1722;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  line-height: 1;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.section-head h2 {
  margin-top: 6px;
  color: #0f1722;
  font-size: clamp(1.5rem, 2.8vw, 2.3rem);
  line-height: 1.08;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.collection-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  color: #0f1722;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.collection-card:hover {
  transform: translate(-3px, -3px);
  border-color: rgba(255, 122, 0, 0.42);
  box-shadow: 18px 18px 0 rgba(15, 23, 34, 0.1);
}

.collection-card[data-accent='signal'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(242, 244, 246, 0.96)),
    linear-gradient(135deg, rgba(255, 122, 0, 0.18), transparent 46%);
}

.collection-card[data-accent='steel'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(239, 244, 247, 0.96)),
    linear-gradient(135deg, rgba(63, 94, 117, 0.18), transparent 46%);
}

.collection-card[data-accent='danger'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 241, 240, 0.96)),
    linear-gradient(135deg, rgba(181, 46, 31, 0.18), transparent 46%);
}

.collection-card[data-accent='sky'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(239, 244, 248, 0.96)),
    linear-gradient(135deg, rgba(27, 92, 142, 0.18), transparent 46%);
}

.collection-card[data-accent='lime'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(242, 246, 240, 0.96)),
    linear-gradient(135deg, rgba(100, 132, 45, 0.18), transparent 46%);
}

.collection-card[data-accent='oxide'] {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 243, 240, 0.96)),
    linear-gradient(135deg, rgba(143, 76, 35, 0.18), transparent 46%);
}

.collection-card__eyebrow {
  color: rgba(15, 23, 34, 0.58);
  font-family: 'Fira Code', monospace;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.collection-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.collection-card__top h3 {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.03em;
}

.collection-card__top span,
.collection-card__stats span,
.collection-card__samples span {
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
}

.collection-card__stats {
  display: flex;
  gap: 10px;
  padding-top: 4px;
}

.collection-card__stats span {
  border-top: 2px solid rgba(15, 23, 34, 0.14);
  padding-top: 8px;
  color: rgba(15, 23, 34, 0.7);
}

.collection-card__samples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.collection-card__samples span {
  border: 1px solid rgba(15, 23, 34, 0.1);
  background: rgba(255, 255, 255, 0.42);
  padding: 4px 8px;
  color: rgba(15, 23, 34, 0.72);
}

.state-panel--error {
  background:
    linear-gradient(180deg, rgba(255, 248, 247, 0.96), rgba(249, 238, 236, 0.98)),
    linear-gradient(135deg, rgba(181, 46, 31, 0.16), transparent 44%);
}

@media (max-width: 1080px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .index-shell {
    gap: 22px;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-card {
    grid-template-columns: 88px minmax(0, 1fr);
  }

  .metric-grid {
    grid-template-columns: 1fr 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    grid-template-columns: 1fr;
  }

  .profile-card__media {
    width: 132px;
  }
}
</style>
