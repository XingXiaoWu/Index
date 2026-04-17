# Agent Guide

## 项目定位

这是一个基于 `Vue 3 + Vite + TypeScript` 的个人工具与资源聚合站。

当前主页和分类页已经改造成 **JSON 配置驱动**：

- 首页入口来自 `public/site.config.json`
- 分类页也复用同一份配置
- 视觉方向偏硬朗、留白明显、少解释性文案

如果你要继续扩展站点，优先沿着这条路线做，不要再把首页写回“静态说明页”。

## 技术栈

- `vue`
- `vue-router`
- `vite`
- `typescript`
- `naive-ui`
- `unocss`
- `pinia`
- `pdfjs-dist`
- `jszip`
- `qrcode-generator`
- `jsencrypt`

## 常用命令

开发：

```bash
pnpm dev
```

类型检查：

```bash
pnpm type-check
```

生产构建：

```bash
pnpm build-only
```

补充说明：

- `pnpm build` 会串联检查和构建
- 真正排错时，优先分别跑 `pnpm type-check` 和 `pnpm build-only`

## 目录约定

### 核心入口

- `src/main.ts`：应用入口
- `src/App.vue`：全局布局容器
- `src/router/index.ts`：路由总表

### 配置驱动门户

- `public/site.config.json`：首页、快捷入口、分类聚合、集合分组的配置源
- `src/types/portal.ts`：门户配置类型定义
- `src/composables/usePortalConfig.ts`：配置加载与缓存
- `src/components/GridComponent.vue`：统一卡片网格组件
- `src/views/portal/Index.vue`：门户首页
- `src/views/portal/CollectionView.vue`：通用分类页

### 页面分类

- `src/views/portal/`：门户页
- `src/views/image/`：图片工具
- `src/views/text/`：文本工具
- `src/views/myself/`：个人工具与页面
- `src/views/network/`：网络相关页面
- `src/views/ai/`、`src/views/hack/`、`src/views/develop/`、`src/views/maybe/`：旧分组页面，目前主要作为历史遗留内容存在

## 路由规则

路由统一写在：

- `src/router/index.ts`

当前约定：

- 首页使用 `@/views/portal/Index.vue`
- `hack-tools`、`develop-tools`、`ai-tools`、`ai-tools2`、`myself-tools`、`maybe-tools`
  统一走 `CollectionView`
- 这些分类页通过 `route.meta.collectionId` 从 `site.config.json` 找到对应配置

如果新增一个新的配置驱动分类：

1. 在 `public/site.config.json` 里新增 `collection`
2. 在 `src/router/index.ts` 新增对应路由
3. 给该路由设置正确的 `meta.collectionId`

## 开发约定

### 1. 首页与分类页优先配置驱动

不要把首页内容重新散落回：

- `src/const/*.ts`
- 多个独立静态分类页面

对于首页、主入口、聚合分类，优先编辑：

- `public/site.config.json`

### 2. 文案克制

这是当前明确的产品方向：

- 不要在页面顶部堆“项目说明式”长文案
- 少写“这是一个……首页”这类说明
- 把空间尽量留给设计、排版和卡片内容

能只保留标题，就不要再加一段解释。

### 3. 复用统一卡片

站内入口、外链入口、样本卡片，优先复用：

- `src/components/GridComponent.vue`

不要轻易再造一套新的入口卡片系统，除非视觉需求完全不同。

### 4. Views 继续按职责分组

新增页面时，不要再放回 `src/views` 根目录。

推荐规则：

- 门户页放 `src/views/portal/`
- 图片页放 `src/views/image/`
- 文本页放 `src/views/text/`
- 个人工具放 `src/views/myself/`
- 其他类别按功能单独建目录

### 5. 优先使用 `@/` 别名

项目已经配置了：

- `@ -> src`

导入时优先使用 `@/views/...`、`@/components/...`、`@/assets/...`

这样在移动文件时更稳。

## 样式方向

当前视觉已经往以下方向调整：

- 硬朗
- 非圆润默认模板感
- 信息密度适中
- 留白明显
- 英文标签 + 中文标题混用
- 少解释文案，多结构和版式

后续改样式时，尽量延续这个方向，不要退回普通后台卡片风格。

## 修改建议

### 改首页

优先看：

- `public/site.config.json`
- `src/views/portal/Index.vue`
- `src/components/GridComponent.vue`

### 改分类聚合

优先看：

- `public/site.config.json`
- `src/views/portal/CollectionView.vue`
- `src/router/index.ts`

### 改图片工具

优先看：

- `src/views/image/`

### 改文本工具

优先看：

- `src/views/text/`

### 改个人工具

优先看：

- `src/views/myself/`

## 验证要求

提交前至少执行：

```bash
pnpm type-check
pnpm build-only
```

如果只是改配置文件，也建议至少跑一次构建确认 JSON 读取链路没问题。

## 备注

- 根目录目前有一些临时文件和历史文件，不要默认清理，除非用户明确要求
- `src/const/*.ts` 仍然存在，但门户主流程已经不再依赖它们
- `components.d.ts`、`auto-imports.d.ts` 可能会因组件扫描自动变化，属于正常现象
