<template>
  <div
    class="absolute right-0 top-0 w-16 p-8 write-vertical-right text-sm uppercase"
  >
    <div class="flex justify-between transform -rotate-180 w-full widest">
      <p>{{ $slidev.nav.currentRoute.meta.slide.title }}</p>
      <strong> {{ $slidev.nav.currentPage }}</strong>
    </div>
  </div>
</template>
