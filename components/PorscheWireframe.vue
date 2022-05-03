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

scene.background = new THREE.Color(0xffffff)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalBlueLight = new THREE.DirectionalLight(0x0000ff, 1)
directionalBlueLight.position.set(-5, 0, 0)
scene.add(directionalBlueLight)

const directionalRedLight = new THREE.DirectionalLight(0xff0000, 1)
directionalRedLight.position.set(5, 0, 0)
scene.add(directionalRedLight)

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 0.4, 4, 4)
rectAreaLight.rotation.set(Math.PI / 2, 0, 0)
scene.add(rectAreaLight)

// Model
const gltfLoader = new GLTFLoader()

gltfLoader.load('/models/porsche-911-carrera/scene.gltf', gltf => {
  /* gltf.scene.scale.set(0.1, 0.1, 0.1) */
  scene.add(gltf.scene)

  gltf.scene.traverse(child => {
    if (child.isMesh) {
      child.material.wireframe = true
    }
  })
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

  camera.position.set(2, 1, 4)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.render(scene, camera)
  renderer.outputEncoding = THREE.sRGBEncoding
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
