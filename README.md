# Astro SaaS Landing — Автоматизированный двуязычный шаблон EN/RU

Это не просто сайт — это **полуавтоматизированный шаблон** для быстрого деплоя брендированных лендингов. Генератор заполняет переменные окружения, запускает сборочные скрипты, и шаблон самостоятельно подхватывает бренд, домен, favicon и формирует готовый архив для публикации.

Базируется на **Astro 4** со светлым минималистичным дизайном и поддержкой двух языков — английского и русского.

---

## Как это работает

1. Генератор заполняет `.env` нужными значениями
2. Генератор запускает `npm ci` (требует актуальный `package-lock.json` — он есть)
3. Запускаются команды `npm run favicon`, `npm run sitemap`, `npm run build`, `npm run archive`
4. Результат — `PUBLIC_BRAND.zip` с готовым сайтом для загрузки на хостинг

---

## Переменные окружения

Скопируйте `.env.example` в `.env`. Все переменные заполняются генератором:

| Переменная | Описание |
|-----------|----------|
| `PUBLIC_BRAND` | Название бренда (используется в заголовках и имени архива) |
| `PUBLIC_DOMAIN` | Домен с `https://` без слеша в конце |
| `PUBLIC_EMAIL` | Контактный email |
| `PUBLIC_PHONE` | Контактный телефон |
| `PUBLIC_REF` | Основная CTA-ссылка (регистрация / партнёрская ссылка) |
| `PUBLIC_APP` | Ссылка на приложение (если приложения нет — совпадает с `PUBLIC_REF`) |

---

## Автоматизированные команды

### `npm run favicon`
Генерирует полный набор favicon (ICO, PNG разных размеров, манифест) из исходного изображения `public/img/favicon.png` и автоматически интегрирует теги в layout.

### `npm run sitemap`
Генерирует `public/sitemap.xml` на основе списка страниц из `pages.config.mjs` с подстановкой `PUBLIC_DOMAIN`.

### `npm run build`
Стандартная сборка Astro в `dist/`.

### `npm run archive`
Создаёт ZIP-архив содержимого папки `dist/` **без вложенных папок** (файлы сразу в корне архива). Имя архива — `PUBLIC_BRAND.zip`.

---

## Система локализации

Тексты для каждой страницы хранятся в JSON-файлах по схеме:
```
src/locales/pages/[pageSlug]/[langCode].json
```

Например:
- `src/locales/pages/home/en.json`
- `src/locales/pages/about/ru.json`

Общие переводы (футер, навигация):
- `src/locales/common/en.json`
- `src/locales/common/ru.json`

---

## Плейсхолдеры в статических файлах

`public/robots.txt` и `public/.htaccess` содержат плейсхолдер `{DOMAIN}`, который при деплое заменяется на значение `PUBLIC_DOMAIN`:

```
# robots.txt
Sitemap: {DOMAIN}/sitemap.xml
```

---

## Canon и hreflang

`public/canon.json` — централизованный конфиг для canonical и hreflang-тегов. Содержит объект для каждой страницы. Поддержка hreflang опциональна — страница может иметь только canonical без альтернативных языков.

---

## Стек

- **[Astro 4](https://astro.build/)** — статическая генерация, нулевой JS по умолчанию
- **TypeScript** — строгая типизация
- **CSS Custom Properties** — дизайн-токены
- **Inter** — современная типографика
- **JSON локали** — переводы без сторонних i18n-библиотек

---

## Страницы

| Маршрут | Описание |
|---------|----------|
| `/` | Редирект на `/en/` |
| `/en/` / `/ru/` | Главная страница |
| `/en/about` / `/ru/about` | О нас |
| `/en/features` / `/ru/features` | Возможности |
| `/en/products` / `/ru/products` | Продукты |
| `/en/contact` / `/ru/contact` | Контакты |
| `/404` | Страница ошибки |

---

## Компоненты

- **HeroLicense** — премиум-герой с фоном, статистикой и CTA
- **HeroSection** — универсальный герой для внутренних страниц
- **ProductOverview** — сравнительные карточки (предпочтительный/нежелательный путь)
- **ProductStrategies** — карточки стратегий с тегами
- **ProductWhy** — сетка преимуществ
- **HighlightCards** — карточки возможностей с цветовыми акцентами
- **SectionIntro** — вводная секция с карточкой и CTA
- **TermsList** — список условий
- **TrustPlatform** — карточки с данными платформы
- **TrustRoutine** — блок доверия с шагами
- **ContactPremium** — форма контактов с teaser и showcase
- **FAQ** — аккордеон
- **ContentArticle** — статейный блок
- **Header** — фиксированная навигация с переключателем языков EN/RU
- **Footer** — тёмный футер с колонками

---

## SEO

- JSON-LD (`SeoSchema`) для каждой страницы
- Open Graph (`SeoOG`, `SeoOGHome`)
- `canon.json` — canonical / hreflang
- `sitemap.xml` + `robots.txt` с плейсхолдерами
- Web App Manifest

---

## Дизайн-система

Светлая минималистичная палитра с CSS-токенами:

| Токен | Значение |
|-------|----------|
| `--color-primary` | `#6366F1` — индиго |
| `--color-text` | `#0F172A` — почти чёрный |
| `--color-text-secondary` | `#475569` |
| `--color-bg` | `#FFFFFF` |
| `--color-surface-alt` | `#F8FAFC` |
| `--color-border` | `#E2E8F0` |
| `--shadow-indigo` | Тень с индиго-оттенком |

---

## Структура проекта

```
├── pages.config.mjs          # Список страниц для sitemap
├── scripts/
│   ├── favicon.mjs           # Генератор favicon
│   ├── sitemap.mjs           # Генератор sitemap
│   └── archive.mjs           # Упаковка dist в ZIP
├── public/
│   ├── canon.json            # Конфиг canonical/hreflang
│   ├── robots.txt            # Плейсхолдер {DOMAIN}
│   ├── .htaccess             # Плейсхолдер {DOMAIN}
│   └── img/favicon.png       # Источник для генерации favicon
└── src/
    ├── components/           # Astro-компоненты
    │   └── seo/
    ├── i18n/utils.ts         # buildPath(), getLangFromUrl()
    ├── layouts/              # BaseLayout, PageLayout
    ├── locales/
    │   ├── common/           # en.json / ru.json
    │   └── pages/[slug]/     # en.json / ru.json
    ├── pages/
    │   ├── en/
    │   └── ru/
    ├── styles/global.css
    └── utils/                # env, canon, i18n
```

---

## Лицензия

MIT
