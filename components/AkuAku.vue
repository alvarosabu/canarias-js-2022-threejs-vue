<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const experience = ref(null)
let renderer
let camera
let controls
let pane
let scene = new THREE.Scene()

const bgColor = new THREE.Color('#111')

scene.fog = new THREE.Fog(bgColor, 0.1, 75)
scene.background = bgColor

// Lights
const ambientLight = new THREE.AmbientLight(0xff00ff, 0.1)
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0.4, 4, 4)
rectAreaLight.position.set(0, -2, 0)
rectAreaLight.rotation.set(Math.PI / 2, 0, 0)

scene.add(ambientLight, rectAreaLight)

scene.add(camera)

// Lights

// Model
const gltfLoader = new GLTFLoader()

gltfLoader.load('/models/AkuAku.gltf', gltf => {
  /* gltf.scene.scale.set(0.1, 0.1, 0.1) */
  console.log(gltf.scene)
  gltf.scene.position.set(0, -2, 0)
  scene.add(gltf.scene)
})

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

  camera.position.set(2, 0, 8)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.render(scene, camera)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMappingExposure = 2.3
  renderer.shadowMap.enabled = true
  renderer.gammaFactor = 0
}

function loop() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}

function initPane() {
  pane = new Pane({
    container: document.getElementById('tweakpane-container'),
  })
}

onMounted(() => {
  if (!renderer) {
    initRenderer()
    loop()
    initPane()
  }
})

onUnmounted(() => {
  pane.dispose()
  renderer.dispose()
})
</script>

<template>
  <div class="relative" id="tweakpane-container">
    <canvas ref="experience" class="w-full h-250px" />
  </div>
</template>
