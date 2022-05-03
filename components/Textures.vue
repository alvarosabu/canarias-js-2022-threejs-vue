<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const experience = ref(null)
const debugObj = {
  color: '#d5001c',
  wireframe: false,
  lights: true,
}
let renderer
let camera
let controls
let pane
let scene = new THREE.Scene()

const loadingManager = new THREE.LoadingManager()

const textureLoader = new THREE.TextureLoader(loadingManager)

const woolTextures = {
  color: textureLoader.load('/textures/wool/fabric_0008_color_2k.jpg'),
  roughness: textureLoader.load('/textures/wool/fabric_0008_roughness_2k.jpg'),
  normal: textureLoader.load('/textures/wool/fabric_0008_normal_opengl_2k.png'),
  ambientOcclusion: textureLoader.load('/textures/wool/fabric_0008_ao_2k.jpg'),
  height: textureLoader.load('/textures/wool/fabric_0008_height_2k.png'),
}

const salmonTextures = {
  color: textureLoader.load('/textures/salmon/food_0013_color_2k.jpg'),
  roughness: textureLoader.load('/textures/salmon/food_0013_roughness_2k.jpg'),
  normal: textureLoader.load('/textures/salmon/food_0013_normal_2k.jpg'),
  ambientOcclusion: textureLoader.load('/textures/salmon/food_0013_ao_2k.jpg'),
  height: textureLoader.load('/textures/salmon/food_0013_height_2k.jpg'),
}

const pebblesTextures = {
  color: textureLoader.load('/textures/pebbles/Pebbles_026_basecolor.jpg'),
  roughness: textureLoader.load('/textures/pebbles/Pebbles_026_roughness.jpg'),
  normal: textureLoader.load('/textures/pebbles/Pebbles_026_normal.jpg'),
  height: textureLoader.load('/textures/pebbles/Pebbles_026_height.png'),
  ambientOcclusion: textureLoader.load(
    '/textures/pebbles/Pebbles_026_ambientOcclusion.jpg',
  ),
}

const material = new THREE.MeshStandardMaterial({
  map: woolTextures.color,
  roughnessMap: woolTextures.roughness,
  normalMap: woolTextures.normal,
  displacementMap: woolTextures.height,
  aoMap: woolTextures.ambientOcclusion,
})

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

let geometry = new THREE.SphereGeometry(3, 1024, 1024)

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
          text: 'Wool',
          value: 'wool',
        },
        {
          text: 'Salmon',
          value: 'salmon',
        },
        {
          text: 'Pebbles',
          value: 'pebbles',
        },
      ],
      value: 'wool',
    })
    .on('change', ({ value }) => {
      scene.remove(mesh)
      let newMaterial
      switch (value) {
        case 'wool':
          newMaterial = new THREE.MeshStandardMaterial({
            map: woolTextures.color,
            roughnessMap: woolTextures.roughness,
            normalMap: woolTextures.normal,
            displacementMap: woolTextures.height,
          })
          break
        case 'salmon':
          newMaterial = new THREE.MeshStandardMaterial({
            map: salmonTextures.color,
            roughnessMap: salmonTextures.roughness,
            normalMap: salmonTextures.normal,
            /* displacementMap: salmonTextures.height, */
          })
          break
        case 'pebbles':
          newMaterial = new THREE.MeshStandardMaterial({
            map: pebblesTextures.color,
            roughnessMap: pebblesTextures.roughness,
            normalMap: pebblesTextures.normal,
            displacementMap: pebblesTextures.height,
          })
          break
      }
      mesh = new THREE.Mesh(geometry, newMaterial)
      scene.add(mesh)
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
