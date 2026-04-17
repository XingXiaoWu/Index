<script setup lang="ts">
import { usePortalConfig } from '@/composables/usePortalConfig'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const { config, loading, error, reload } = usePortalConfig()

const collectionId = computed(() => String(route.meta.collectionId ?? ''))

const classicRouteMap: Record<string, string> = {
  'hack-tools': '/hack-tools-classic',
  'develop-tools': '/develop-tools-classic',
  'ai-tools': '/ai-tools-classic',
  'ai-tools2': '/ai-tools2-classic',
  'myself-tools': '/myself-tools-classic',
  'maybe-tools': '/maybe-tools-classic',
}

const currentCollection = computed(() =>
  config.value?.collections.find(collection => collection.id === collectionId.value) ?? null,
)

const totalItems = computed(() =>
  currentCollection.value?.groups.reduce((sum, group) => sum + group.items.length, 0) ?? 0,
)

const classicRoute = computed(() => classicRouteMap[collectionId.value] ?? '')

const handleReload = () => {
  void reload()
}

const scrollToGroup = (groupId: string) => {
  document.getElementById(`group-${groupId}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <div
    class="collection-shell"
    :data-accent="currentCollection?.accent ?? 'steel'"
  >
    <section v-if="loading && !currentCollection" class="state-card">
      <p class="eyebrow">Loadout</p>
      <h1>正在装载分类聚合</h1>
      <p>分类页将直接复用 `src/const` 的分组数据。</p>
    </section>

    <section v-else-if="error && !currentCollection" class="state-card state-card--error">
      <p class="eyebrow">Fault</p>
      <h1>分类页加载失败</h1>
      <p>{{ error }}</p>
      <button class="ghost-button" type="button" @click="handleReload">
        重新加载
      </button>
    </section>

    <template v-else-if="currentCollection">
      <section class="hero-card">
        <div class="hero-card__main">
          <p class="eyebrow">{{ currentCollection.eyebrow }}</p>
          <h1>{{ currentCollection.title }}</h1>

          <div class="hero-card__actions">
            <RouterLink class="ghost-button ghost-button--solid" to="/">
              返回首页
            </RouterLink>
            <RouterLink
              v-if="classicRoute"
              class="ghost-button"
              :to="classicRoute"
            >
              经典页
            </RouterLink>
            <RouterLink
              v-for="entry in config?.collections ?? []"
              :key="entry.id"
              class="ghost-button"
              :class="{ 'ghost-button--active': entry.id === currentCollection.id }"
              :to="entry.route"
            >
              {{ entry.navLabel }}
            </RouterLink>
          </div>
        </div>

        <div class="hero-card__stats">
          <article class="hero-stat">
            <span>Groups</span>
            <strong>{{ currentCollection.groups.length }}</strong>
          </article>
          <article class="hero-stat">
            <span>Items</span>
            <strong>{{ totalItems }}</strong>
          </article>
          <article class="hero-stat">
            <span>Source</span>
            <strong>CONST</strong>
          </article>
        </div>
      </section>

      <section v-if="currentCollection.groups.length > 1" class="group-nav">
        <button
          v-for="group in currentCollection.groups"
          :key="group.id"
          type="button"
          class="group-nav__item"
          @click="scrollToGroup(group.id)"
        >
          <span>{{ group.title }}</span>
          <strong>{{ group.items.length }}</strong>
        </button>
      </section>

      <section
        v-for="group in currentCollection.groups"
        :id="`group-${group.id}`"
        :key="group.id"
        class="group-section"
      >
        <div class="group-section__head">
          <div>
            <p class="eyebrow">Group</p>
            <h2>{{ group.title }}</h2>
          </div>
        </div>
        <GridComponent :productList="group.items" :minWidth="250" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.collection-shell {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-bottom: 22px;
  --accent-color: #3f5e75;
  --accent-bg: rgba(63, 94, 117, 0.14);
}

.collection-shell[data-accent='signal'] {
  --accent-color: #ff6a00;
  --accent-bg: rgba(255, 106, 0, 0.14);
}

.collection-shell[data-accent='danger'] {
  --accent-color: #b52e1f;
  --accent-bg: rgba(181, 46, 31, 0.14);
}

.collection-shell[data-accent='sky'] {
  --accent-color: #1b5c8e;
  --accent-bg: rgba(27, 92, 142, 0.14);
}

.collection-shell[data-accent='lime'] {
  --accent-color: #64842d;
  --accent-bg: rgba(100, 132, 45, 0.14);
}

.collection-shell[data-accent='oxide'] {
  --accent-color: #8f4c23;
  --accent-bg: rgba(143, 76, 35, 0.14);
}

.hero-card,
.state-card,
.group-section,
.group-nav__item {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 34, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(242, 245, 248, 0.96)),
    linear-gradient(135deg, var(--accent-bg), transparent 46%);
  box-shadow: 12px 12px 0 rgba(15, 23, 34, 0.08);
}

.hero-card::after,
.state-card::after,
.group-section::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--accent-bg), transparent 70%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  content: '';
  pointer-events: none;
}

.hero-card,
.state-card {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.7fr);
  gap: 18px;
  padding: clamp(20px, 4vw, 30px);
}

.hero-card {
  align-items: end;
  min-height: 240px;
}

.hero-card__main h1,
.state-card h1 {
  margin-top: 8px;
  color: #0f1722;
  font-size: clamp(1.9rem, 3.8vw, 3rem);
  line-height: 1.06;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.state-card p:last-of-type {
  margin-top: 16px;
  max-width: 60ch;
  color: rgba(15, 23, 34, 0.74);
  line-height: 1.8;
}

.eyebrow {
  color: var(--accent-color);
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hero-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(15, 23, 34, 0.14);
  background: rgba(255, 255, 255, 0.56);
  padding: 10px 14px;
  color: #0f1722;
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.ghost-button:hover {
  transform: translate(-2px, -2px);
  border-color: var(--accent-color);
}

.ghost-button--solid,
.ghost-button--active {
  border-color: #0f1722;
  background: #0f1722;
  color: #f8fafc;
}

.hero-card__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.hero-stat {
  display: flex;
  min-height: 112px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(15, 23, 34, 0.12);
  background: rgba(255, 255, 255, 0.6);
  padding: 16px;
}

.hero-stat span {
  color: rgba(15, 23, 34, 0.56);
  font-family: 'Fira Code', monospace;
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-stat strong {
  color: #0f1722;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  line-height: 1;
}

.group-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.group-nav__item {
  display: flex;
  min-width: 180px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(244, 247, 249, 0.96)),
    linear-gradient(135deg, var(--accent-bg), transparent 46%);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.group-nav__item:hover {
  transform: translate(-2px, -2px);
  border-color: var(--accent-color);
  box-shadow: 16px 16px 0 rgba(15, 23, 34, 0.08);
}

.group-nav__item span,
.group-nav__item strong {
  color: #0f1722;
}

.group-nav__item span {
  font-weight: 700;
  line-height: 1.4;
}

.group-nav__item strong {
  font-family: 'Fira Code', monospace;
  font-size: 0.92rem;
}

.group-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.group-section__head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.group-section__head h2 {
  margin-top: 6px;
  color: #0f1722;
  font-size: clamp(1.35rem, 2.8vw, 2rem);
  line-height: 1.12;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.group-section__head p:last-child {
  max-width: 46ch;
  color: rgba(15, 23, 34, 0.72);
  line-height: 1.75;
  text-align: right;
}

.state-card--error {
  background:
    linear-gradient(180deg, rgba(255, 248, 247, 0.96), rgba(249, 239, 237, 0.98)),
    linear-gradient(135deg, rgba(181, 46, 31, 0.16), transparent 46%);
}

@media (max-width: 1024px) {
  .hero-card,
  .state-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .hero-card__actions,
  .group-nav {
    flex-direction: column;
  }

  .ghost-button,
  .group-nav__item {
    width: 100%;
  }

  .hero-card__stats {
    grid-template-columns: 1fr;
  }

  .group-section__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
