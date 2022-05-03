<script setup lang="ts">
import {
  GltfModel,
  Camera,
  PointLight,
  Renderer,
  Scene,
  DirectionalLight,
  Plane,
  StandardMaterial,
  RectAreaLight,
  BasicMaterial,
} from 'troisjs'

function onReady(scene) {
  scene.scene.children[0].traverse(o => {
    if (o.isMesh) {
      // handle both multiple and single materials
      const asArray = Array.isArray(o.material) ? o.material : [o.material]
      // 0 works for matte materials - change as needed
      asArray.forEach(mat => (mat.metalness = 0))
    }
  })
}
</script>

<template>
  <Renderer orbit-ctrl resize>
    <Camera :position="{ z: 16, x: 12, y: 0 }" />
    <Scene background="#111">
      <RectAreaLight :intensity="1" :position="{ y: 8, z: 4, x: 0 }" />
      <DirectionalLight
        :position="{ y: 2, x: 10 }"
        :intensity="1"
        color="#fff"
      />
      <DirectionalLight
        :position="{ y: 2, x: -10 }"
        :intensity="1"
        color="#fff"
      />
      <PointLight :position="{ y: 10, z: 10 }" />
      <Plane
        :scale="{ x: 10, y: 10, z: 10 }"
        :position="{ y: 0, z: 0, x: 0 }"
        :rotation="{ x: -Math.PI / 2 }"
        :cast-shadow="false"
        :receive-shadow="false"
      >
        <BasicMaterial color="#111" />
      </Plane>
      <GltfModel
        src="/models/vue-logo/vue-logo.gltf"
        @load="onReady"
        :position="{ x: 0, y: 0, z: 0 }"
      />
    </Scene>
  </Renderer>
</template>
