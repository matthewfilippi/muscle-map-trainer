import * as THREE from "../node_modules/three/build/three.module.js";
import { MUSCLES, getMuscle } from "./data.js";

const baseMaterial = new THREE.MeshStandardMaterial({
  color: "#d8d1c8",
  roughness: 0.8,
  metalness: 0.02,
  transparent: true,
  opacity: 0.34
});

const outlineMaterial = new THREE.MeshStandardMaterial({
  color: "#2f3337",
  roughness: 0.72,
  transparent: true,
  opacity: 0.16
});

const modelVerticalOffset = 1.06;
const floorVerticalOffset = -3.8;

function ellipsoid({ name, muscleId, position, scale, color, segments = 32, rotation = [0, 0, 0], opacity = 1 }) {
  const geometry = new THREE.SphereGeometry(1, segments, 18);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.03,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 0.65
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.muscleId = muscleId;
  mesh.userData.baseColor = color;
  return mesh;
}

function cylinder({ name, muscleId, position, radiusTop, radiusBottom, height, color, rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 26, 1);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.03
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.muscleId = muscleId;
  mesh.userData.baseColor = color;
  return mesh;
}

function baseEllipsoid(position, scale) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 18), baseMaterial.clone());
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.receiveShadow = true;
  return mesh;
}

function baseCylinder(position, radiusTop, radiusBottom, height, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 26), outlineMaterial.clone());
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.receiveShadow = true;
  return mesh;
}

export class BodyScene {
  constructor(container, options) {
    this.container = container;
    this.onSelect = options.onSelect;
    this.selectedId = options.selectedId;
    this.hoveredId = null;
    this.meshes = [];
    this.group = new THREE.Group();
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.drag = { active: false, x: 0, y: 0 };
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f4f7f4");

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    this.camera.position.set(0, 0.9, 9.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight("#ffffff", "#a9b4ad", 2.6));

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.8);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#7ec8ff", 1.2);
    rimLight.position.set(-5, 2, -4);
    this.scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 64),
      new THREE.MeshStandardMaterial({ color: "#dfe9e2", roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = modelVerticalOffset + floorVerticalOffset;
    floor.receiveShadow = true;
    this.scene.add(floor);

    this.buildBody();
    this.scene.add(this.group);
    this.group.position.y = modelVerticalOffset;
    this.group.rotation.y = -0.18;

    this.bindEvents();
    this.resize();
    this.animate();
  }

  buildBody() {
    const muscleColor = (id) => getMuscle(id).color;

    this.group.add(baseEllipsoid([0, 2.35, 0], [0.44, 0.55, 0.42]));
    this.group.add(baseCylinder([0, 1.62, 0], 0.2, 0.25, 0.42));
    this.group.add(baseEllipsoid([0, 0.65, -0.03], [0.98, 1.25, 0.5]));
    this.group.add(baseEllipsoid([0, -0.86, -0.02], [0.78, 0.62, 0.45]));
    this.group.add(baseCylinder([-1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, -0.16]));
    this.group.add(baseCylinder([1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, 0.16]));
    this.group.add(baseCylinder([-1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, -0.1]));
    this.group.add(baseCylinder([1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, 0.1]));
    this.group.add(baseCylinder([-0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, 0.04]));
    this.group.add(baseCylinder([0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, -0.04]));
    this.group.add(baseCylinder([-0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, 0.02]));
    this.group.add(baseCylinder([0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, -0.02]));
    this.group.add(baseEllipsoid([-0.42, -3.23, 0.16], [0.22, 0.12, 0.4]));
    this.group.add(baseEllipsoid([0.42, -3.23, 0.16], [0.22, 0.12, 0.4]));

    const pieces = [
      ellipsoid({ name: "Left pectoral", muscleId: "chest", position: [-0.34, 0.88, 0.43], scale: [0.38, 0.34, 0.14], color: muscleColor("chest") }),
      ellipsoid({ name: "Right pectoral", muscleId: "chest", position: [0.34, 0.88, 0.43], scale: [0.38, 0.34, 0.14], color: muscleColor("chest") }),
      ellipsoid({ name: "Left deltoid", muscleId: "shoulders", position: [-0.95, 0.95, 0.08], scale: [0.28, 0.36, 0.3], color: muscleColor("shoulders") }),
      ellipsoid({ name: "Right deltoid", muscleId: "shoulders", position: [0.95, 0.95, 0.08], scale: [0.28, 0.36, 0.3], color: muscleColor("shoulders") }),
      cylinder({ name: "Left biceps", muscleId: "biceps", position: [-1.2, 0.28, 0.18], radiusTop: 0.15, radiusBottom: 0.12, height: 0.82, color: muscleColor("biceps"), rotation: [0.08, 0, -0.17] }),
      cylinder({ name: "Right biceps", muscleId: "biceps", position: [1.2, 0.28, 0.18], radiusTop: 0.15, radiusBottom: 0.12, height: 0.82, color: muscleColor("biceps"), rotation: [0.08, 0, 0.17] }),
      cylinder({ name: "Left triceps", muscleId: "triceps", position: [-1.14, 0.24, -0.18], radiusTop: 0.14, radiusBottom: 0.12, height: 0.82, color: muscleColor("triceps"), rotation: [0.08, 0, -0.17] }),
      cylinder({ name: "Right triceps", muscleId: "triceps", position: [1.14, 0.24, -0.18], radiusTop: 0.14, radiusBottom: 0.12, height: 0.82, color: muscleColor("triceps"), rotation: [0.08, 0, 0.17] }),
      cylinder({ name: "Left forearm", muscleId: "forearms", position: [-1.34, -0.55, 0.08], radiusTop: 0.12, radiusBottom: 0.09, height: 0.88, color: muscleColor("forearms"), rotation: [0.08, 0, -0.11] }),
      cylinder({ name: "Right forearm", muscleId: "forearms", position: [1.34, -0.55, 0.08], radiusTop: 0.12, radiusBottom: 0.09, height: 0.88, color: muscleColor("forearms"), rotation: [0.08, 0, 0.11] }),
      cylinder({ name: "Neck column", muscleId: "neck", position: [0, 1.62, 0.02], radiusTop: 0.2, radiusBottom: 0.23, height: 0.48, color: muscleColor("neck") }),
      ellipsoid({ name: "Front neck", muscleId: "neck", position: [0, 1.6, 0.28], scale: [0.23, 0.3, 0.12], color: muscleColor("neck") }),
      ellipsoid({ name: "Upper traps", muscleId: "traps", position: [0, 1.34, -0.22], scale: [0.7, 0.24, 0.17], color: muscleColor("traps") }),
      ellipsoid({ name: "Left lat", muscleId: "lats", position: [-0.46, 0.35, -0.42], scale: [0.32, 0.78, 0.16], color: muscleColor("lats") }),
      ellipsoid({ name: "Right lat", muscleId: "lats", position: [0.46, 0.35, -0.42], scale: [0.32, 0.78, 0.16], color: muscleColor("lats") }),
      ellipsoid({ name: "Lower back", muscleId: "lowerBack", position: [0, -0.43, -0.42], scale: [0.5, 0.44, 0.16], color: muscleColor("lowerBack") }),
      ellipsoid({ name: "Abs upper", muscleId: "abs", position: [0, 0.35, 0.46], scale: [0.28, 0.3, 0.1], color: muscleColor("abs") }),
      ellipsoid({ name: "Abs lower", muscleId: "abs", position: [0, -0.18, 0.45], scale: [0.25, 0.36, 0.1], color: muscleColor("abs") }),
      ellipsoid({ name: "Left oblique", muscleId: "obliques", position: [-0.48, 0.04, 0.38], scale: [0.16, 0.52, 0.1], color: muscleColor("obliques") }),
      ellipsoid({ name: "Right oblique", muscleId: "obliques", position: [0.48, 0.04, 0.38], scale: [0.16, 0.52, 0.1], color: muscleColor("obliques") }),
      ellipsoid({ name: "Left glute", muscleId: "glutes", position: [-0.32, -0.88, -0.36], scale: [0.36, 0.34, 0.18], color: muscleColor("glutes") }),
      ellipsoid({ name: "Right glute", muscleId: "glutes", position: [0.32, -0.88, -0.36], scale: [0.36, 0.34, 0.18], color: muscleColor("glutes") }),
      cylinder({ name: "Left quad", muscleId: "quads", position: [-0.4, -1.5, 0.21], radiusTop: 0.2, radiusBottom: 0.16, height: 1.05, color: muscleColor("quads"), rotation: [0.03, 0, 0.04] }),
      cylinder({ name: "Right quad", muscleId: "quads", position: [0.4, -1.5, 0.21], radiusTop: 0.2, radiusBottom: 0.16, height: 1.05, color: muscleColor("quads"), rotation: [0.03, 0, -0.04] }),
      cylinder({ name: "Left hamstring", muscleId: "hamstrings", position: [-0.4, -1.5, -0.2], radiusTop: 0.18, radiusBottom: 0.14, height: 1.05, color: muscleColor("hamstrings"), rotation: [0.03, 0, 0.04] }),
      cylinder({ name: "Right hamstring", muscleId: "hamstrings", position: [0.4, -1.5, -0.2], radiusTop: 0.18, radiusBottom: 0.14, height: 1.05, color: muscleColor("hamstrings"), rotation: [0.03, 0, -0.04] }),
      cylinder({ name: "Left calf", muscleId: "calves", position: [-0.4, -2.6, -0.04], radiusTop: 0.13, radiusBottom: 0.1, height: 0.88, color: muscleColor("calves"), rotation: [-0.02, 0, 0.02] }),
      cylinder({ name: "Right calf", muscleId: "calves", position: [0.4, -2.6, -0.04], radiusTop: 0.13, radiusBottom: 0.1, height: 0.88, color: muscleColor("calves"), rotation: [-0.02, 0, -0.02] }),
      ellipsoid({ name: "Left ankle", muscleId: "feetAnkles", position: [-0.4, -3.07, -0.02], scale: [0.24, 0.17, 0.23], color: muscleColor("feetAnkles") }),
      ellipsoid({ name: "Right ankle", muscleId: "feetAnkles", position: [0.4, -3.07, -0.02], scale: [0.24, 0.17, 0.23], color: muscleColor("feetAnkles") }),
      ellipsoid({ name: "Left foot", muscleId: "feetAnkles", position: [-0.4, -3.25, 0.28], scale: [0.36, 0.14, 0.58], color: muscleColor("feetAnkles"), rotation: [0.08, 0, 0.02] }),
      ellipsoid({ name: "Right foot", muscleId: "feetAnkles", position: [0.4, -3.25, 0.28], scale: [0.36, 0.14, 0.58], color: muscleColor("feetAnkles"), rotation: [0.08, 0, -0.02] }),
      ellipsoid({ name: "Left toe box", muscleId: "feetAnkles", position: [-0.4, -3.25, 0.66], scale: [0.3, 0.09, 0.2], color: muscleColor("feetAnkles"), rotation: [0.04, 0, 0.02] }),
      ellipsoid({ name: "Right toe box", muscleId: "feetAnkles", position: [0.4, -3.25, 0.66], scale: [0.3, 0.09, 0.2], color: muscleColor("feetAnkles"), rotation: [0.04, 0, -0.02] }),
      ellipsoid({ name: "Left foot click pad", muscleId: "feetAnkles", position: [-0.4, -3.2, 0.32], scale: [0.48, 0.24, 0.78], color: muscleColor("feetAnkles"), opacity: 0.22 }),
      ellipsoid({ name: "Right foot click pad", muscleId: "feetAnkles", position: [0.4, -3.2, 0.32], scale: [0.48, 0.24, 0.78], color: muscleColor("feetAnkles"), opacity: 0.22 })
    ];

    pieces.forEach((piece) => {
      this.meshes.push(piece);
      this.group.add(piece);
    });
  }

  bindEvents() {
    this.onResize = () => this.resize();
    this.onPointerMove = (event) => this.handlePointerMove(event);
    this.onPointerLeave = () => {
      this.hoveredId = null;
      this.updateMaterials();
    };
    this.onPointerDown = (event) => {
      this.drag.active = true;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
      this.renderer.domElement.setPointerCapture(event.pointerId);
    };
    this.onPointerUp = (event) => {
      this.drag.active = false;
      const selected = this.pick(event);
      if (selected) {
        this.onSelect(selected);
      }
    };
    this.onPointerCancel = () => {
      this.drag.active = false;
    };

    window.addEventListener("resize", this.onResize);
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.addEventListener("pointerleave", this.onPointerLeave);
    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.addEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.addEventListener("pointercancel", this.onPointerCancel);
  }

  handlePointerMove(event) {
    if (this.drag.active) {
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      this.group.rotation.y += dx * 0.008;
      this.group.rotation.x = THREE.MathUtils.clamp(this.group.rotation.x + dy * 0.004, -0.55, 0.55);
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
      return;
    }

    this.hoveredId = this.pick(event);
    this.renderer.domElement.style.cursor = this.hoveredId ? "pointer" : "grab";
    this.updateMaterials();
  }

  pick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.meshes, false);
    return hits.length > 0 ? hits[0].object.userData.muscleId : null;
  }

  setSelected(id) {
    this.selectedId = id;
    this.updateMaterials();
  }

  setView(view) {
    const target = view === "back" ? Math.PI : 0;
    this.group.rotation.y = target;
    this.group.rotation.x = 0;
  }

  updateMaterials() {
    this.meshes.forEach((mesh) => {
      const isSelected = mesh.userData.muscleId === this.selectedId;
      const isHovered = mesh.userData.muscleId === this.hoveredId;
      mesh.material.color.set(mesh.userData.baseColor);
      mesh.material.emissive = new THREE.Color(isSelected ? "#ffffff" : isHovered ? "#222222" : "#000000");
      mesh.material.emissiveIntensity = isSelected ? 0.34 : isHovered ? 0.12 : 0;
      mesh.scale.multiplyScalar(1);
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 420);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    this.group.position.y = modelVerticalOffset + Math.sin(elapsed * 0.8) * 0.025;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.onResize);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.removeEventListener("pointerleave", this.onPointerLeave);
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.removeEventListener("pointercancel", this.onPointerCancel);
    this.renderer.dispose();
    this.container.replaceChildren();
  }
}
