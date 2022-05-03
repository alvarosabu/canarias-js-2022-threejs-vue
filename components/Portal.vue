<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import FireFliesVertex from './shaders/fireflies/vertex.glsl'
import FireFliesFragment from './shaders/fireflies/fragment.glsl'
import PortalVertex from './shaders/portal/vertex.glsl'
import PortalFragment from './shaders/portal/fragment.glsl'

const experience = ref(null)
let renderer
let camera
let controls
let pane
let scene = new THREE.Scene()

const debugObject = {
  clearColor: '#201919',
  portalColorStart: '#f2e1c7',
  portalColorEnd: '#faf8db',
}

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Texture Loader
const bakedTexture = new THREE.TextureLoader().load('/models/portal/baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/*
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
  side: THREE.DoubleSide,
})

const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) },
  },
  vertexShader: PortalVertex,
  fragmentShader: PortalFragment,
  side: THREE.DoubleSide,
})

/**
 * Model
 */
gltfLoader.load('/models/portal/portal.glb', gltf => {
  console.log(gltf.scene)
  const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
  ;(bakedMesh as Mesh).material = bakedMaterial
  const portalCircle = gltf.scene.children.find(
    child => child.name === 'portalCircle',
  )
  ;(portalCircle as Mesh).material = portalLightMaterial
  console.log(bakedMesh)
  scene.add(gltf.scene)
})

/*
 * Fireflies
 */
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const firefliesPosition = new Float32Array(firefliesCount * 3)
const firefliesScale = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
  firefliesPosition[i * 3 + 0] = (Math.random() - 0.5) * 4
  firefliesPosition[i * 3 + 1] = Math.random() * 1.5
  firefliesPosition[i * 3 + 2] = (Math.random() - 0.5) * 4

  firefliesScale[i] = Math.random()
}

firefliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(firefliesPosition, 3),
)

firefliesGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(firefliesScale, 1),
)

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: {
      value: Math.min(window.devicePixelRatio, 2),
    },
    uSize: {
      value: 200,
    },
  },
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  vertexShader: FireFliesVertex,
  fragmentShader: FireFliesFragment,
  transparent: true,
})

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

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

const clock = new THREE.Clock()

function loop() {
  controls.update()
  renderer.render(scene, camera)

  const elapsedTime = clock.getElapsedTime()

  firefliesMaterial.uniforms.uTime.value = elapsedTime
  portalLightMaterial.uniforms.uTime.value = elapsedTime

  requestAnimationFrame(loop)
}

function initPane() {
  pane = new Pane({
    container: document.getElementById('tweakpane-container'),
  })
}

function setClearColor(color: number) {
  if (renderer) {
    renderer.setClearColor(color)
  }
}

onMounted(() => {
  if (!renderer) {
    initRenderer()
    loop()
    initPane()
    setClearColor(debugObject.clearColor)
  }
})

onUnmounted(() => {
  pane.dispose()
  renderer.dispose()
})
</script>

<template>
  <canvas ref="experience" class="w-full h-400px" />
</template>
