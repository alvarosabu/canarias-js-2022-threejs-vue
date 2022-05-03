<script setup lang="ts">
import {
  Renderer,
  Scene,
  Camera,
  AmbientLight,
  DirectionalLight,
  Box,
  Plane,
  StandardMaterial,
} from 'troisjs'
</script>
<template>
  <Renderer ref="renderer" orbit-ctrl alpha resize shadow>
    <Camera :position="{ z: 5 }" />
    <Scene background="#222">
      <AmbientLight color="#fff" />
      <DirectionalLight
        ref="directionalLight"
        color="#FCF9D9"
        :intensity="0.5"
        cast-shadow
        :position="{ x: 5, y: 20, z: 0 }"
        :shadow-map-size="{ width: 1024, height: 1024 }"
        :shadow-camera="{
          left: -100,
          right: 100,
          top: 100,
          bottom: -100,
          near: 0.5,
          far: 500,
        }"
      />
      <Box
        :position="{ x: 0, y: 1, z: 0 }"
        :radius="2"
        :width-segments="32"
        :height-segments="32"
        receive-shadow
        cast-shadow
      >
        <StandardMaterial :color="'red'" />
      </Box>
      <Plane
        :width="30"
        :height="30"
        :rotation="{ x: -Math.PI / 2 }"
        receive-shadow
      >
        <StandardMaterial :color="'#444'" />
      </Plane>
    </Scene>
  </Renderer>
</template>
