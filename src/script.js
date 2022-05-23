import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const clock = new THREE.Clock()

// width & height
const size = {
    width: innerWidth,
    height: innerHeight
}

// Texture Loader
const textureLoader = new THREE.TextureLoader()

// Roof Txture
const roofTexture =  textureLoader.load('/roofT.jpeg')
roofTexture.repeat.set(1, 2)
roofTexture.wrapS = THREE.RepeatWrapping
roofTexture.wrapT = THREE.RepeatWrapping

// Door Textures
const alphaDoorTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const colorDoorTexture = textureLoader.load('/textures/door/color.jpg')
const heightDoorTexture = textureLoader.load('/textures/door/height.jpg')
const matalnessDoorTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalDoorTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessDoorTexture = textureLoader.load('/textures/door/roughness.jpg')

// Wall Textures
const ambientBricksTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const colorBricksTexture = textureLoader.load('/textures/bricks/color.jpg')
const normalBricksTexture = textureLoader.load('/textures/bricks/normal.jpg')
const roughnessBricksTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// Grass Textures
const ambientGrassTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const colorGrassTexture = textureLoader.load('/textures/grass/color.jpg')
const normalGrassTexture = textureLoader.load('/textures/grass/normal.jpg')
const roughnessGrassTexture = textureLoader.load('/textures/grass/roughness.jpg')

// let's fix the grass size
ambientGrassTexture.repeat.set(8, 8)
colorGrassTexture.repeat.set(8, 8)
normalGrassTexture.repeat.set(8, 8)
roughnessGrassTexture.repeat.set(8, 8)

ambientGrassTexture.wrapS = THREE.RepeatWrapping
colorGrassTexture.wrapS = THREE.RepeatWrapping
normalGrassTexture.wrapS = THREE.RepeatWrapping
roughnessGrassTexture.wrapS = THREE.RepeatWrapping

ambientGrassTexture.wrapT = THREE.RepeatWrapping
colorGrassTexture.wrapT = THREE.RepeatWrapping
normalGrassTexture.wrapT = THREE.RepeatWrapping
roughnessGrassTexture.wrapT = THREE.RepeatWrapping

// scene, camera, geomatery & rendrer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, size.width/size.height)
camera.position.z = 10
camera.position.y = 2
scene.add(camera)

// Add Light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.12)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight( '#FAEF1E', 0.12)
directionalLight.position.set(0.6, 0.4, 0)
scene.add(directionalLight)

// Fog
    const fog = new THREE.Fog('#262837', 3, 15)
    scene.fog = fog

// Floor
const floorGeomatry = new THREE.PlaneBufferGeometry(20, 20)
const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: colorGrassTexture,
    aoMap: ambientGrassTexture,
    normalMap: normalGrassTexture,
    roughnessMap: roughnessGrassTexture,
 })
const floor = new THREE.Mesh( floorGeomatry, floorMaterial)
floor.rotation.x = -Math.PI * 0.5
floor.position.y -=  0.01
floor.receiveShadow = true
scene.add(floor)

// House Group
const House = new THREE.Group()
scene.add(House)

// walls of House
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: colorBricksTexture,
        aoMap: ambientBricksTexture,
        normalMap: normalBricksTexture,
        roughnessMap: roughnessBricksTexture
    })
)
walls.position.y = 2.5 * 0.5
walls.castShadow = true         // For Shadow
House.add(walls)

// Roof of House
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: roofTexture,
    })
)
roof.position.y = 3.2
roof.rotation.y = Math.PI * 0.25
House.add(roof)

// Add Door to the wall
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 1.8),
    new THREE.MeshStandardMaterial({ 
        map: colorDoorTexture,
        transparent: true,
        aoMap: ambientDoorTexture,
        alphaMap: alphaDoorTexture,
        displacementMap: heightDoorTexture,
        displacementScale: 0.1,
        normalMap: normalDoorTexture,
        metalnessMap: matalnessDoorTexture,
        roughnessMap: roughnessDoorTexture
    })
)
door.position.z = 2 + 0.01
door.position.y = 1.6 * 0.5
House.add(door)

// Bushes
const bushesGeomatry = new THREE.SphereBufferGeometry(1, 32, 20)
const bushesMaterial = new THREE.MeshStandardMaterial({ color: '#00FFFD'})

const bushes1 = new THREE.Mesh( bushesGeomatry, bushesMaterial)
bushes1.scale.set(0.4, 0.4, 0.4)
bushes1.position.set(1, 0.4, 2.4)

const bushes2 = new THREE.Mesh( bushesGeomatry, bushesMaterial)
bushes2.scale.set(0.2, 0.2, 0.2)
bushes2.position.set(1.4, 0.2, 2.2)

const bushes3 = new THREE.Mesh( bushesGeomatry, bushesMaterial)
bushes3.scale.set(0.2, 0.2, 0.2)
bushes3.position.set(-1.4, 0.2, 2.2)
bushes1.castShadow = true
bushes2.castShadow = true
bushes3.castShadow = true
House.add(bushes1, bushes2, bushes3)

// Door Light
const doorLight = new THREE.PointLight('#F4FA1E', 1, 7)
doorLight.position.set(0, 2, 2+0.1)
doorLight.castShadow = true
House.add(doorLight)

// Graves 
const graves = new THREE.Group()
scene.add(graves)

const graveGeomatery = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterail = new THREE.MeshStandardMaterial({ color: '#6A6A6A' })

// Add Loop for graves
for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 5.5
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    // console.log("r:", radius, "x:", x , "  z:",z )

    const grave = new THREE.Mesh( graveGeomatery, graveMaterail)
    grave.position.set(x, 0.4, z)
    grave.castShadow = true
    graves.add(grave)

}

// Ghost Light
const pointlight = new THREE.PointLight('#027CF9', 2, 3)
const pointlight2 = new THREE.PointLight('#5EFF00', 2, 3)
const pointlight3 = new THREE.PointLight('#FF0051', 2, 3)
pointlight.castShadow = true
pointlight2.castShadow = true
pointlight3.castShadow = true
House.add(pointlight, pointlight2, pointlight3)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size.width, size.height)
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)


// add camera and scene to the controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Animate
const animate = () => {

    const time = clock.getElapsedTime()
    // console.log(clock.getElapsedTime());
    const ghost1Angle = time * 1
    // console.log(ghost1Angle)
    pointlight.position.x = Math.cos(ghost1Angle) * 4
    pointlight.position.y = Math.sin(ghost1Angle*4)
    pointlight.position.z = Math.sin(ghost1Angle) * 4
    // console.log( Math.cos(ghost1Angle) * 4 )

    const ghost1Angle2 = time * .8
    pointlight2.position.x = - Math.cos(ghost1Angle2) * 4
    pointlight2.position.y = Math.sin(ghost1Angle2*4) + Math.sin(ghost1Angle2*4)
    pointlight2.position.z = Math.sin(ghost1Angle2) * 4
    
    const ghost1Angle3 = time * .7
    pointlight3.position.x = Math.cos(ghost1Angle3) * 4
    pointlight3.position.y = Math.sin(ghost1Angle3*4) + Math.sin(ghost1Angle3*3)
    pointlight3.position.z = Math.sin(ghost1Angle3) * + Math.sin(ghost1Angle3*2)



    // console.log("Animate")
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)

}
animate()