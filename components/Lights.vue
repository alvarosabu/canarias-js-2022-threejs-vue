<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
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
directionalLight.position.set(5, 20, 0)
directionalLight.shadow.mapSize.set(1024, 1024)

const helper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLight, helper)

const rectAreaLight = new THREE.RectAreaLight('purple', 1, 8, 8)
rectAreaLight.position.set(0, 10, 0)
rectAreaLight.lookAt(0, 0, 0)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(rectAreaLight, rectAreaLightHelper)

const hemisphereLight = new THREE.HemisphereLight('red', 'blue', 0.5)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  5,
)
scene.add(hemisphereLight, hemisphereLightHelper)

const spotLight = new THREE.SpotLight('yellow', 1, 100, Math.PI / 4, 0.25, 1)
spotLight.position.set(0, 2, -8)
scene.add(spotLight)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x00bf7e }),
)
sphere.castShadow = true
sphere.receiveShadow = true
sphere.position.set(0, 4, 0)
scene.add(sphere)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.5, 16, 100),
  new THREE.MeshStandardMaterial({ color: '#5447AA' }),
)
torus.position.set(6, 8, 0)
torus.rotation.set(0, Math.PI / 2, 0)
torus.castShadow = true
scene.add(torus)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30, 10, 10),
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

  camera.position.set(15, 15, 15)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    min: -20,
    max: 20,
    step: 0.1,
  })
  positionFolder.addInput(directionalLight.position, 'y', {
    min: -20,
    max: 20,
    step: 0.1,
  })
  positionFolder.addInput(directionalLight.position, 'z', {
    min: -20,
    max: 20,
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
