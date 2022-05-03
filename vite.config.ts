import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [svgLoader(), glsl()],
})
