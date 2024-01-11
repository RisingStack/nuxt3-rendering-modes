<template>
    <div>
        <p>{{ pageType }} page</p>
        <pre>{{ new Date().toUTCString() }} </pre>
        <pre>{{ data }}</pre>
        <NuxtLink to="/">Home</NuxtLink>
    </div>
</template>
<script setup lang="ts">
const pageType = "SSR";
const { data } = await useFetch('/api/hello')
</script>