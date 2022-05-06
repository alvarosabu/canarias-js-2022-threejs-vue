<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const experience = ref(null)

let renderer
let camera
let controls
let pane
let scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.castShadow = true
directionalLight.position.set(0, 5, 5)

const helper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLight, helper)

let geometry = new THREE.TorusKnotGeometry(1, 0.5, 100, 16)
let material = new THREE.MeshToonMaterial({
  color: 0x00bf7e,
})
let mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 3, 0)

mesh.castShadow = true

directionalLight.target = mesh

scene.add(mesh)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 10, 10),
  new THREE.MeshStandardMaterial({ color: '#444' }),
)

plane.rotation.set(-Math.PI / 2, 0, 0)

plane.receiveShadow = true

scene.add(plane)

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

  camera.position.set(10, 10, 10)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.shadowMap.enabled = true

  renderer.render(scene, camera)
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
  pane.addInput(directionalLight, 'intensity', {
    label: 'Intensity',
    min: 0,
    max: 1,
    step: 0.01,
  })
  const positionFolder = pane.addFolder({
    title: 'DirectionalLight',
    expanded: false,
  })
  positionFolder.addInput(directionalLight.position, 'x', {
    min: -10,
    max: 10,
    step: 0.1,
  })
  positionFolder.addInput(directionalLight.position, 'y', {
    min: -10,
    max: 10,
    step: 0.1,
  })
  positionFolder.addInput(directionalLight.position, 'z', {
    min: -10,
    max: 10,
    step: 0.1,
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
