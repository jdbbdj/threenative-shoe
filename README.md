https://staging.notjust.dev/blog/2023-02-17-3d-animations-in-react-native-with-threejs-nike-app
## About
> This notes is all about incorporating three js inside react-native

## Cheat codes
- npx create-expo-app . - creates the expo bundler inside the desired file directory
- npm start - starts the app
- a - runs the metro bundler in android
- npx expo install three @react-three/fiber expo-gl expo-three - install dependencies for expo for three js
	>React three fiber lets you write threejs in a react component types code style
	> in case you did encounter an error just add npx expo install three @react-three/fiber expo-gl expo-three -- --legacy-peer-deps

![[Pasted image 20230218212551.png]]

### Three.js fundamentals

#### Canvas

The canvas is the component where our scene will be rendered in. Start by rendering Canvas as the root component of our app.

`import { Canvas } from '@react-three/fiber';`
`export default function App() {
 `return <Canvas/>`
`}`

#### Render an object

To render something on the screen, we need to know its shape (or geometry), for example the shape of a ball is a sphere.

Besides the shape, we also need to know what material it is made off: for example a basketball ball is made of rubber and it’s color is orange.

The Geometry and the Material are the components of a Mesh.
Let’s render a basketball
`<mesh>`

  `<sphereGeometry />`

  `<meshStandardMaterial color="orange" />`

`</mesh>`


Play with the position of the mesh on the screen, and with different geometries to see how it works.

Check out different geometries on [threejs docs](https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry).

The problem is that we don’t really see the color orange that we wanted our ball to be.

Why?

Because we forget to turn on the lights.

#### Lighting

Let’s add an ambientLight source that is similar to the daylight in a room. This type of light will light all the sides of the object in the same way and will not produce shadows

`<ambientLight />`

A `<pointLight>` on the other hands, is similar to a light bulb that will light more the part of the object that faces the light source. Bcause of that, a pointLight also needs a position in space.
`<pointLight position={[10, 10, 10]} />`


### Reusable Components

The benefit of React Three Fiber is that we can build our scenes from reusable 3d react components.

Let’s create a resuable Box component

`const Box = (props) => {`
`  return (`
    `<mesh {...props}>`
     ` <boxGeometry args={[1, 1, 1]} />`
      `<meshStandardMaterial color={"orange"} />`
    `</mesh>`
`  );`
`};`
`export default Box;`


Now, we can render multiple boxes by simply rendering the <Box /> component

`<Box position={[0, -1.2, 0]} />`
`<Box position={[0, 1.2, 0]} />`

We can then use state variables to manage the state of each Box

`const [active, setActive] = useState(false);`
`<mesh`
`  {...props}`
`  onClick={(event) => setActive(!active)}`
`  scale={active ? 1.5 : 1}`
`>`

#### Animating the object

We can use the hook useFramewhich allows us to execute code on every rendered frame.

We will use it to rotate the boxes

The useFrame hook is **a React Three Fiber hook, and is useful if you want to execute code before every rendered frame**. In this example we will transform the mesh's rotation.

`const meshRef = useRef();`

`useFrame((state, delta) => (meshRef.current.rotation.y += delta));`

`<mesh`
`  ref={meshRef}`
`	...`


and always do remember `import { useFrame } from "@react-three/fiber";`


### Rendering 3d models
Now that we coverd the fundamentals, let’s start working on the real use case of displaying a 3d model of a shoes.

Let’s first drag-and-drop the Airmax folder from the asset bundle into the assets directory of our project.

We have to configure metro bundler to include these files as assets. For that update (or create) the file metro.config.js

`// metro.config.js`

`module.exports = {`
`  resolver: {`
    `sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],`
    `assetExts: ['glb', 'gltf', 'mtl', 'obj', 'png', 'jpg'],`
`  },`
`}`

Now we have to restart our server and clean the cache.

`npm start -- --clear`

### OR ELSE

![[Pasted image 20230220094922.png]]

#### Create the Shoe component
`const Shoe = (props) => {`
  `return (`
    `<mesh{...props}/>`
 `   </mesh>`
`  );`
`};`
`export default Shoe;`

#### Load the object

`import { Canvas, useFrame, useLoader } from '@react-three/fiber';`
`import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';`
...

>Note always call the obj inside the function
`const obj = useLoader(OBJLoader,require('./assets/Airmax/shoe.obj'));`


At this point, we should get an error saying "A component suspended … ". To fix this, we need to wrap our <Shoe /> component inside a <Suspense /> to render a fallback component while the shoe componen is loading the necessery assets.

>Note use the Suspense on the App.js or it will throw an error

At this point we should see the shape of the shoe. That’s perfect.

#### Let’s load the Materials

Let’s load the textures and the materials of our shoe.
`import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';`
`const material = useLoader(MTLLoader, require('./assets/Airmax/shoe.mtl'));`


`const obj = useLoader(`
`  OBJLoader,`
`  require('./assets/Airmax/shoe.obj'),`
`  (loader) => {`
`    material.preload();`
`    loader.setMaterials(material);`
`  }`
`);`

![[Pasted image 20230220105245.png]]

we can say that we need to load the material first before the object

#### Let’s load the Textures

`import { TextureLoader } from 'expo-three';`

`const [base, normal, rough] = useLoader(TextureLoader, [`

`  require('./assets/Airmax/textures/BaseColor.jpg'),`

`  require('./assets/Airmax/textures/Normal.jpg'),`

`  require('./assets/Airmax/textures/Roughness.png'),`

`]);`

`useLayoutEffect(() => {`

`  obj.traverse((child) => {`

    if (child instanceof THREE.Mesh) {

      child.material.map = base;

      child.material.normalMap = normal;

      child.material.roughnessMap = rough;

    }

`  });`

`}, [obj]);`

-   map is our color map. This defines what color does our object have
-   normalMap specifies the textures of our material. This changes the way each part of the shoes color is lit.
-   roughnessMap specifies how rought the material appears from mirror like material that reflects lights, to a diffues material that does not reflect light.


## Let’s animate the shoe
In this part of the of tutorial, we will hook the 3d model up to the gyroscop sensor and will drive some animations based on this. This will give it a sense that by moving your phone in your hand, you can move the shoe on the screen.

### Install Reanimated[](https://staging.notjust.dev/blog/2023-02-17-3d-animations-in-react-native-with-threejs-nike-app#install-reanimated)

Let’s [install Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/) library that will power our sensor based animation.
`npx expo install react-native-reanimated`

Add the babel plugin inside babel.config.js and then restart the server

`plugins: ['react-native-reanimated/plugin'],`

Now, let’s use the Animated Sensor and send it’s date to our 3d Model
`import { useAnimatedSensor, SensorType } from 'react-native-reanimated';`

`const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {`
`  interval: 100,`
`});`
...
`<Shoe animatedSensor={animatedSensor} />`

And in the useFrame of our Shoe, wqe can use the data from the sensor to animate to rotation of the shoe

`useFrame((state, delta) => {`
`  let { x, y, z } = props.animatedSensor.sensor.value;`
`  x = ~~(x * 100) / 5000;`
`  y = ~~(y * 100) / 5000;`
`  mesh.current.rotation.x += x;`
`  mesh.current.rotation.y += y;`
`});`

