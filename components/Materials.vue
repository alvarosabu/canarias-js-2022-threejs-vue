<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const experience = ref(null)
const debugObj = {
  color: '#00bf7e',
  wireframe: false,
  lights: true,
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

let geometry = new THREE.TorusKnotGeometry(3, 1, 32, 100)
let material = new THREE.MeshBasicMaterial({
  color: debugObj.color,
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
      label: 'Materials',
      options: [
        {
          text: 'Basic',
          value: 'basic',
        },
        {
          text: 'Normal',
          value: 'normal',
        },
        {
          text: 'Standard',
          value: 'standard',
        },
        {
          text: 'Lambert',
          value: 'lambert',
        },
        {
          text: 'Phong',
          value: 'phong',
        },
        {
          text: 'Toon',
          value: 'toon',
        },
      ],
      value: 'basic',
    })
    .on('change', ({ value }) => {
      scene.remove(mesh)
      let newMaterial
      switch (value) {
        case 'basic':
          newMaterial = new THREE.MeshBasicMaterial({
            color: debugObj.color,
            wireframe: debugObj.wireframe,
          })
          break
        case 'normal':
          newMaterial = new THREE.MeshNormalMaterial({
            wireframe: debugObj.wireframe,
          })
          break
        case 'standard':
          newMaterial = new THREE.MeshStandardMaterial({
            color: debugObj.color,
            wireframe: debugObj.wireframe,
          })
          break
        case 'lambert':
          newMaterial = new THREE.MeshLambertMaterial({
            color: debugObj.color,
            wireframe: debugObj.wireframe,
          })
          break
        case 'phong':
          newMaterial = new THREE.MeshPhongMaterial({
            color: debugObj.color,
            wireframe: debugObj.wireframe,
          })
          break
        case 'toon':
          newMaterial = new THREE.MeshToonMaterial({
            color: debugObj.color,
            wireframe: debugObj.wireframe,
          })
          break
      }
      mesh = new THREE.Mesh(geometry, newMaterial)
      scene.add(mesh)
    })

  pane.addInput(material, 'wireframe')
  pane.addInput(debugObj, 'color').on('change', ({ value }) => {
    material.color = new THREE.Color(value)
  })
  pane.addInput(debugObj, 'lights').on('change', ({ value }) => {
    ambientLight.visible = value
    directionalLight.visible = value
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
