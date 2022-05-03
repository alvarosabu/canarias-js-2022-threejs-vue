<script setup lang="ts">
const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <footer
    class="mt-auto flex justify-end items-center w-full z-10 fixed bottom-0 left-0 p-8 pointer-events-none"
  >
    <img
      :src="
        dark || $slidev.nav.currentRoute.meta.colorSchema === 'dark'
          ? 'logo-dark.svg'
          : 'logo.svg'
      "
      class="h-4 w-auto"
    />
  </footer>
</template>
