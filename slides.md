---
theme: penguin
colorSchema: light
layout: intro
themeConfig:
  logoHeader: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1651503116/as-portfolio/logo_nomvmi.svg'
  eventLogo: '/logo.png'
  eventUrl: 'https://jsdaycanarias.com/'
  twitter: '@alvarosabu'
  twitterUrl: 'https://twitter.com/alvarosabu'
---

# Añade 3D a tu aplicación Vue

---
layout: presenter
presenterImage: 'https://res.cloudinary.com/alvarosaburido/image/upload/v1622370075/as-portfolio/alvaro_saburido.jpg'
---

# Alvaro Saburido Rodriguez

Senior Front-end Engineer at <fancy-link  href="https://bcn.porsche.digital/en/" favicon="https://www.google.com/s2/favicons?domain=porsche.com" >Porsche Digital</fancy-link>

- Tech lead & Open source coordinator
- Embajador de <fancy-link href="https://www.storyblok.com/">Storyblok</fancy-link>
- Escribo en <fancy-link href="https://dev.to/alvarosaburido">@alvarosaburido</fancy-link> & <fancy-link href="https://vuedose.tips/authors/alvaro-saburido-rodriguez/">VueDose</fancy-link>
- Portfolio <fancy-link href="https://alvarosaburido.dev">alvarosaburido.dev</fancy-link>
- Salúdame <fancy-link href="https://twitter.com/alvarosabu">@alvarosabu</fancy-link>

<span class="text-xs font-italic">Disclaimer: Mis opiniones son personales, no representan a Porsche Digital o de ninguno de mis asociados.</span>

---
layout: text-image
media: https://www.jasonrayner.com/images/gifs/roomba.gif
caption: '"Roomba" by Jason Rayner https://www.jasonrayner.com'
---

# Motivación

He desarrollado webs y aplicaciones móviles durante mas de 8 años. Siempre tuve fascinación por los videojuegos y el diseño 3D, la animación de personajes tridimensionales que dan vida a personajes y escenas.

Siempre pense que el 3D estaba fuera de mi alcance intelectual, pero con el tiempo me he dado cuenta de que es posible aprender y hacer cosas extraordinarias.


---
layout: text-window
preload: false
---
# ¿Por qué una charla acerca de 3D en Vue?

Esta presentación es una introducción a la **tecnología 3D con WebGL**, y cómo usarla en Vue.js.

Me gustaría que esta charla fuera un pequeño empujón para que todos los que estén interesados en la tecnología 3D puedan usarla en su framework favorito, de que es posible aprender aunque siempre lo hayas visto fuera de tu alcance. 

::window::
<GalaxyGenerator class="w-full h-350px" />

---
preload: false
---
# ¿Qué es 3D?

---

# Conceptos básicos de 3D en Web

<BasicsDraw />

---
layout: text-image
media: /vertices.png
---

# Conceptos básicos de 3D en Web

- **Vértice**: un solo punto. 
- **Borde**: Una línea recta que conecta dos vértices. Los bordes ayudan a definir la forma de un modelo 3D.
- **Polígono**: cualquier forma que se forma al conectar líneas rectas. 
- **Cara**: la parte más básica de una malla poligonal. Ayuda a llenar el espacio entre los bordes.

---
layout: text-window
preload: true
---

# WebGL

[WebGL](https://github.com/KhronosGroup/WebGL) es una API de Javascript que permite renderizar triangulos en un `<canvas />` con una velocidad notable. Compatible con la mayoría de los navegadores modernos, usa la GPU (Graphics Processing Unit).

**La GPU puede realizar miles de operaciones en paralelo**. Imagine que quieres renderizar un modelo, y este esta constituido por **1000 triángulos**, lo cual serian **3000 puntos**. La GPU tendría que calcular todos los puntos, y luego renderizarlos.

Es por eso que programar WebGL nativo es tan difícil. **Un simple triangulo serian al menos 100 lineas de código**. Imagina añadir luces, sombras etc.

::window::

---
layout: text-window
---

# ThreeJS al rescate

[ThreeJS](https://threejs.org/) es una librería de Javascript que trabaja encima del WebGL. Su objetivo es **simplificar drasticamente el proceso de desarrollo**.

Fue creada por Ricardo Cabello, aka [Mr.doob](https://mrdoob.com/). Hoy en día es mantenida por una inmensa communidad de [desarrolladores](https://github.com/mrdoob/three.js/graphs/contributors).

::window::
<iframe src="https://threejs.org/" class="w-full h-400px"  />
---
layout: text-window
preload: false
---

# Escena 3D básica

```js
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
});

renderer.setSize(
  window.innerWidth, 
  window.innerHeight 
);
renderer.render( scene, camera );
```

::window::
<BasicScene class="w-full h-350px" />

---
layout: text-window
preload: false
---

# Añadiendo un objeto

Para añadir un objeto a la escena, debemos crear una instancia de la clase `THREE.Mesh`. Esta clase acepta una geometría y un material.

```js
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ 
  color: 0xd5001c
})

const cube = new THREE.Mesh(geometry, material)
cube.rotation.set(2, 2, 0)

scene.add(cube)
```

::window::
<BasicCube class="w-full h-350px" />

---

# Loop de renderizado

![](/render-loop.png)

---
layout: text-window
---
# Loop de renderizado

Similar al loop de los videojuegos, hemos de llamar la funcion `renderer.render` cada vez que queramos que se renderice la escena. Para lograr una transición suave hemos de hacerlo a `60 FPS` (frames por segundo o 60 veces por segundo).

El ojo humano es capaz de ver entre **30 y 60 veces por segundo**.

::window:: 
![](/frames-per-second-diagram.png)

---
layout: text-window
preload: false
---

# Loop de renderizado

Para añadir un objeto a la escena, debemos crear una instancia de la clase `THREE.Mesh`. Esta clase acepta una geometría y un material.

```js
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
});

...

function loop() {
  renderer.render(scene, camera)
  cube.rotation.z += 0.01
  requestAnimationFrame(loop)
}

loop()
```

::window::
<LoopCube class="w-full h-350px" />

---
layout: text-window
preload: false
---

# Transformando objetos

La mayoría de objetos en nuestra escena comparten las mismas 4 propiedes con las cuales podemos modficarlos.

- `position`: mover el objeto.
- `scale`: aumentar o reducir el tamaño del objeto.
- `rotation`: rotar el objeto.
- `quaternion`: también para rotar un objeto.

```js
const cube = new THREE.Mesh(geometry, material)
cube.position.x = 2
cube.position.set(0, 2, 0)

cube.scale.x = 3
cube.rotation.set(2, 2, 0)
```

::window::
<TransformObjects class="w-full h-350px" />


---
layout: text-window
preload: false
---

# Axes Helper

El objeto de ayuda `THREE.AxesHelper` permite visualizar las **ejes** de la escena.

El eje X es <span class="text-red-500 font-bold">rojo</span>. El eje Y es <span class="text-green-500 font-bold">verde</span>. El eje Z es <span class="text-blue-500 font-bold">azul</span>.


```js
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
```

::window::
<TransformObjects class="w-full h-350px" />
---
layout: text-window
preload: false
---

# Orbit Controls

Los controles de "Órbita" permiten que el usuario pueda mover la cámara con el ratón orbitando al rededor de un objetivo.


```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function loop() {
  ...
  controls.update()
  ...
  requestAnimationFrame(loop)
}
```

::window::
<TransformObjects class="w-full h-350px" />


---
layout: text-window
preload: false
---

# Usar ThreeJS en Vue

Entonces, ¿cómo usar ThreeJS en Vue? 

¿Bastaría con añadir el mismo codigo dentro del script de un componente y usar un element canvas en el template?.

::window::
```js
<script setup>
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
});

...

function loop() {
  renderer.render(scene, camera)
  cube.rotation.z += 0.01
  requestAnimationFrame(loop)
}

loop()
</script>
<template>
  <canvas ref="experience" />
</template>
```


---
layout:awiwi
---
# Usar ThreeJS en Vue

Well no...

![](https://media.giphy.com/media/qjr1ZNLWEVvg9aFCyL/giphy.gif)

---
layout: text-window
preload: false
---

# Usar ThreeJS en Vue

Al momento de la ejecución de nuestro componente, el elemento canvas no ha sido renderizado todavía en el DOM, por lo que retorna `null`

<p class="bg-red-200 text-red-600 p-4 text-sm rounded">⚠️ Cannot read properies of null (canvas).</p>

::window::
![](/canvas-error.png)

---
layout: text-window
preload: false
---

# Usar ThreeJS en Vue

La solución es iniciar el renderizado después de que el componente is `mounted` y usar [template refs](https://vuejs.org/guide/essentials/template-refs.html) para acceder al elemento canvas.

De esta manera nos aseguramos de que el elemento canvas ha sido renderizado en el DOM.

::window::
```ts
<script setup>
import { ref, onMounted } from 'vue';

let renderer;
const experience = ref(null)

const renderer = new THREE.WebGLRenderer({
  canvas: experience.value,
});

onMounted(() => {
  initRenderer()
})
</script>

<template>
  <canvas ref="experience" />
</template>
```
---
preload: false
---
# Usar ThreeJS en Vue

<VueScene class="w-full h-350px"/>

---
layout: text-window
preload: false
---
# Geometrías 

En ThreeJS, las geometrías estan compuesta por **vértices** (coordenadas en el espacio 3D) y **caras** (triangulos que unen estos vertices para crear superficies)

Geometrías junto con los materiales, son los elementos que definen una superficie (Mesh).

```js
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
```

::window::
<WireframeCube class="w-full h-250px"/>

---
layout: text-window
preload: false
---
# Geometrías 
Geometrias disponibles en **ThreeJS**:
- BoxGeometry
- PlaneGeometry
- SphereGeometry
- ConeGeometry
- DodecahedronGeometry
- TorusGeometry
...
  

::window::
<Geometries class="w-full h-250px"/>

---
layout: text-window
preload: false
---

# Materiales

En ThreeJS, los **Materiales** son usados para definir el color que recibirá cada pixel visible de la superficie.

Los algoritmos que calculan el color de cada pixel son llamados **shaders**.


```js
const geometry = new THREE.TorusGeometry(2, 32, 32)
const material = new THREE.MeshBasicMaterial({
  color: 0xd5001c
})

const torus = new THREE.Mesh(geometry, material)

scene.add(torus)
```

::window::
<MaterialsExample class="w-full h-250px"/>


---
layout: text-window
preload: false
---
# Materiales 
Algunos materiales disponibles en **ThreeJS**:
- MeshBasicMaterial
- MeshStandardMaterial
- MeshLambertMaterial
- MeshPhongMaterial
- MeshToonMaterial
  

::window::
<Materials class="w-full h-250px"/>

---
layout: text-window
preload: false
---

# Un poco de luz 

Añadir luces es tan simple como añadir objetos a una escena.

```js
const ambientLight = 
  new THREE.AmbientLight(0xffffff, 0.5)

const directionalLight = 
  new THREE.DirectionalLight(0xffffff, 0.5)

scene.add(ambientLight, directionalLight)

// Helper
const lightHelper = 
  new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(lightHelper)
```

::window::
<LightsNoShadow class="w-full h-250px"/>

<!--
Preguntar audiencia: Quién me puede decir que hay de malo con esta escena? -- Respuesta: No hay sombras
-->

---
layout: text-window
preload: false
---

# ¿Y las sombras?

La parte trasera de nuestro objeto se ve más oscura, esta es llamada **core shadow**. Pero nos falta la **drop shadow**, en la cual los objetos creados proyectan sombra sobre otras superficies

El sombreado es uno de los retos para el renderizado 3D en tiempo real, porque consumen muchos recursos.

```ts
renderer.shadowMap.enabled = true

light.castShadow = true
mesh.castShadow = true

// ...
plane.receiveShadow = true
```

::window::
<LightsWithShadow class="w-full h-250px"/>


---
layout: text-window
preload: false
---
# Tipos de luces 
Algunas de las luces disponibles en **ThreeJS**:
- AmbientLight
- DirectionalLight
- RectAreaLight
- SpotLight
  

::window::
<Lights class="w-full h-250px"/>

---
layout: text-window
preload: false
---

# Texturizado

Las texturas son imágenes que cubrirán la superficie de tus geometrías. Muchos tipos de texturas pueden tener diferentes efectos en la apariencia de su geometría. No se trata sólo del color.

```js
const textureLoader = new THREE.TextureLoader(loadingManager)

const woolTextures = {
  color: textureLoader.load('/textures/wool/fabric_0008_color_2k.jpg'),
  roughness: textureLoader.load('/textures/wool/fabric_0008_roughness_2k.jpg'),
  normal: textureLoader.load('/textures/wool/fabric_0008_normal_opengl_2k.png'),
  ambientOcclusion: textureLoader.load('/textures/wool/fabric_0008_ao_2k.jpg'),
  height: textureLoader.load('/textures/wool/fabric_0008_height_2k.png'),
}

const material = new THREE.MeshStandardMaterial({
  map: woolTextures.color,
  roughnessMap: woolTextures.roughness,
  normalMap: woolTextures.normal,
  displacementMap: woolTextures.height,
  aoMap: woolTextures.ambientOcclusion,
})
```

::window::
<Textures class="w-full h-250px"/>

---
layout: text-window
preload: false
---

# Texturizado

- **Color (o albedo)** La textura albedo es la más sencilla. Solo tomará los píxeles de la textura y los aplicará a la geometría.
- **Altura** La textura de altura es una imagen en escala de grises que moverá los vértices para crear algún relieve. Deberá agregar una subdivisión si desea verla.
- **Normal** La textura normal agregará pequeños detalles. No moverá los vértices, pero atraerá a la luz para que piense que la cara está orientada de manera diferente. Perfecto para detalles.

::window::
![](/TextureTypes1.png)
---
layout: text-window
preload: false
---

# Texturizado

- **Oclusión ambiental** La textura de oclusión ambiental es una imagen en escala de grises que creará sombras falsas en las grietas de la superficie. Si bien no es físicamente preciso, ciertamente ayuda a crear contraste.
- **Metalicidad** es una imagen en escala de grises que especificará qué parte es metálica (blanca) y no metálica (negra). Esta información ayudará a crear la reflexión.
- **Rugosidad** es una imagen en escala de grises que viene con la metalicidad, y que especificará qué parte es rugosa (blanca) y qué parte es suave (negra). Esta información ayudará a disipar la luz.

::window::
![](/TextureTypes2.png)

---
layout: text-window
preload: false
---

# Modelos 3D

Three.js le permite crear muchas geometrías primitivas, pero cuando se trata de formas más complejas, es mejor usar un software 3D dedicado como **Blender** o **Maya**.

Alguno de los formatos mas conocidos son:

- OBJ
- FBX
- STL
- PLY
- COLLADA
- 3DS
- GLTF


::window::
<AkuAku class="w-full h-250px"/>

---
layout: text-window
preload: false
---

# Fórmato .gltf


GLTF significa *GL Transmission Format*. Está hecho por Khronos Group (los chicos detrás de OpenGL, WebGL, Collada y con miembros de AMD/ATI, Nvidia, Apple, ) Se ha vuelto muy popular en los últimos años. Sobretodo como estándar para softwares 3D y game engines.

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Model
const gltfLoader = new GLTFLoader()

gltfLoader.load(
  '/models/AkuAku/scene.gltf', 
gltf => {
  scene.add(gltf.scene)
})

...

renderer.outputEncoding = THREE.sRGBEncoding
```

::window::
<AkuAku class="w-full h-250px"/>

---
layout: text-window
preload: false
---
# Estructura de proyecto

Código 🍝 en un solo archivo esta bien al principio para probar cosas rápidamente. Pero a medida que tu proyecto 3D crece, es mejor dividirlo en más archivos.

ThreeJS esta compuesto de **Clases** internamente, por lo que es común ver proyectos donde se usan clases para extender las funcionalidades de ThreeJS.


::window::
![](/file-structure.png)
---
layout: text-window
preload: false
---

# Composition API

¿Podemos usar [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) para reutilizar código de ThreeJS?

La respuesta es sí, parcialmente.

Mientras podemos sacar provecho de los [Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html), e.g. `onMounted()` and `onUnmounted()` y de la [Inyección de dependencias](https://vuejs.org/api/composition-api-dependency-injection.html) `provide()` and `inject()` no es recomendable usar la **Api de Reactividad** 😱

<p class="bg-red-200 text-red-600 p-4 text-sm rounded">⚠️ No usar reactividad ref() o reactive() para actualizar Escenas, cámaras u objetos 3D en general</p>

::window::
![](/options-vs-composition-api.webp)
---
layout: text-window
preload: false
---

# Proxys vs Objetos

La reactividad de Vue 3 esta basada en [Proxies de JS](https://vuejs.org/guide/extras/reactivity-in-depth.html)

Imaginemos que nuestro `renderer` fuese reactivo:

```js
const renderer = ref()

renderer.value = new THREE.WebGLRenderer({
    canvas: experience.value,
})
```

Por cada frame, en nuestro `loop` estaríamos actualizando dicha referencia de la siguiente manera `renderer.value.render(scene, camera)`

Esto haría que el **FPS** cayera por los suelos y que la performance de nuestra experiencia se vea afectada 😢.


::window::
<iframe src="https://measurethat.net/Embed?id=285725" width="100%" height="500px"></iframe>

---
class: 'grid text-center align-self-center justify-self-center'
---
# ¿Tiene sentido usar Vue con ThreeJS? 🤔

---
layout: two-cols
---

# 👍
Si ThreeJS **solo es una parte de tu app o tu website**, su magia puede ser encapsulada en un componente para ser re-usada.

::right::
# 👎
 Si tu idea es hacer una app **solamente de 3D**, sin interfaz de usuario, mi recomendación es hacerlo en VanillaJS o Typescript, tendrá mejor `performance` y no tendras que depender de los ciclos de montaje.


---
class: grid text-center align-self-center justify-self-center
---

# ¿Hay alguna manera mas sencilla de usar ThreeJS en Vue? 🤔


---
layout: text-window
---

# TroisJS

[TroisJS](https://troisjs.github.io/guide/) es un wrapper de Vue para ThreeJS potenciado con [ViteJS](https://vitejs.dev/)

Permite crear tus escenas 3D usando `components`:

```js
<template>
  <Renderer ref="renderer" orbit-ctrl alpha resize shadow>
      <Camera :position="{ x: 15, y: 15, z: 15 }" />
      <Scene background="#222">
        <AmbientLight color="#fff" />
      </Scene>
  </Renderer>
</template>
```

::window::
<TroisExample class="w-full h-300px" />

---
layout: text-window

---

# Si quieres empezar 

Tengo un repo *template* en github aquí [alvarosabu/modern-three](https://github.com/alvarosabu/modern-three)

## Features

- Powered with [Vite](https://vite.dev/) 📦
- GUI controls using [Tweakpane](https://cocopon.github.io/tweakpane/) 🎛
- Typescript 🦾
- No classes, just functions 🎯
- Shader support (glsl) with[vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) 🎨


::window::
<iframe class="w-full h-300px" src="https://www.youtube.com/embed/TiWRM3J5FlI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---
layout: default
---

# ¿Qué viene después?

- [Shaders](https://threejs.org/docs/index.html?q=shader#api/en/materials/ShaderMaterial)
- [Postprocesado](https://threejs.org/docs/index.html?q=post#manual/en/introduction/How-to-use-post-processing)
- [InstancedMesh](https://threejs.org/docs/index.html?q=InstancedMesh#api/en/objects/InstancedMesh)
- [Física](https://schteppe.github.io/cannon.js/)
- Animaciones.

## Recursos
- [ThreeJS Journey](https://threejs-journey.com/)
---
class: 'grid text-center align-self-center justify-self-center'
---
# Gracias totales 🙏
