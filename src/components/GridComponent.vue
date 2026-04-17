<template>
  <div class="link-grid" :style="gridStyle">
    <article
      v-for="item in productList"
      :key="`${item.title}-${item.link}`"
      class="link-grid__item"
    >
      <a
        v-if="isExternalLink(item.link) || isHashLink(item.link)"
        :href="item.link"
        class="link-card"
        target="_blank"
        rel="noreferrer"
      >
        <div class="link-card__head">
          <span class="link-card__title">{{ item.title }}</span>
          <span v-if="item.badge" class="link-card__badge">{{ item.badge }}</span>
        </div>
        <p class="link-card__body">{{ item.text }}</p>
        <span class="link-card__tail">OPEN LINK</span>
      </a>

      <RouterLink
        v-else
        :to="item.link"
        class="link-card"
      >
        <div class="link-card__head">
          <span class="link-card__title">{{ item.title }}</span>
          <span v-if="item.badge" class="link-card__badge">{{ item.badge }}</span>
        </div>
        <p class="link-card__body">{{ item.text }}</p>
        <span class="link-card__tail">OPEN PAGE</span>
      </RouterLink>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { PortalLinkItem } from '@/types/portal'

interface Props {
  productList: PortalLinkItem[]
  minWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  productList: () => [],
  minWidth: 240,
})

const gridStyle = computed(() => ({
  '--card-min-width': `${props.minWidth}px`,
}))

const isExternalLink = (url: string) => /^(https?:|mailto:|tel:)/.test(url)

const isHashLink = (url: string) => url.startsWith('/#/')
</script>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-min-width)), 1fr));
  gap: 14px;
}

.link-grid__item {
  min-width: 0;
}

.link-card {
  position: relative;
  display: flex;
  min-height: 168px;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  border: 1px solid rgba(13, 17, 23, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(240, 244, 247, 0.96)),
    linear-gradient(135deg, rgba(255, 122, 0, 0.1), transparent 40%);
  padding: 18px;
  color: #0f1722;
  text-decoration: none;
  box-shadow: 8px 8px 0 rgba(15, 23, 34, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.link-card::before {
  position: absolute;
  top: 0;
  right: 0;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(255, 122, 0, 0.18), transparent 70%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  content: '';
  pointer-events: none;
}

.link-card:hover {
  transform: translate(-3px, -3px);
  border-color: rgba(255, 122, 0, 0.38);
  box-shadow: 12px 12px 0 rgba(15, 23, 34, 0.12);
}

.link-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.link-card__title {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.link-card__badge {
  flex-shrink: 0;
  border: 1px solid rgba(15, 23, 34, 0.12);
  background: rgba(255, 122, 0, 0.1);
  padding: 2px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.link-card__body {
  color: rgba(15, 23, 34, 0.78);
  line-height: 1.65;
}

.link-card__tail {
  display: inline-flex;
  width: fit-content;
  border-top: 2px solid #0f1722;
  padding-top: 10px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.2em;
}

@media (max-width: 640px) {
  .link-card {
    min-height: 152px;
    padding: 16px;
    box-shadow: 6px 6px 0 rgba(15, 23, 34, 0.08);
  }

  .link-card__title {
    font-size: 0.96rem;
  }
}
</style>
