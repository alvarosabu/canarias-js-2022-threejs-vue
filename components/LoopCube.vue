<script setup>
import * as THREE from 'three'
import { onMounted, ref, watch } from 'vue'
/* import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
 */
const experience = ref(null)

let renderer
let camera
/* let controls */
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00bf7e })
const cube = new THREE.Mesh(geometry, material)
cube.rotation.set(2, 2, 0)

scene.add(cube)

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

  camera.position.set(0, 0, 5)

  /*   controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true */
  renderer.setSize(experience.value.clientWidth, experience.value.clientHeight)
  renderer.render(scene, camera)
}

function loop() {
  /*   controls.update() */
  renderer.render(scene, camera)
  cube.rotation.x += 0.01
  cube.rotation.z += 0.01
  requestAnimationFrame(loop)
}

onMounted(() => {
  initRenderer()
  loop()
})
</script>
<template>
  <canvas ref="experience" />
</template>
