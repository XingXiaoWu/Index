<template>
  <div class="food-page">
    <section class="hero panel">
      <div>
        <span class="eyebrow">Unified Menu</span>
        <h1>午餐点餐台</h1>
        <p class="hero-text">
          左右菜单已经合并成一个总菜单，重复菜按菜名去重。现在直接点餐，不再区分档口。
        </p>

        <div class="stats">
          <div class="stat">
            <span>合并后菜品</span>
            <strong>{{ dishes.length }} 道</strong>
            <small>已去掉重复菜</small>
          </div>
          <div class="stat">
            <span>已点数量</span>
            <strong>{{ totalQuantity }} 份</strong>
            <small>{{ formatPrice(totalPrice) }}</small>
          </div>
          <div class="stat">
            <span>预算余量</span>
            <strong :class="{ danger: remainingBudget < 0 }">{{ formatPrice(remainingBudget) }}</strong>
            <small>{{ dishTarget }} 道目标菜</small>
          </div>
        </div>
      </div>

      <div class="specials">
        <div class="section-head">
          <h2>推荐先点</h2>
          <button class="ghost" type="button" @click="randomizeOrder">随机配一桌</button>
        </div>

        <button
          v-for="dish in featuredDishes"
          :key="dish.id"
          class="special-card"
          type="button"
          @click="increaseDish(dish.id)"
        >
          <strong>{{ dish.name }}</strong>
          <span>{{ dish.description }}</span>
          <em>{{ formatPrice(dish.price) }}</em>
        </button>
      </div>
    </section>

    <div class="preset-row">
      <button
        v-for="preset in presets"
        :key="preset.id"
        class="preset-card"
        type="button"
        @click="applyPreset(preset)"
      >
        <strong>{{ preset.title }}</strong>
        <span>{{ preset.description }}</span>
        <small>{{ preset.people }} 人 / {{ preset.dishes }} 道 / {{ formatPrice(preset.budget) }}</small>
      </button>
    </div>

    <div class="workspace">
      <section class="panel">
        <div class="controls">
          <label>
            <span>搜索菜名</span>
            <input v-model.trim="searchKeyword" type="text" placeholder="牛肉、鸡丁、素菜" />
          </label>
          <label>
            <span>预计送达</span>
            <input v-model="deliveryTime" type="time" />
          </label>
          <label>
            <span>预算上限</span>
            <input :value="budget" type="number" min="0" max="300" @input="updateBudget" />
          </label>
          <div class="step-card">
            <span>用餐人数</span>
            <div class="stepper">
              <button type="button" @click="adjustPartySize(-1)">-</button>
              <strong>{{ partySize }}</strong>
              <button type="button" @click="adjustPartySize(1)">+</button>
            </div>
          </div>
          <div class="step-card">
            <span>目标菜数</span>
            <div class="stepper">
              <button type="button" @click="adjustDishTarget(-1)">-</button>
              <strong>{{ dishTarget }}</strong>
              <button type="button" @click="adjustDishTarget(1)">+</button>
            </div>
          </div>
          <div class="step-card">
            <span>当前人均</span>
            <div class="metric">{{ formatPrice(perPersonPrice) }}</div>
          </div>
        </div>

        <div class="chips">
          <button
            v-for="taste in tasteOptions"
            :key="taste.id"
            class="chip"
            :class="{ active: tasteMode === taste.id }"
            type="button"
            @click="tasteMode = taste.id"
          >
            {{ taste.label }}
          </button>
        </div>

        <div class="chips">
          <button
            v-for="option in excludeOptions"
            :key="option.id"
            class="chip muted"
            :class="{ active: excludedTags.includes(option.id) }"
            type="button"
            @click="toggleTag(option.id)"
          >
            忌 {{ option.label }}
          </button>
        </div>

        <div class="chips">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            class="chip secondary"
            :class="{ active: activeCategory === tab.id }"
            type="button"
            @click="activeCategory = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="section-head menu-head">
          <div>
            <h2>今日菜单</h2>
            <p>已把左右两边的菜合到一起，直接从总菜单里点。</p>
          </div>
          <small>{{ visibleDishes.length }} 道可选</small>
        </div>

        <div v-if="visibleDishes.length" class="menu-grid">
          <article v-for="dish in visibleDishes" :key="dish.id" class="dish-card">
            <div class="dish-top">
              <div>
                <h3>{{ dish.name }}</h3>
                <p>{{ dish.description }}</p>
              </div>
              <span v-if="dish.recommended" class="badge">推荐</span>
            </div>

            <div class="tags">
              <span v-for="tag in dish.tags" :key="`${dish.id}-${tag}`">{{ tagLabelMap[tag] }}</span>
            </div>

            <div class="dish-bottom">
              <div>
                <strong class="price">{{ formatPrice(dish.price) }}</strong>
                <small>{{ categoryLabelMap[dish.category] }}</small>
              </div>
              <div class="stepper compact">
                <button type="button" @click="decreaseDish(dish.id)">-</button>
                <span>{{ cart[dish.id] ?? 0 }}</span>
                <button type="button" @click="increaseDish(dish.id)">+</button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty">当前筛选条件下没有可选菜品，换个条件试试。</div>
      </section>

      <aside class="panel cart">
        <div class="section-head">
          <div>
            <h2>已点清单</h2>
            <p>不区分左右，直接汇总所有已点菜品。</p>
          </div>
          <button class="ghost" type="button" @click="clearCart">清空</button>
        </div>

        <div class="cart-metrics">
          <div class="stat">
            <span>菜品数</span>
            <strong>{{ totalQuantity }}</strong>
          </div>
          <div class="stat">
            <span>总价</span>
            <strong>{{ formatPrice(totalPrice) }}</strong>
          </div>
          <div class="stat">
            <span>人均</span>
            <strong>{{ formatPrice(perPersonPrice) }}</strong>
          </div>
        </div>

        <label class="note">
          <span>下单备注</span>
          <textarea
            v-model.trim="orderNote"
            rows="3"
            placeholder="少辣、米饭分开打包、不要香菜"
          />
        </label>

        <div v-if="cartItems.length" class="cart-list">
          <article v-for="item in cartItems" :key="item.id" class="cart-item">
            <div>
              <strong>{{ item.name }}</strong>
              <small>{{ formatPrice(item.price) }} / 份</small>
            </div>
            <div class="cart-actions">
              <div class="stepper compact">
                <button type="button" @click="decreaseDish(item.id)">-</button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="increaseDish(item.id)">+</button>
              </div>
              <strong class="price">{{ formatPrice(item.subtotal) }}</strong>
            </div>
          </article>
        </div>
        <div v-else class="empty">还没点菜，可以手动加菜，也可以直接随机配一桌。</div>

        <div class="cart-buttons">
          <button class="secondary-btn" type="button" @click="randomizeOrder">随机配一桌</button>
          <button class="primary-btn" type="button" @click="copyOrder">复制下单</button>
        </div>

        <div class="preview">
          <div class="section-head">
            <h3>下单预览</h3>
            <small>{{ totalQuantity }} 份 / {{ formatPrice(totalPrice) }}</small>
          </div>
          <pre>{{ orderText }}</pre>
        </div>
      </aside>
    </div>

    <div class="mobile-bar">
      <div>
        <strong>{{ totalQuantity }} 份</strong>
        <span>{{ formatPrice(totalPrice) }}</span>
      </div>
      <button class="primary-btn" type="button" @click="copyOrder">复制下单</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'

type TasteMode = 'all' | 'light' | 'balanced' | 'hot'
type DishCategory = 'all' | 'signature' | 'stir-fry' | 'vegetable' | 'staple'
type DishTag = 'pork' | 'beef' | 'chicken' | 'egg' | 'vegetarian' | 'spicy' | 'drink'

interface DishSeed {
  name: string
  description: string
  price: number
  category: Exclude<DishCategory, 'all'>
  tags: DishTag[]
  spicyLevel: 0 | 1 | 2
  recommended?: boolean
}

interface Dish extends DishSeed {
  id: string
}

interface Preset {
  id: string
  title: string
  description: string
  people: number
  dishes: number
  budget: number
  taste: TasteMode
}

const message = useMessage()

const categoryTabs: Array<{ id: DishCategory; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'signature', label: '推荐菜' },
  { id: 'stir-fry', label: '小炒' },
  { id: 'vegetable', label: '素菜' },
  { id: 'staple', label: '主食饮品' }
]

const tasteOptions: Array<{ id: TasteMode; label: string }> = [
  { id: 'all', label: '口味不限' },
  { id: 'light', label: '清淡优先' },
  { id: 'balanced', label: '微辣以内' },
  { id: 'hot', label: '下饭重口' }
]

const excludeOptions: Array<{ id: DishTag; label: string }> = [
  { id: 'beef', label: '牛肉' },
  { id: 'pork', label: '猪肉' },
  { id: 'egg', label: '鸡蛋' },
  { id: 'spicy', label: '辣菜' }
]

const tagLabelMap: Record<DishTag, string> = {
  pork: '猪肉',
  beef: '牛肉',
  chicken: '鸡肉',
  egg: '鸡蛋',
  vegetarian: '素菜',
  spicy: '辣味',
  drink: '饮品'
}

const categoryLabelMap: Record<Exclude<DishCategory, 'all'>, string> = {
  signature: '推荐菜',
  'stir-fry': '小炒',
  vegetable: '素菜',
  staple: '主食饮品'
}

const leftMenu: DishSeed[] = [
  { name: '青椒肉片', description: '经典家常菜，稳妥不出错。', price: 18, category: 'signature', tags: ['pork'], spicyLevel: 1, recommended: true },
  { name: '番茄炒蛋', description: '酸甜清爽，适合搭配荤菜。', price: 14, category: 'stir-fry', tags: ['egg'], spicyLevel: 0 },
  { name: '肉沫豆腐', description: '嫩豆腐配肉沫，拌饭很稳。', price: 16, category: 'stir-fry', tags: ['pork'], spicyLevel: 1 },
  { name: '鱼香肉丝', description: '微甜微辣，适合多人点。', price: 22, category: 'signature', tags: ['pork', 'spicy'], spicyLevel: 1, recommended: true },
  { name: '手撕包菜', description: '脆口有锅气，预算友好。', price: 15, category: 'vegetable', tags: ['vegetarian', 'spicy'], spicyLevel: 1 },
  { name: '蒜蓉生菜', description: '清口收尾，适合搭配荤菜。', price: 13, category: 'vegetable', tags: ['vegetarian'], spicyLevel: 0 },
  { name: '小炒黄牛肉', description: '辣香集中，适合做主菜。', price: 28, category: 'signature', tags: ['beef', 'spicy'], spicyLevel: 2, recommended: true },
  { name: '梅菜扣肉', description: '偏下饭，适合搭配素菜。', price: 24, category: 'signature', tags: ['pork'], spicyLevel: 0 },
  { name: '米饭', description: '标准份。', price: 2, category: 'staple', tags: ['vegetarian'], spicyLevel: 0 },
  { name: '酸梅汤', description: '配辣菜更舒服。', price: 6, category: 'staple', tags: ['drink'], spicyLevel: 0 }
]

const rightMenu: DishSeed[] = [
  { name: '辣椒炒肉', description: '典型下饭菜，适合爱吃辣的人。', price: 20, category: 'signature', tags: ['pork', 'spicy'], spicyLevel: 2, recommended: true },
  { name: '木耳肉片', description: '层次平衡，接受度很高。', price: 18, category: 'stir-fry', tags: ['pork'], spicyLevel: 0 },
  { name: '豆角肉末', description: '经典拌饭菜，价格也稳。', price: 17, category: 'stir-fry', tags: ['pork'], spicyLevel: 0 },
  { name: '香辣鸡丁', description: '香味很快，适合多人点。', price: 22, category: 'signature', tags: ['chicken', 'spicy'], spicyLevel: 2, recommended: true },
  { name: '酸辣土豆丝', description: '非常适合做一桌里的平衡位。', price: 14, category: 'vegetable', tags: ['vegetarian', 'spicy'], spicyLevel: 1 },
  { name: '炝炒白菜', description: '简单但稳，预算低也能点。', price: 13, category: 'vegetable', tags: ['vegetarian'], spicyLevel: 0 },
  { name: '回锅肉', description: '强下饭路线，适合配米饭。', price: 22, category: 'signature', tags: ['pork', 'spicy'], spicyLevel: 2 },
  { name: '孜然牛肉', description: '香味足，适合做压轴菜。', price: 28, category: 'signature', tags: ['beef', 'spicy'], spicyLevel: 2, recommended: true },
  { name: '米饭', description: '标准份。', price: 2, category: 'staple', tags: ['vegetarian'], spicyLevel: 0 },
  { name: '冰豆浆', description: '配辣菜更友好。', price: 5, category: 'staple', tags: ['drink'], spicyLevel: 0 }
]

const dishes = mergeDishCatalog(leftMenu, rightMenu)

const presets: Preset[] = [
  { id: 'solo', title: '一人快餐', description: '2 道菜，适合中午快速下单。', people: 1, dishes: 2, budget: 30, taste: 'balanced' },
  { id: 'double', title: '双人均衡', description: '荤素搭配，预算留一点机动。', people: 2, dishes: 3, budget: 48, taste: 'all' },
  { id: 'team', title: '四人拼桌', description: '适合小组用餐，会优先带上主食。', people: 4, dishes: 6, budget: 96, taste: 'hot' }
]

const activeCategory = ref<DishCategory>('all')
const tasteMode = ref<TasteMode>('balanced')
const excludedTags = ref<DishTag[]>([])
const searchKeyword = ref('')
const partySize = ref(2)
const dishTarget = ref(4)
const budget = ref(58)
const deliveryTime = ref('12:10')
const orderNote = ref('少油少盐即可，米饭分开打包')
const cart = reactive<Record<string, number>>({})

const categoryOrder: Record<Exclude<DishCategory, 'all'>, number> = {
  signature: 0,
  'stir-fry': 1,
  vegetable: 2,
  staple: 3
}

const featuredDishes = computed(() => dishes.filter((dish) => dish.recommended).slice(0, 3))

const visibleDishes = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()

  return [...dishes]
    .filter((dish) => matchesFilters(dish, keyword))
    .sort((left, right) => {
      if (left.recommended !== right.recommended) {
        return Number(right.recommended) - Number(left.recommended)
      }

      if (categoryOrder[left.category] !== categoryOrder[right.category]) {
        return categoryOrder[left.category] - categoryOrder[right.category]
      }

      return left.price - right.price
    })
})

const cartItems = computed(() => {
  return dishes
    .filter((dish) => (cart[dish.id] ?? 0) > 0)
    .map((dish) => ({
      ...dish,
      quantity: cart[dish.id],
      subtotal: cart[dish.id] * dish.price
    }))
    .sort((left, right) => {
      if (categoryOrder[left.category] !== categoryOrder[right.category]) {
        return categoryOrder[left.category] - categoryOrder[right.category]
      }

      return left.name.localeCompare(right.name, 'zh-CN')
    })
})

const totalQuantity = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + item.subtotal, 0))
const remainingBudget = computed(() => budget.value - totalPrice.value)
const perPersonPrice = computed(() => Math.ceil(totalPrice.value / Math.max(partySize.value, 1)))

const orderText = computed(() => {
  if (!cartItems.value.length) {
    return `老板你好，今天中午 ${partySize.value} 人用餐，预计 ${deliveryTime.value} 左右送到。\n先把菜选好后，这里会自动生成下单文案。`
  }

  const lines = cartItems.value
    .map((item) => `- ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''} (${formatPrice(item.subtotal)})`)
    .join('\n')
  const noteText = orderNote.value.trim() ? `备注：${orderNote.value.trim()}` : '备注：正常出餐即可'

  return `老板你好，今天中午 ${partySize.value} 人用餐，预计 ${deliveryTime.value} 左右送到。\n麻烦安排以下菜品：\n${lines}\n合计 ${formatPrice(totalPrice.value)}。\n${noteText}`
})

function mergeDishCatalog(...menus: DishSeed[][]) {
  const map = new Map<string, Dish>()

  menus.flat().forEach((dish) => {
    const existing = map.get(dish.name)

    if (!existing) {
      map.set(dish.name, {
        ...dish,
        id: createDishId(dish.name)
      })
      return
    }

    map.set(dish.name, {
      ...existing,
      price: Math.min(existing.price, dish.price),
      recommended: existing.recommended || dish.recommended,
      tags: [...new Set([...existing.tags, ...dish.tags])],
      spicyLevel: normalizeSpicyLevel(Math.max(existing.spicyLevel, dish.spicyLevel))
    })
  })

  return Array.from(map.values())
}

function createDishId(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

function normalizeSpicyLevel(value: number): 0 | 1 | 2 {
  if (value <= 0) return 0
  if (value >= 2) return 2
  return 1
}

function matchesFilters(dish: Dish, keyword: string) {
  const keywordMatched = !keyword
    || dish.name.toLowerCase().includes(keyword)
    || dish.description.toLowerCase().includes(keyword)
    || dish.tags.some((tag) => tagLabelMap[tag].includes(searchKeyword.value))
  const categoryMatched = activeCategory.value === 'all' || dish.category === activeCategory.value
  const excludeMatched = excludedTags.value.every((tag) => !dish.tags.includes(tag))

  return keywordMatched && categoryMatched && excludeMatched && matchesTaste(dish)
}

function matchesTaste(dish: Dish) {
  if (tasteMode.value === 'all') return true
  if (tasteMode.value === 'light') return dish.spicyLevel === 0
  if (tasteMode.value === 'balanced') return dish.spicyLevel <= 1
  return dish.spicyLevel >= 1
}

function formatPrice(value: number) {
  return `¥${value}`
}

function adjustPartySize(delta: number) {
  partySize.value = clamp(partySize.value + delta, 1, 12)
}

function adjustDishTarget(delta: number) {
  dishTarget.value = clamp(dishTarget.value + delta, 1, 8)
}

function updateBudget(event: Event) {
  const nextValue = Number((event.target as HTMLInputElement).value)
  budget.value = Number.isFinite(nextValue) ? clamp(nextValue, 0, 300) : 0
}

function toggleTag(tag: DishTag) {
  excludedTags.value = excludedTags.value.includes(tag)
    ? excludedTags.value.filter((item) => item !== tag)
    : [...excludedTags.value, tag]
}

function increaseDish(dishId: string) {
  cart[dishId] = (cart[dishId] ?? 0) + 1
}

function decreaseDish(dishId: string) {
  if ((cart[dishId] ?? 0) <= 1) {
    delete cart[dishId]
    return
  }

  cart[dishId] -= 1
}

function clearCart() {
  Object.keys(cart).forEach((dishId) => delete cart[dishId])
}

function applyPreset(preset: Preset) {
  partySize.value = preset.people
  dishTarget.value = preset.dishes
  budget.value = preset.budget
  tasteMode.value = preset.taste
  activeCategory.value = 'all'
  searchKeyword.value = ''
  randomizeOrder()
}

function randomizeOrder() {
  const pool = dishes.filter((dish) => {
    return excludedTags.value.every((tag) => !dish.tags.includes(tag)) && matchesTaste(dish)
  })

  if (!pool.length) {
    message.warning('当前条件下没有可自动配菜的菜品')
    return
  }

  const plan = ['signature', 'stir-fry', 'vegetable', 'signature', 'staple', 'vegetable', 'stir-fry', 'signature'] as const
  const selected: Dish[] = []
  const available = [...pool]

  for (const category of plan.slice(0, Math.min(dishTarget.value, available.length))) {
    const picked = pickDish(available.filter((dish) => dish.category === category), selected, dishTarget.value)
    if (!picked) continue
    selected.push(picked)
    removeDish(available, picked.id)
  }

  while (selected.length < Math.min(dishTarget.value, pool.length) && available.length) {
    const picked = pickDish(available, selected, dishTarget.value)
    if (!picked) break
    selected.push(picked)
    removeDish(available, picked.id)
  }

  clearCart()
  selected.forEach((dish) => {
    cart[dish.id] = 1
  })

  message.success(`已生成 ${selected.length} 道菜`)
}

function pickDish(candidates: Dish[], selected: Dish[], targetCount: number) {
  if (!candidates.length) return null

  const currentTotal = selected.reduce((sum, item) => sum + item.price, 0)
  const reserveBudget = Math.max(targetCount - selected.length - 1, 0) * 14
  const affordable = candidates.filter((dish) => currentTotal + dish.price <= (budget.value || 9999) - reserveBudget + 12)
  const pool = affordable.length ? affordable : candidates
  const ranked = shuffle(pool).sort((left, right) => {
    return Number(right.recommended) - Number(left.recommended) || left.price - right.price
  })

  return ranked[0] ?? null
}

function removeDish(list: Dish[], dishId: string) {
  const index = list.findIndex((item) => item.id === dishId)
  if (index >= 0) {
    list.splice(index, 1)
  }
}

function shuffle<T>(list: T[]) {
  const copied = [...list]

  for (let index = copied.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1))
    const temp = copied[index]
    copied[index] = copied[nextIndex]
    copied[nextIndex] = temp
  }

  return copied
}

async function copyOrder() {
  if (!cartItems.value.length) {
    message.warning('先点几道菜，再复制下单文案')
    return
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(orderText.value)
    }
    else if (!fallbackCopy(orderText.value)) {
      throw new Error('copy-failed')
    }

    message.success('下单文案已复制')
  }
  catch {
    message.error('复制失败，请手动复制预览内容')
  }
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  return copied
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
</script>

<style scoped>
.food-page {
  --bg: linear-gradient(180deg, #fff7ee 0%, #fff1df 55%, #fffaf3 100%);
  --panel: rgba(255, 252, 246, 0.92);
  --line: rgba(108, 69, 30, 0.12);
  --text: #4c301d;
  --soft: #7e6148;
  --accent: #e56d2c;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  color: var(--text);
  font-family: 'Avenir Next', 'Trebuchet MS', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.panel {
  background: radial-gradient(circle at top right, rgba(255, 196, 141, 0.22), transparent 30%), var(--panel);
  border: 1px solid var(--line);
  border-radius: 28px;
  box-shadow: 0 20px 48px rgba(130, 82, 37, 0.08);
}

.hero,
.workspace {
  display: grid;
  gap: 18px;
}

.hero {
  padding: 18px;
  background: var(--bg);
}

.eyebrow,
.badge,
.chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
}

.eyebrow {
  padding: 6px 12px;
  background: rgba(76, 48, 29, 0.08);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin-top: 12px;
  font-size: clamp(2rem, 6vw, 3.3rem);
  line-height: 1.05;
  font-weight: 700;
}

.hero-text,
.special-card span,
.preset-card span,
.menu-head p,
.section-head p,
.dish-card p,
.empty,
.note span,
.note textarea,
.stat span,
.stat small {
  color: var(--soft);
}

.hero-text {
  margin-top: 12px;
  line-height: 1.7;
}

.stats,
.cart-metrics,
.controls,
.menu-grid {
  display: grid;
  gap: 12px;
}

.stats,
.cart-metrics {
  margin-top: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat,
.special-card,
.preset-card,
.step-card,
.dish-card,
.preview {
  border: 1px solid rgba(108, 69, 30, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
}

.stat,
.step-card {
  padding: 14px 16px;
}

.specials {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(76, 48, 29, 0.05);
}

.special-card,
.preset-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.special-card em {
  color: var(--accent);
  font-style: normal;
  font-weight: 700;
}

.special-card:hover,
.preset-card:hover,
.dish-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(130, 82, 37, 0.1);
}

.preset-row,
.chips {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  overflow-x: auto;
  scrollbar-width: none;
}

.preset-row::-webkit-scrollbar,
.chips::-webkit-scrollbar {
  display: none;
}

.workspace {
  margin-top: 18px;
}

.workspace > .panel {
  padding: 18px;
}

.controls {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.controls label,
.note {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls input,
.note textarea {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--text);
  font: inherit;
}

.note textarea {
  min-height: 92px;
  padding: 12px 14px;
  resize: vertical;
}

.step-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 245, 232, 0.8);
}

.metric,
.price,
.danger {
  color: #d45317;
  font-weight: 700;
}

.stepper,
.cart-actions,
.dish-bottom,
.dish-top,
.section-head,
.cart-item,
.mobile-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stepper {
  width: fit-content;
}

.stepper button,
.ghost,
.secondary-btn,
.primary-btn,
.chip {
  border: 0;
  cursor: pointer;
}

.stepper button {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(76, 48, 29, 0.08);
  color: var(--text);
}

.compact button {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}

.ghost,
.secondary-btn,
.primary-btn {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 16px;
  font: inherit;
  font-weight: 700;
}

.ghost,
.secondary-btn {
  background: rgba(76, 48, 29, 0.08);
  color: var(--text);
}

.primary-btn {
  background: linear-gradient(135deg, #f58c51, #dd5d1e);
  color: #fffaf4;
}

.chip {
  padding: 10px 15px;
  background: rgba(76, 48, 29, 0.06);
  color: var(--soft);
  white-space: nowrap;
}

.chip.muted {
  background: rgba(76, 48, 29, 0.05);
}

.chip.active {
  background: linear-gradient(135deg, #f58f5b, #e56d2c);
  color: #fffaf2;
}

.chip.secondary.active {
  background: var(--accent);
}

.menu-head {
  margin-top: 18px;
}

.menu-grid {
  margin-top: 18px;
}

.dish-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.dish-card h3,
.section-head h2,
.preview h3 {
  font-weight: 700;
}

.badge {
  padding: 6px 10px;
  background: rgba(21, 128, 61, 0.1);
  color: #1a7f43;
  font-size: 0.82rem;
  white-space: nowrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(76, 48, 29, 0.06);
  color: var(--soft);
  font-size: 0.82rem;
}

.cart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  padding: 12px 0;
  border-bottom: 1px solid rgba(108, 69, 30, 0.08);
}

.cart-item:last-child {
  border-bottom: 0;
}

.cart-item small {
  color: var(--soft);
}

.cart-buttons {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.preview {
  padding: 16px;
  background: rgba(76, 48, 29, 0.05);
}

.preview pre {
  margin-top: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.75;
  color: var(--soft);
  font-family: 'Fira Code', 'Consolas', 'PingFang SC', monospace;
}

.mobile-bar {
  position: sticky;
  bottom: 10px;
  z-index: 5;
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 250, 242, 0.94);
  border: 1px solid var(--line);
  box-shadow: 0 16px 36px rgba(130, 82, 37, 0.12);
}

@media (min-width: 720px) {
  .hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    padding: 24px;
  }

  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .workspace {
    grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
    align-items: start;
  }

  .cart {
    position: sticky;
    top: 16px;
  }

  .mobile-bar {
    display: none;
  }
}

@media (max-width: 719px) {
  .stats,
  .cart-metrics,
  .controls,
  .cart-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
