<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
/* import { useTweakPane } from '../composables/useTweakPane'
 */ import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const experience = ref(null)
const debugObj = {
  wireframe: false,
}
let renderer
let camera
let controls
let pane
let scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

let geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshToonMaterial({
  color: 0xd5001c,
  wireframe: debugObj.wireframe,
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

function initPane() {
  pane = new Pane({
    container: document.getElementById('tweakpane-container'),
  })

  pane
    .addBlade({
      view: 'list',
      label: 'Geometries',
      options: [
        {
          text: 'Box',
          value: 'box',
        },
        {
          text: 'Sphere',
          value: 'sphere',
        },
        {
          text: 'Cone',
          value: 'cone',
        },
        {
          text: 'Torus Knot',
          value: 'torus-knot',
        },
      ],
      value: 'box',
    })
    .on('change', ({ value }) => {
      scene.remove(mesh)
      let newGeometry
      switch (value) {
        case 'box':
          newGeometry = new THREE.BoxGeometry(3, 3, 3, 32, 32, 32)
          break
        case 'sphere':
          newGeometry = new THREE.SphereGeometry(3, 32, 32)
          break
        case 'cone':
          newGeometry = new THREE.ConeGeometry(3, 3, 32)
          break
        case 'torus-knot':
          newGeometry = new THREE.TorusKnotGeometry(3, 1, 100, 32)
          break
        default:
          newGeometry = new THREE.BoxGeometry(3, 3, 3)
          break
      }
      mesh = new THREE.Mesh(newGeometry, material)
      scene.add(mesh)
    })

  pane.addInput(material, 'wireframe')
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
