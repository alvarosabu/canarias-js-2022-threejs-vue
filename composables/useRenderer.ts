import { ref, watch, computed } from 'vue'
import {
  ACESFilmicToneMapping,
  Camera,
  PCFShadowMap,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  WebGLRendererParameters,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { useWindowSize } from '@vueuse/core'

const experience = ref(null)
let renderer: WebGLRenderer
let controls: OrbitControls

export const useRenderer = () => {
  const { width, height } = useWindowSize()
  const aspectRatio = computed(() => width.value / height.value)

  watch(aspectRatio, updateRenderer)

  function initRenderer(
    camera: Camera,
    options: Partial<WebGLRendererParameters>,
    shadows: boolean = false,
  ): { renderer: WebGLRenderer; controls: OrbitControls } {
    if (experience.value) {
      renderer = new WebGLRenderer({
        canvas: experience.value,
        ...options,
      })
      // More realistic shadows
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = PCFShadowMap
      renderer.physicallyCorrectLights = true
      renderer.outputEncoding = sRGBEncoding
      renderer.toneMapping = ACESFilmicToneMapping
      renderer.toneMappingExposure = 1

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true

      return {
        renderer,
        controls,
      }
    }
  }

  function updateRenderer() {
    if (renderer) {
      renderer.setSize(width.value, height.value)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }

  function setClearColor(color: number) {
    if (renderer) {
      renderer.setClearColor(color)
    }
  }

  function renderScene(scene: Scene, camera: THREE.Camera) {
    if (renderer) {
      renderer.render(scene, camera)
    }
  }

  function updateControls() {
    if (controls) {
      controls.update()
    }
  }

  function disposeRenderer() {
    if (renderer) {
      renderer.dispose()
    }
  }

  return {
    experience,
    aspectRatio,
    updateRenderer,
    initRenderer,
    renderer,
    renderScene,
    controls,
    updateControls,
    disposeRenderer,
    setClearColor,
  }
}
