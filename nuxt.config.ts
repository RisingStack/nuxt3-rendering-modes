// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  routeRules: {
    // revalidate after 60 seconds
    "/isr_ttl": { isr: 60 },
    "/isr_no_ttl": { isr: true },
    "/swr_ttl": { swr: 60 },
    "/swr_no_ttl": { swr: true },
    "/ssg": { prerender: true },
    "/spa": { ssr: false },
  },
});
