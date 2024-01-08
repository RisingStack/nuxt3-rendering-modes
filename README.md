# Nuxt 3 Rendering modes

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Startup
### Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Rendering modes

### Overview
#### SPA
**Single Page Application** (also called **Client Side Rendering**). [Documentation link](https://nuxt.com/docs/guide/concepts/rendering#client-side-rendering)

In this rendering mode  HTML elements are generated after the browser downloads and parses all the JavaScript code containing the instructions to create the current interface.
#### SSR
**Server Side Rendering** (also called **Universal Rendering**). [Documentation link](https://nuxt.com/docs/guide/concepts/rendering#universal-rendering)

In this mode, Nuxt server generates the html on demand and returns a fully rendered HTML page to the browser.
#### SSG
**Static Site Generation** [Documentation link](https://nuxt.com/docs/getting-started/deployment#selective-pre-rendering)

With this mode, page is generated at build time and served to the browser and is not regenerated again until next build
#### SWR
**Stale While Revalidate** [Documentation link](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)

This mode utilizes a technique called stale-while-revalidate, which allows the server to serve stale data while revalidating the data in the background. Server on demand generates and returns html response. This html response is cached on server (when app is deployed, this may differ based on provider (Vercel, Netlify etc.): information re- where the cache is stored is typically not disclosed by provider). There are two possible settings for caching:
- no TTL (time to live) means response is cached until it changes;
- TTL set means response is cached until TTL expired.
When detected change during receiving request (no TTL) or when TTL expired, server returns stale response and in the backround generates new html, which is then served on next request.
#### ISR
**Incremental Static Regeneration** (also called **Hybrid Mode**) [Documentation link](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)

This rendering mode works pretty much same way as SWR, with the only difference that response is cached on CDN network. There are two possible settings for caching:
- no TTL (time to live) means response is cached permanently;
- TTL set means response is cached until TTL expired.

### Project setup
Project has 7 pages, each containing curent time and html response from the same route (route `/api/hello` returns json response with current time) with different available rendering modes enabled.

[Example of page code:](pages/spa.vue)
```
<template>
    <div>
        <p>SPA page</p>
        <pre>{{ new Date().toUTCString() }} </pre>
        <pre>{{ data }}</pre>
        <NuxtLink to="/">Home</NuxtLink>
    </div>
</template>
<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>
```
The only difference between pages is this fragment:
```
<p>SPA page</p>
```
which has a page type.
All other code is same for each page.

[API route:](server/api/hello.ts)
```
export default defineEventHandler((event) => {
  return {
    hello: "world" + new Date().toUTCString(),
  };
});
```
Rendering modes are set up in [nuxt.config](nuxt.config.ts):
```
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    "/isr_ttl": { isr: 60 },
    "/isr_no_ttl": { isr: true },
    "/swr_ttl": { swr: 60 },
    "/swr_no_ttl": { swr: true },
    "/ssg": { prerender: true },
    "/spa": { ssr: false },
  },
});
```

### Technical details and showcase

1. `/spa` - **single page application** (also called **client side rendering**).
To illustrate the SPA behaviour we can look on below table illustrating values for the first request, as well as screencast:

| Data                                          | Value                         |
| -------------------------------               | ----------------------------- |
| HTML response - time rendered                 | HTML response is blank        |
| HTML response - time from api response        | HTML response is blank        |
| Page visible by user - time rendered          | Fri, 05 Jan 2024 13:26:58 GMT |
| Page visible by user - time from api response | Fri, 05 Jan 2024 13:26:58 GMT |

As we can see in the table, html response is blank, and time rendered in browser is same as time received in api response, since api request happens during rendering. On the subsequent requests / page reload, html response will be blank each time and time will change each time as well, but will remain same for browser-rendered value and api response value.

<img src="readme_assets/spa.gif" width="1200"/>

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/spa": { ssr: false },
  },
```
<div id="ssr-tech-details"></div>

2. `/ssr` - **server side rendering** (also called **universal rendering**).

To illustrate the SSR behaviour we can look on below table illustrating values for the first request, as well as screencast:

| Data                                          | Value                         |
| -------------------------------               | ----------------------------- |
| HTML response - time rendered                 | Fri, 05 Jan 2024 14:07:54 GMT |
| HTML response - time from api response        | Fri, 05 Jan 2024 14:07:54 GMT |
| Page visible by user - time rendered          | Fri, 05 Jan 2024 14:07:55 GMT |
| Page visible by user - time from api response | Fri, 05 Jan 2024 14:07:54 GMT |

As we can see in the table, time rendered in browser may be slightly different from the time coming from api response as api response is generated prior, but timestamps are still very close to each other as html generation happens on demand and is not cached. This behavior will not change in subsequent requests / page reload.

<img src="readme_assets/ssr.gif" width="1200"/>

To enable this mode, enable ssr in nuxt.config as following:
```
  ssr: true,
```
3. `/ssg` - **static site generation**. In below screencast we can see that html response served never changes, the only thing which changes is the time rendered in browser.

To illustrate the SSG behaviour we can look on below table illustrating values for the first request, as well as screencast:

| Data                                          | Value                         |
| -------------------------------               | ----------------------------- |
| HTML response - time rendered                 | Fri, 05 Jan 2024 12:18:57 GMT |
| HTML response - time from api response        | Fri, 05 Jan 2024 12:18:57 GMT |
| Page visible by user - time rendered          | Fri, 05 Jan 2024 14:23:23 GMT |
| Page visible by user - time from api response | Fri, 05 Jan 2024 12:18:57 GMT |

In above table we can see quite big time difference between time rendered in browser as visible by user vs other timestamps since SSG mode generates html during build time and it does not change later. This behavior will not change in subsequent requests / page reload.

<img src="readme_assets/ssg.gif" width="1200"/>

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/ssg": { prerender: true },
  },
```
4. `/swr_no_ttl` - **stale while revalidate** without TTL enabled. 

To illustrate the SWR behaviour without TTL enabled we can look on below table illustrating values for multiple requests, as well as screencast:

| Data                                          | Value - first request         | Value - second request        | Value - third request         |
| -------------------------------               | ----------------------------- | ----------------------------- | ----------------------------- |
| HTML response - time rendered                 | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:09 GMT |
| HTML response - time from api response        | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:09 GMT |
| Page visible by user - time rendered          | Fri, 05 Jan 2024 15:21:04 GMT | Fri, 05 Jan 2024 15:21:10 GMT | Fri, 05 Jan 2024 15:21:15 GMT |
| Page visible by user - time from api response | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:03 GMT | Fri, 05 Jan 2024 15:21:09 GMT |

In above table we can see that upon first request we get values similar to [SSR behavior](#ssr-tech-details) where only time rendered in browser is slightly different; on second request stale response is provided and time rendered in browser changes, while on third request updated response is served (since api response includes current time, api response itself is different on each request) and time rendered in browser is updated as well.

<img src="readme_assets/swr_no_ttl.gif" width="1200"/>

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/swr_no_ttl": { swr: true },
  },
```
5. `/swr_ttl` - **stale while revalidate** with TTL 60 seconds enabled. This rendering mode is visible in below screencast where stale response is served for 60 seconds, after it is passed, next request is still containing stale data, after that new data is served.

To illustrate the SWR behaviour with TTL enabled we can look on below table illustrating values for multiple requests, as well as screencast:

| Data                                          | Value - first request         | Value - second request        | Value - first request after TTL of 60 seconds passed | Value - second request after TTL of 60 seconds passed |
| -------------------------------               | ----------------------------- | ----------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| HTML response - time rendered                 | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT                        | Fri, 05 Jan 2024 15:31:21 GMT                        |
| HTML response - time from api response        | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT                        | Fri, 05 Jan 2024 15:31:21 GMT                        |
| Page visible by user - time rendered          | Fri, 05 Jan 2024 15:30:17 GMT | Fri, 05 Jan 2024 15:30:28 GMT | Fri, 05 Jan 2024 15:31:22 GMT                        | Fri, 05 Jan 2024 15:31:29 GMT                        |
| Page visible by user - time from api response | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT | Fri, 05 Jan 2024 15:30:16 GMT                        | Fri, 05 Jan 2024 15:31:21 GMT                        |

In above table and screencast we can see that upon first request we get values similar to [SSR behavior](#ssr-tech-details) where only time rendered in browser is slightly different; on second request stale response is provided and time rendered in browser changes; subsequent requests until TTL of 60 seconds passes are having same stale response. After TTL expires, next request is still containing stale data, after that new data is served.

<img src="readme_assets/swr_ttl.gif" width="1200"/>

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/swr_ttl": { swr: 60 },
  },
```
6. `/isr_no_ttl` - **incremental static regeneration** (also called **hybrid mode**) without TTL enabled. Below screencast shows that response does not change even after 60 seconds have passed (typically Vercel's default TTL).

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/isr_no_ttl": { isr: true },
  },
```
7. `/isr_ttl` - **incremental static regeneration** (also called **hybrid mode**) with TTL of 60 seconds enabled. Below screencast demonstrates that stale response is served for 60 seconds, after it is passed, next request is still containing stale data, after that new data is served.

To enable this mode, set up a route rule in nuxt.config as following:
```
  routeRules: {
    "/isr_ttl": { isr: 60 },
  },
```
Note that all above mentioned rendering modes expect ISR can easily be tested in local environment as well by building and previewing the app. Since ISR utilizes CDN network, it would require CDN in order to test (e.g. by deploying to Vercel).

Vercel deployment can be configured to use [edge functions](https://vercel.com/docs/frameworks/nuxt#edge-functions) or [serverless functions](https://vercel.com/docs/frameworks/nuxt#serverless-functions). Note that SWR works only with edge functions while ISR works only with serverless functions

[//TODO]: # (update SWR/ISR vercel based on response to customer service ticket)