<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#1B5299" />
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
  </div>
</template>
