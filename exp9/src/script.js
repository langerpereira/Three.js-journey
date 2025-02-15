import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

console.log(RGBELoader)

let gui = new GUI()

/**
 * Base 
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//texture 
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

// const environmentMapTexture = cubeTextureLoader.load([
//     '/textures/environmentMaps/0/px.jpg',
//     '/textures/environmentMaps/0/nx.jpg',
//     '/textures/environmentMaps/0/py.jpg',
//     '/textures/environmentMaps/0/ny.jpg',
//     '/textures/environmentMaps/0/pz.jpg',
//     '/textures/environmentMaps/0/nz.jpg'
// ])   //old nethod


doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace


//ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const light = new THREE.PointLight(0xffffff, 0.5)
// light.position.x = 2
// light.position.y = 3
// light.position.z = 4
// scene.add(light)

//environment
const rgbeloader = new RGBELoader()
rgbeloader.load('./textures/environmentMaps/2k.hdr', (environmentMaps) =>{
    environmentMaps.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMaps
    scene.environment = environmentMaps

})

//objects
// const material = new THREE.MeshBasicMaterial({map : doorColorTexture})
// material.wireframe  = true

//MeshNoraml material
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture


// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture 

// const material = new THREE.MeshStandardMaterial({map : doorColorTexture})
// material.metalness = 0; // Optional for better lighting effect
// material.roughness = 1;
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 2
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

//meshphysical mat
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0; // Optional for better lighting effect
material.roughness = 0;
// material.map = doorColorTexture  
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture


gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

//clearCoat
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

material.transmission = 1
material.ior = 1,5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(0).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

// sphere.geometry.setAttribute(
//     'uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// )

sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100, 100),
    material
)

// console.log(plane.geometry.attributes.uv)
// plane.geometry.setAttribute(
//     'uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// )


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

// torus.geometry.setAttribute(
//     'uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
// )

torus.position.x = 1.5

scene.add(sphere, plane, torus);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update objects
    sphere.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = -0.15 * elapsedTime
    torus.rotation.x = -0.15 * elapsedTime
    plane.rotation.x = -0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()