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

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

let geometry = new THREE.BoxGeometry(1, 1, 1)
let material = new THREE.MeshToonMaterial({
  color: 0x00bf7e,
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

  camera.position.set(3, 5, 2)

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

function initPane() {
  pane = new Pane({
    container: document.getElementById('tweakpane-container'),
  })
  pane.addInput(axesHelper, 'visible', {
    label: 'Axes Helper',
  })
  const positionFolder = pane.addFolder({ title: 'Position', expanded: false })
  positionFolder.addInput(mesh.position, 'x', {
    min: -2,
    max: 2,
    step: 0.1,
  })
  positionFolder.addInput(mesh.position, 'y', {
    min: -2,
    max: 2,
    step: 0.1,
  })
  positionFolder.addInput(mesh.position, 'z', {
    min: -2,
    max: 2,
    step: 0.1,
  })

  const rotationFolder = pane.addFolder({ title: 'Rotation', expanded: false })
  rotationFolder.addInput(mesh.rotation, 'x', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
  })
  rotationFolder.addInput(mesh.rotation, 'y', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
  })
  rotationFolder.addInput(mesh.rotation, 'z', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
  })

  const scaleFolder = pane.addFolder({ title: 'Scale', expanded: false })
  scaleFolder.addInput(mesh.scale, 'x', {
    min: 0.1,
    max: 2,
    step: 0.1,
  })
  scaleFolder.addInput(mesh.scale, 'y', {
    min: 0.1,
    max: 2,
    step: 0.1,
  })
  scaleFolder.addInput(mesh.scale, 'z', {
    min: 0.1,
    max: 2,
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
