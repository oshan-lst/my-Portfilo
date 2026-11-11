
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById("heroThreeCanvas");
const photoSlide = document.getElementById("photoSlide");
const modelSlide = document.getElementById("modelSlide");
const visualLabel = document.getElementById("visualLabel");

if (container && photoSlide && modelSlide) {
    initHero3D();
}

function initHero3D() {

    const CONFIG = {
        modelPath: "assets/model/oshan-model.glb",
        switchInterval: 10000,
        waveSpeed: 7,
        waveAmount: 0.35,
        armRaise: -1.15,
        elbowBend: -0.9,
        modelScale: 1,
        rotationSpeed: 0.12
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        35,
        1,
        0.01,
        100
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        2.0
    );

    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        3.0
    );

    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
        0x8b7cff,
        2.5
    );

    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(
        0xb4aaff,
        3.0
    );

    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    let model = null;
    let rightArm = null;
    let rightForeArm = null;
    let rightHand = null;
    let spine = null;

    let isModelVisible = false;
    let modelReady = false;

    const originalRotations = new Map();

    const clock = new THREE.Clock();

    const loader = new GLTFLoader();

    loader.load(
        CONFIG.modelPath,

        (gltf) => {

            model = gltf.scene;

            model.traverse((object) => {

                if (object.isMesh) {
                    object.frustumCulled = false;
                }

                if (object.isBone) {
                    originalRotations.set(
                        object.name,
                        object.quaternion.clone()
                    );
                }

            });

            rightArm = model.getObjectByName("RightArm");
            rightForeArm = model.getObjectByName("RightForeArm");
            rightHand = model.getObjectByName("RightHand");
            spine = model.getObjectByName("Spine");

            console.log("3D model loaded");

            console.log("RightArm:", rightArm);
            console.log("RightForeArm:", rightForeArm);
            console.log("RightHand:", rightHand);

            scene.add(model);

            const box = new THREE.Box3().setFromObject(model);

            const size = box.getSize(
                new THREE.Vector3()
            );

            const center = box.getCenter(
                new THREE.Vector3()
            );

            model.position.sub(center);

            const maxDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            const normalizedScale =
                (3.6 / maxDimension) * CONFIG.modelScale;

            model.scale.setScalar(normalizedScale);

            const target = new THREE.Vector3(
                0,
                0,
                0
            );

            camera.position.set(
                0,
                0.15,
                6.3
            );

            camera.lookAt(target);

            modelReady = true;
        },

        undefined,

        (error) => {
            console.error(
                "GLB loading failed:",
                error
            );
        }
    );

    function setBoneRotation(bone, x, y, z) {

        if (!bone) return;

        const original = originalRotations.get(
            bone.name
        );

        if (!original) return;

        const offset = new THREE.Quaternion()
            .setFromEuler(
                new THREE.Euler(x, y, z, "XYZ")
            );

        bone.quaternion.copy(original);
        bone.quaternion.multiply(offset);
    }

    function animateWave(time) {

        if (!modelReady || !model) return;

        const wave = Math.sin(
            time * CONFIG.waveSpeed
        );

        const elbowWave = Math.sin(
            time * CONFIG.waveSpeed + 0.5
        );

        setBoneRotation(
            rightArm,
            0,
            0,
            CONFIG.armRaise
        );

        setBoneRotation(
            rightForeArm,
            0,
            CONFIG.elbowBend,
            -0.15 + elbowWave * 0.12
        );

        setBoneRotation(
            rightHand,
            0,
            0,
            wave * CONFIG.waveAmount
        );

        setBoneRotation(
            spine,
            0.012 * Math.sin(time * 1.4),
            0,
            0.018 * Math.sin(time * 0.9)
        );

        model.rotation.y =
            Math.sin(time * CONFIG.rotationSpeed) * 0.12;

        model.position.y =
            Math.sin(time * 1.5) * 0.035;
    }

    function resetPose() {

        for (const bone of [
            rightArm,
            rightForeArm,
            rightHand,
            spine
        ]) {

            if (!bone) continue;

            const original = originalRotations.get(
                bone.name
            );

            if (original) {
                bone.quaternion.copy(original);
            }
        }
    }

    function resizeRenderer() {

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        renderer.setSize(
            width,
            height,
            false
        );

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(
        resizeRenderer
    );

    resizeObserver.observe(container);

    function animate() {

        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.elapsedTime;

        if (modelReady && isModelVisible) {

            animateWave(time);

        } else if (modelReady) {

            resetPose();

        }

        if (isModelVisible && modelReady) {
            renderer.render(scene, camera);
        }
    }

    function switchVisual() {

        if (!modelReady) return;

        isModelVisible = !isModelVisible;

        photoSlide.classList.toggle(
            "active",
            !isModelVisible
        );

        modelSlide.classList.toggle(
            "active",
            isModelVisible
        );

        if (visualLabel) {

            visualLabel.textContent =
                isModelVisible
                    ? "MY 3D AVATAR · SAY HI 👋"
                    : "MEET THE DEVELOPER";

        }

        resizeRenderer();
    }

    resizeRenderer();
    animate();

    if (!window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {

        setInterval(
            switchVisual,
            CONFIG.switchInterval
        );
    }
}
