import * as THREE from "../node_modules/three/build/three.module.js";
import { BODY_SYSTEMS } from "./bodySystems.js";
import { getMuscle } from "./data.js";

const systemThemes = new Map(BODY_SYSTEMS.map((system) => [system.id, system.theme]));
const systemIds = new Set(BODY_SYSTEMS.map((system) => system.id));

const modelVerticalOffset = 1.06;
const floorVerticalOffset = -3.8;

function makeMaterial(color, opacity = 1, roughness = 0.58) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.03,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 0.65
  });
}

function ellipsoid({
  name,
  muscleId,
  systemId = "muscular",
  position,
  scale,
  color,
  segments = 32,
  rotation = [0, 0, 0],
  opacity = 1
}) {
  const geometry = new THREE.SphereGeometry(1, segments, 18);
  const material = makeMaterial(color, opacity);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.muscleId = muscleId;
  mesh.userData.systemId = systemId;
  mesh.userData.baseColor = color;
  return mesh;
}

function cylinder({
  name,
  muscleId,
  systemId = "muscular",
  position,
  radiusTop,
  radiusBottom,
  height,
  color,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  opacity = 1
}) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 26, 1);
  const material = makeMaterial(color, opacity);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.muscleId = muscleId;
  mesh.userData.systemId = systemId;
  mesh.userData.baseColor = color;
  return mesh;
}

function cylinderBetween({ name, systemId, start, end, radius = 0.025, color, opacity = 0.9 }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVector, startVector);
  const length = direction.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 14),
    makeMaterial(color, opacity)
  );
  mesh.name = name;
  mesh.position.copy(startVector.add(endVector).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.userData.systemId = systemId;
  mesh.userData.baseColor = color;
  return mesh;
}

function torus({ name, systemId, position, scale, color, rotation = [0, 0, 0], opacity = 0.9, radius = 1, tube = 0.04 }) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 18, 72),
    makeMaterial(color, opacity)
  );
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.userData.systemId = systemId;
  mesh.userData.baseColor = color;
  return mesh;
}

function baseEllipsoid(position, scale) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 18), makeMaterial("#d8d1c8", 0.14, 0.8));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.receiveShadow = true;
  mesh.userData.baseColor = "#d8d1c8";
  return mesh;
}

function baseCylinder(position, radiusTop, radiusBottom, height, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 26), makeMaterial("#2f3337", 0.12, 0.72));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.receiveShadow = true;
  mesh.userData.baseColor = "#2f3337";
  return mesh;
}

export class BodyScene {
  constructor(container, options = {}) {
    this.container = container;
    this.onSelect = options.onSelect;
    this.selectedId = options.selectedId;
    this.visibleSystems = new Set(options.visibleSystems ?? ["muscular"]);
    this.hoveredId = null;
    this.meshes = [];
    this.baseMeshes = [];
    this.systemGroups = new Map();
    this.baseGroup = new THREE.Group();
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

    BODY_SYSTEMS.forEach((system) => {
      const group = new THREE.Group();
      group.name = system.id;
      this.systemGroups.set(system.id, group);
      this.group.add(group);
    });

    this.group.add(this.baseGroup);
    this.buildBody();
    this.scene.add(this.group);
    this.group.position.y = modelVerticalOffset;
    this.group.rotation.y = -0.18;
    this.setVisibleSystems([...this.visibleSystems]);

    this.bindEvents();
    this.resize();
    this.animate();
  }

  addBase(mesh) {
    this.baseMeshes.push(mesh);
    this.baseGroup.add(mesh);
  }

  addSystem(systemId, mesh, pickable = false) {
    this.systemGroups.get(systemId)?.add(mesh);
    if (pickable) {
      this.meshes.push(mesh);
    }
  }

  buildBody() {
    this.buildBaseModel();
    this.buildMuscularSystem();
    this.buildSkeletalSystem();
    this.buildEndocrineSystem();
    this.buildExocrineSystem();
    this.buildLymphaticSystem();
    this.buildNervousSystem();
    this.buildReproductiveSystem();
    this.buildUrinarySystem();
    this.buildCirculatorySystem();
    this.buildDigestiveSystem();
    this.buildRespiratorySystem();
  }

  buildBaseModel() {
    [
      baseEllipsoid([0, 2.35, 0], [0.44, 0.55, 0.42]),
      baseCylinder([0, 1.62, 0], 0.2, 0.25, 0.42),
      baseEllipsoid([0, 0.65, -0.03], [0.98, 1.25, 0.5]),
      baseEllipsoid([0, -0.86, -0.02], [0.78, 0.62, 0.45]),
      baseCylinder([-1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, -0.16]),
      baseCylinder([1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, 0.16]),
      baseCylinder([-1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, -0.1]),
      baseCylinder([1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, 0.1]),
      baseCylinder([-0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, 0.04]),
      baseCylinder([0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, -0.04]),
      baseCylinder([-0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, 0.02]),
      baseCylinder([0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, -0.02]),
      baseEllipsoid([-0.42, -3.23, 0.16], [0.22, 0.12, 0.4]),
      baseEllipsoid([0.42, -3.23, 0.16], [0.22, 0.12, 0.4])
    ].forEach((mesh) => this.addBase(mesh));
  }

  buildMuscularSystem() {
    const muscleColor = (id) => getMuscle(id).color;
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

    pieces.forEach((piece) => this.addSystem("muscular", piece, true));
  }

  buildSkeletalSystem() {
    const color = systemThemes.get("skeletal");
    [
      ellipsoid({ name: "Skull", systemId: "skeletal", position: [0, 2.38, 0.02], scale: [0.32, 0.4, 0.3], color, opacity: 0.92 }),
      cylinder({ name: "Cervical spine", systemId: "skeletal", position: [0, 1.65, -0.05], radiusTop: 0.07, radiusBottom: 0.08, height: 0.48, color, opacity: 0.92 }),
      cylinder({ name: "Spine", systemId: "skeletal", position: [0, 0.18, -0.16], radiusTop: 0.08, radiusBottom: 0.1, height: 2.4, color, opacity: 0.9 }),
      torus({ name: "Rib cage", systemId: "skeletal", position: [0, 0.62, 0.1], scale: [0.72, 0.88, 0.24], color, opacity: 0.88, tube: 0.035 }),
      torus({ name: "Pelvis", systemId: "skeletal", position: [0, -0.84, 0.02], scale: [0.58, 0.34, 0.18], color, opacity: 0.88, tube: 0.045 })
    ].forEach((mesh) => this.addSystem("skeletal", mesh));

    [
      [[-0.88, 0.78, 0], [-1.24, 0.08, 0.04]],
      [[0.88, 0.78, 0], [1.24, 0.08, 0.04]],
      [[-1.25, -0.08, 0.03], [-1.38, -0.86, 0.05]],
      [[1.25, -0.08, 0.03], [1.38, -0.86, 0.05]],
      [[-0.32, -0.95, 0], [-0.4, -1.95, 0.02]],
      [[0.32, -0.95, 0], [0.4, -1.95, 0.02]],
      [[-0.4, -2.05, 0.02], [-0.4, -3.06, 0.04]],
      [[0.4, -2.05, 0.02], [0.4, -3.06, 0.04]],
      [[-0.4, -3.08, 0.06], [-0.4, -3.25, 0.55]],
      [[0.4, -3.08, 0.06], [0.4, -3.25, 0.55]]
    ].forEach(([start, end], index) => {
      this.addSystem("skeletal", cylinderBetween({ name: `Bone ${index}`, systemId: "skeletal", start, end, radius: 0.045, color, opacity: 0.9 }));
    });

    [
      [-0.88, 0.78, 0], [0.88, 0.78, 0], [-1.24, 0.08, 0.04], [1.24, 0.08, 0.04],
      [-0.32, -0.95, 0], [0.32, -0.95, 0], [-0.4, -2.02, 0.02], [0.4, -2.02, 0.02]
    ].forEach((position, index) => {
      this.addSystem("skeletal", ellipsoid({ name: `Joint ${index}`, systemId: "skeletal", position, scale: [0.1, 0.1, 0.1], color, opacity: 0.9, segments: 18 }));
    });
  }

  buildEndocrineSystem() {
    const color = systemThemes.get("endocrine");
    const glands = [
      ["Pituitary", [0, 2.5, 0.26], [0.07, 0.05, 0.05]],
      ["Thyroid left lobe", [-0.09, 1.58, 0.28], [0.08, 0.13, 0.05]],
      ["Thyroid right lobe", [0.09, 1.58, 0.28], [0.08, 0.13, 0.05]],
      ["Thymus", [0, 0.92, 0.32], [0.12, 0.16, 0.05]],
      ["Pancreatic islets", [0.26, 0.04, 0.35], [0.26, 0.08, 0.05]],
      ["Left adrenal", [-0.28, -0.15, 0.25], [0.09, 0.05, 0.05]],
      ["Right adrenal", [0.28, -0.15, 0.25], [0.09, 0.05, 0.05]],
      ["Gonadal endocrine tissue", [0, -1.02, 0.28], [0.14, 0.08, 0.06]]
    ];

    glands.forEach(([name, position, scale]) => {
      this.addSystem("endocrine", ellipsoid({ name, systemId: "endocrine", position, scale, color, opacity: 0.92, segments: 22 }));
    });
  }

  buildExocrineSystem() {
    const color = systemThemes.get("exocrine");
    const pieces = [
      ["Left salivary gland", [-0.28, 2.1, 0.23], [0.12, 0.08, 0.05]],
      ["Right salivary gland", [0.28, 2.1, 0.23], [0.12, 0.08, 0.05]],
      ["Left tear gland", [-0.17, 2.5, 0.34], [0.04, 0.03, 0.025]],
      ["Right tear gland", [0.17, 2.5, 0.34], [0.04, 0.03, 0.025]],
      ["Exocrine pancreas", [0.16, 0.02, 0.39], [0.32, 0.07, 0.05]]
    ];

    pieces.forEach(([name, position, scale]) => {
      this.addSystem("exocrine", ellipsoid({ name, systemId: "exocrine", position, scale, color, opacity: 0.9, segments: 20 }));
    });

    [
      [-0.6, 0.72, 0.48], [0.6, 0.72, 0.48], [-0.78, 0.1, 0.44], [0.78, 0.1, 0.44],
      [-1.1, 0.2, 0.21], [1.1, 0.2, 0.21], [-0.45, -1.45, 0.33], [0.45, -1.45, 0.33]
    ].forEach((position, index) => {
      this.addSystem("exocrine", ellipsoid({ name: `Surface gland ${index}`, systemId: "exocrine", position, scale: [0.035, 0.035, 0.02], color, opacity: 0.86, segments: 12 }));
    });
  }

  buildLymphaticSystem() {
    const color = systemThemes.get("lymphatic");
    [
      [[0, 1.5, 0.24], [0, -1.1, 0.18]],
      [[-0.58, 0.75, 0.18], [-1.05, 0.2, 0.12]],
      [[0.58, 0.75, 0.18], [1.05, 0.2, 0.12]],
      [[-0.32, -0.78, 0.18], [-0.43, -2.2, 0.1]],
      [[0.32, -0.78, 0.18], [0.43, -2.2, 0.1]]
    ].forEach(([start, end], index) => {
      this.addSystem("lymphatic", cylinderBetween({ name: `Lymph vessel ${index}`, systemId: "lymphatic", start, end, radius: 0.018, color, opacity: 0.75 }));
    });

    [
      [-0.18, 1.48, 0.3], [0.18, 1.48, 0.3], [-0.7, 0.58, 0.26], [0.7, 0.58, 0.26],
      [-0.32, -0.86, 0.24], [0.32, -0.86, 0.24], [-0.38, -2.28, 0.16], [0.38, -2.28, 0.16]
    ].forEach((position, index) => {
      this.addSystem("lymphatic", ellipsoid({ name: `Lymph node ${index}`, systemId: "lymphatic", position, scale: [0.065, 0.065, 0.045], color, opacity: 0.94, segments: 16 }));
    });
  }

  buildNervousSystem() {
    const color = systemThemes.get("nervous");
    this.addSystem("nervous", ellipsoid({ name: "Brain", systemId: "nervous", position: [0, 2.42, 0.06], scale: [0.31, 0.24, 0.28], color, opacity: 0.9, segments: 28 }));
    this.addSystem("nervous", cylinder({ name: "Spinal cord", systemId: "nervous", position: [0, 0.28, -0.02], radiusTop: 0.035, radiusBottom: 0.04, height: 2.5, color, opacity: 0.92 }));

    [
      [[0, 1.0, -0.02], [-1.22, 0.12, 0.08]],
      [[0, 1.0, -0.02], [1.22, 0.12, 0.08]],
      [[0, 0.0, -0.02], [-0.42, -2.95, 0.06]],
      [[0, 0.0, -0.02], [0.42, -2.95, 0.06]],
      [[0, 1.45, -0.02], [-0.28, 2.12, 0.16]],
      [[0, 1.45, -0.02], [0.28, 2.12, 0.16]]
    ].forEach(([start, end], index) => {
      this.addSystem("nervous", cylinderBetween({ name: `Peripheral nerve ${index}`, systemId: "nervous", start, end, radius: 0.015, color, opacity: 0.86 }));
    });
  }

  buildReproductiveSystem() {
    const color = systemThemes.get("reproductive");
    [
      ["Central reproductive organ", [0, -1.03, 0.31], [0.16, 0.18, 0.08]],
      ["Left reproductive gland", [-0.2, -1.1, 0.32], [0.08, 0.06, 0.05]],
      ["Right reproductive gland", [0.2, -1.1, 0.32], [0.08, 0.06, 0.05]]
    ].forEach(([name, position, scale]) => {
      this.addSystem("reproductive", ellipsoid({ name, systemId: "reproductive", position, scale, color, opacity: 0.9, segments: 20 }));
    });

    [
      [[-0.13, -1.03, 0.31], [-0.26, -1.1, 0.32]],
      [[0.13, -1.03, 0.31], [0.26, -1.1, 0.32]]
    ].forEach(([start, end], index) => {
      this.addSystem("reproductive", cylinderBetween({ name: `Reproductive duct ${index}`, systemId: "reproductive", start, end, radius: 0.014, color, opacity: 0.82 }));
    });
  }

  buildUrinarySystem() {
    const color = systemThemes.get("urinary");
    [
      ["Left kidney", [-0.32, -0.08, 0.12], [0.12, 0.22, 0.08]],
      ["Right kidney", [0.32, -0.08, 0.12], [0.12, 0.22, 0.08]],
      ["Bladder", [0, -1.04, 0.18], [0.18, 0.16, 0.11]]
    ].forEach(([name, position, scale]) => {
      this.addSystem("urinary", ellipsoid({ name, systemId: "urinary", position, scale, color, opacity: 0.9, segments: 22 }));
    });

    [
      [[-0.28, -0.24, 0.15], [-0.06, -0.92, 0.18]],
      [[0.28, -0.24, 0.15], [0.06, -0.92, 0.18]],
      [[0, -1.16, 0.18], [0, -1.34, 0.18]]
    ].forEach(([start, end], index) => {
      this.addSystem("urinary", cylinderBetween({ name: `Urinary tube ${index}`, systemId: "urinary", start, end, radius: 0.018, color, opacity: 0.84 }));
    });
  }

  buildCirculatorySystem() {
    const red = systemThemes.get("circulatory");
    const blue = "#3578bf";
    this.addSystem("circulatory", ellipsoid({ name: "Heart", systemId: "circulatory", position: [-0.12, 0.72, 0.32], scale: [0.17, 0.2, 0.12], color: red, opacity: 0.95, segments: 24, rotation: [0, 0, -0.2] }));

    [
      [[-0.08, 0.58, 0.26], [0, 1.26, 0.2], red],
      [[0, 1.24, 0.2], [-0.95, 0.1, 0.12], red],
      [[0, 1.24, 0.2], [0.95, 0.1, 0.12], red],
      [[-0.05, 0.48, 0.22], [-0.36, -3.05, 0.08], red],
      [[0.05, 0.48, 0.22], [0.36, -3.05, 0.08], red],
      [[0.09, 0.54, 0.16], [0, 1.18, 0.08], blue],
      [[0, 1.18, 0.08], [-1.05, 0, -0.02], blue],
      [[0, 1.18, 0.08], [1.05, 0, -0.02], blue],
      [[-0.07, 0.4, 0.1], [-0.48, -2.9, -0.02], blue],
      [[0.07, 0.4, 0.1], [0.48, -2.9, -0.02], blue]
    ].forEach(([start, end, color], index) => {
      this.addSystem("circulatory", cylinderBetween({ name: `Blood vessel ${index}`, systemId: "circulatory", start, end, radius: 0.024, color, opacity: 0.86 }));
    });
  }

  buildDigestiveSystem() {
    const color = systemThemes.get("digestive");
    this.addSystem("digestive", cylinderBetween({ name: "Esophagus", systemId: "digestive", start: [0, 1.48, 0.26], end: [0, 0.44, 0.34], radius: 0.035, color, opacity: 0.86 }));
    [
      ["Stomach", [-0.18, 0.18, 0.36], [0.26, 0.2, 0.11]],
      ["Liver", [0.28, 0.34, 0.33], [0.32, 0.18, 0.08]],
      ["Small intestine", [0, -0.32, 0.34], [0.44, 0.34, 0.1]],
      ["Rectum", [0, -0.86, 0.28], [0.08, 0.2, 0.05]]
    ].forEach(([name, position, scale]) => {
      this.addSystem("digestive", ellipsoid({ name, systemId: "digestive", position, scale, color, opacity: 0.88, segments: 24 }));
    });
    this.addSystem("digestive", torus({ name: "Colon", systemId: "digestive", position: [0, -0.26, 0.33], scale: [0.42, 0.42, 0.12], color: "#8b5a2b", opacity: 0.86, tube: 0.05 }));
  }

  buildRespiratorySystem() {
    const color = systemThemes.get("respiratory");
    this.addSystem("respiratory", cylinder({ name: "Trachea", systemId: "respiratory", position: [0, 1.2, 0.31], radiusTop: 0.05, radiusBottom: 0.06, height: 0.76, color, opacity: 0.88 }));
    [
      ["Left lung", [-0.28, 0.64, 0.28], [0.26, 0.48, 0.13]],
      ["Right lung", [0.28, 0.64, 0.28], [0.26, 0.48, 0.13]]
    ].forEach(([name, position, scale]) => {
      this.addSystem("respiratory", ellipsoid({ name, systemId: "respiratory", position, scale, color, opacity: 0.68, segments: 28 }));
    });
    [
      [[0, 0.88, 0.31], [-0.18, 0.62, 0.3]],
      [[0, 0.88, 0.31], [0.18, 0.62, 0.3]]
    ].forEach(([start, end], index) => {
      this.addSystem("respiratory", cylinderBetween({ name: `Bronchus ${index}`, systemId: "respiratory", start, end, radius: 0.025, color, opacity: 0.8 }));
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
        this.onSelect?.(selected);
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
    const pickableMeshes = this.meshes.filter((mesh) => mesh.visible && mesh.parent?.visible);
    if (pickableMeshes.length === 0) return null;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(pickableMeshes, false);
    return hits.length > 0 ? hits[0].object.userData.muscleId : null;
  }

  setSelected(id) {
    this.selectedId = id;
    this.updateMaterials();
  }

  setVisibleSystems(ids) {
    this.visibleSystems = new Set(ids.filter((id) => systemIds.has(id)));
    this.systemGroups.forEach((group, id) => {
      group.visible = this.visibleSystems.has(id);
    });

    const showSkin = this.visibleSystems.has("integumentary");
    this.baseMeshes.forEach((mesh) => {
      mesh.material.opacity = showSkin ? 0.34 : 0.13;
      mesh.material.transparent = true;
      mesh.material.color.set(showSkin ? systemThemes.get("integumentary") : mesh.userData.baseColor);
    });

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
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 420);
    this.camera.aspect = width / height;
    this.camera.position.z = this.camera.aspect < 0.72 ? 12.9 : this.camera.aspect < 1 ? 11.2 : 9.8;
    this.camera.position.y = this.camera.aspect < 0.72 ? 0.65 : 0.9;
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
