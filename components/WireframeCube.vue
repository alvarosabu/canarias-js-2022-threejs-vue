<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const experience = ref(null)

let renderer
let camera
let controls

let scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

let geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshToonMaterial({
  color: 0x00bf7e,
  wireframe: true,
})
let mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: experience.value,
  })

  camera = new THREE.PerspectiveCamera(
    45,
    experience.value.clientWidth / experience.value.clientHeight,
    0.1,
    1000,
  )

  camera.position.set(8, 7, 10)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.render(scene, camera)
}

function loop() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}

onMounted(() => {
  if (!renderer) {
    initRenderer()
    loop()
  }
})

onUnmounted(() => {
  renderer.dispose()
})
</script>
<template>
  <canvas ref="experience" />
</template>
