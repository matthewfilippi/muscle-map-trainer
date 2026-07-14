import * as THREE from "../node_modules/three/build/three.module.js";
import { BODY_SYSTEMS } from "./bodySystems.js";
import { getMuscle } from "./data.js";

const systemThemes = new Map(BODY_SYSTEMS.map((system) => [system.id, system.theme]));
const systemLabels = new Map(BODY_SYSTEMS.map((system) => [system.id, system.label]));
const systemIds = new Set(BODY_SYSTEMS.map((system) => system.id));

const modelVerticalOffset = 1.06;
const floorVerticalOffset = -3.8;

const ANATOMY_PART_INFO = {
  skeletal: {
    "Skull": "Protects the brain and gives structure to the face and jaw.",
    "Cervical spine": "The neck portion of the spine; supports the head and protects the upper spinal cord.",
    "Spine": "The central column of vertebrae that supports posture and protects the spinal cord.",
    "Rib cage": "Protects the heart and lungs while helping the chest expand during breathing.",
    "Pelvis": "Transfers force between the trunk and legs and protects lower abdominal organs.",
    "Left upper arm bone": "Represents the left humerus, the main bone between shoulder and elbow.",
    "Right upper arm bone": "Represents the right humerus, the main bone between shoulder and elbow.",
    "Left forearm bones": "Represents the left radius and ulna, which support wrist and elbow motion.",
    "Right forearm bones": "Represents the right radius and ulna, which support wrist and elbow motion.",
    "Left thigh bone": "Represents the left femur, the major weight-bearing bone of the thigh.",
    "Right thigh bone": "Represents the right femur, the major weight-bearing bone of the thigh.",
    "Left lower leg bones": "Represents the left tibia and fibula, which support the lower leg and ankle.",
    "Right lower leg bones": "Represents the right tibia and fibula, which support the lower leg and ankle.",
    "Left foot bones": "Represents the tarsals, metatarsals, and toes that form the left foot arch.",
    "Right foot bones": "Represents the tarsals, metatarsals, and toes that form the right foot arch.",
    "Left shoulder joint": "Connects the left arm to the torso and allows a wide range of arm movement.",
    "Right shoulder joint": "Connects the right arm to the torso and allows a wide range of arm movement.",
    "Left elbow joint": "Hinges the left forearm for bending, straightening, and rotation.",
    "Right elbow joint": "Hinges the right forearm for bending, straightening, and rotation.",
    "Left hip joint": "Connects the left thigh to the pelvis and carries body weight during movement.",
    "Right hip joint": "Connects the right thigh to the pelvis and carries body weight during movement.",
    "Left knee joint": "The main hinge joint between the left thigh and lower leg.",
    "Right knee joint": "The main hinge joint between the right thigh and lower leg."
  },
  endocrine: {
    "Pituitary": "A hormone-control gland that helps regulate growth, stress response, reproduction, and other glands.",
    "Thyroid left lobe": "One side of the thyroid gland, which helps regulate metabolism and energy use.",
    "Thyroid right lobe": "One side of the thyroid gland, which helps regulate metabolism and energy use.",
    "Thymus": "Supports immune development and produces hormones involved in T-cell maturation.",
    "Pancreatic islets": "Endocrine cells in the pancreas that help regulate blood sugar through insulin and glucagon.",
    "Left adrenal gland": "Produces hormones involved in stress response, blood pressure, and salt-water balance.",
    "Right adrenal gland": "Produces hormones involved in stress response, blood pressure, and salt-water balance.",
    "Gonadal endocrine tissue": "Produces sex hormones that influence reproduction, bone health, and other body functions."
  },
  exocrine: {
    "Left salivary gland": "Releases saliva into the mouth to moisten food and begin digestion.",
    "Right salivary gland": "Releases saliva into the mouth to moisten food and begin digestion.",
    "Left tear gland": "Produces tears that lubricate and protect the eye surface.",
    "Right tear gland": "Produces tears that lubricate and protect the eye surface.",
    "Exocrine pancreas": "Releases digestive enzymes into the small intestine to help break down food.",
    "Left torso skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Right torso skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Left abdominal skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Right abdominal skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Left arm skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Right arm skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Left thigh skin glands": "Represents sweat and oil glands that help cool and protect the skin.",
    "Right thigh skin glands": "Represents sweat and oil glands that help cool and protect the skin."
  },
  lymphatic: {
    "Main lymph trunk": "Moves lymph fluid from the body toward the central circulation.",
    "Left arm lymph vessel": "Collects lymph fluid from the left arm and upper torso.",
    "Right arm lymph vessel": "Collects lymph fluid from the right arm and upper torso.",
    "Left leg lymph vessel": "Collects lymph fluid from the left leg and lower body.",
    "Right leg lymph vessel": "Collects lymph fluid from the right leg and lower body.",
    "Left cervical lymph nodes": "Filter lymph from the head and neck region.",
    "Right cervical lymph nodes": "Filter lymph from the head and neck region.",
    "Left axillary lymph nodes": "Filter lymph from the left arm, chest, and upper torso.",
    "Right axillary lymph nodes": "Filter lymph from the right arm, chest, and upper torso.",
    "Left inguinal lymph nodes": "Filter lymph from the left leg and groin region.",
    "Right inguinal lymph nodes": "Filter lymph from the right leg and groin region.",
    "Left popliteal lymph nodes": "Filter lymph from the lower left leg and foot.",
    "Right popliteal lymph nodes": "Filter lymph from the lower right leg and foot."
  },
  nervous: {
    "Brain": "The central control organ for movement, sensation, thought, memory, and automatic body regulation.",
    "Spinal cord": "Carries signals between the brain and body and coordinates many reflexes.",
    "Left brachial nerve pathway": "Represents major nerves serving the left shoulder, arm, and hand.",
    "Right brachial nerve pathway": "Represents major nerves serving the right shoulder, arm, and hand.",
    "Left sciatic nerve pathway": "Represents major nerves serving the left hip, leg, and foot.",
    "Right sciatic nerve pathway": "Represents major nerves serving the right hip, leg, and foot.",
    "Left cranial nerve branch": "Represents nerves that serve head, face, and neck functions.",
    "Right cranial nerve branch": "Represents nerves that serve head, face, and neck functions."
  },
  reproductive: {
    "Central reproductive organ": "Represents internal reproductive structures in the pelvis.",
    "Left reproductive gland": "Represents hormone-producing reproductive gland tissue.",
    "Right reproductive gland": "Represents hormone-producing reproductive gland tissue.",
    "Left reproductive duct": "Represents a reproductive tract pathway on the left side.",
    "Right reproductive duct": "Represents a reproductive tract pathway on the right side."
  },
  integumentary: {
    "Head skin": "Skin protects the body surface, senses touch and temperature, and helps regulate heat.",
    "Neck skin": "Skin protects the body surface, senses touch and temperature, and helps regulate heat.",
    "Chest and abdominal skin": "Skin protects the torso and helps regulate body temperature.",
    "Pelvic skin": "Skin protects the lower trunk and contributes to sensation and temperature regulation.",
    "Left upper-arm skin": "Skin protects the arm surface and contains sensory receptors, sweat glands, and oil glands.",
    "Right upper-arm skin": "Skin protects the arm surface and contains sensory receptors, sweat glands, and oil glands.",
    "Left forearm and hand skin": "Skin protects the forearm and hand while supporting touch and grip sensation.",
    "Right forearm and hand skin": "Skin protects the forearm and hand while supporting touch and grip sensation.",
    "Left thigh skin": "Skin protects the thigh surface and helps with sensation and heat control.",
    "Right thigh skin": "Skin protects the thigh surface and helps with sensation and heat control.",
    "Left lower-leg skin": "Skin protects the lower leg and helps with sensation and heat control.",
    "Right lower-leg skin": "Skin protects the lower leg and helps with sensation and heat control.",
    "Left foot skin": "Skin protects the foot surface and supports pressure and balance sensation.",
    "Right foot skin": "Skin protects the foot surface and supports pressure and balance sensation."
  },
  urinary: {
    "Left kidney": "Filters blood, balances fluid and electrolytes, and helps regulate blood pressure.",
    "Right kidney": "Filters blood, balances fluid and electrolytes, and helps regulate blood pressure.",
    "Bladder": "Stores urine before it leaves the body.",
    "Left ureter": "Carries urine from the left kidney to the bladder.",
    "Right ureter": "Carries urine from the right kidney to the bladder.",
    "Urethra": "Carries urine from the bladder out of the body."
  },
  circulatory: {
    "Heart": "Pumps blood through the lungs and body to deliver oxygen and nutrients.",
    "Aorta and head artery": "Represents oxygen-rich blood flow from the heart toward the upper body.",
    "Left upper-body artery": "Represents oxygen-rich blood flow to the left arm and upper torso.",
    "Right upper-body artery": "Represents oxygen-rich blood flow to the right arm and upper torso.",
    "Left leg artery": "Represents oxygen-rich blood flow to the left leg and foot.",
    "Right leg artery": "Represents oxygen-rich blood flow to the right leg and foot.",
    "Superior vena cava pathway": "Represents oxygen-poor blood returning from the upper body toward the heart.",
    "Left upper-body vein": "Represents blood returning from the left arm and upper torso.",
    "Right upper-body vein": "Represents blood returning from the right arm and upper torso.",
    "Left leg vein": "Represents blood returning from the left leg and foot.",
    "Right leg vein": "Represents blood returning from the right leg and foot."
  },
  digestive: {
    "Esophagus": "Moves swallowed food and liquid from the throat to the stomach.",
    "Stomach": "Churns food and begins protein digestion using acid and enzymes.",
    "Liver": "Processes nutrients, makes bile, stores energy, and helps detoxify substances.",
    "Small intestine": "Absorbs most nutrients from digested food.",
    "Colon": "Absorbs water and forms stool from digestive waste.",
    "Rectum": "Stores stool before elimination."
  },
  respiratory: {
    "Trachea": "The main airway that carries air between the throat and lungs.",
    "Left lung": "Exchanges oxygen and carbon dioxide on the left side of the chest.",
    "Right lung": "Exchanges oxygen and carbon dioxide on the right side of the chest.",
    "Left main bronchus": "Carries air from the trachea into the left lung.",
    "Right main bronchus": "Carries air from the trachea into the right lung."
  }
};

function partInfo(systemId, name) {
  return ANATOMY_PART_INFO[systemId]?.[name]
    ?? `Part of the ${systemLabels.get(systemId)?.toLowerCase() ?? "body system"}.`;
}

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
    this.onHover = options.onHover;
    this.selectedId = options.selectedId;
    this.visibleSystems = new Set(options.visibleSystems ?? ["muscular"]);
    this.hoveredId = null;
    this.hoveredMesh = null;
    this.meshes = [];
    this.hoverMeshes = [];
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
    mesh.userData.systemId = "integumentary";
    mesh.userData.partName = mesh.name || "Skin";
    mesh.userData.partInfo = partInfo("integumentary", mesh.userData.partName);
    this.baseMeshes.push(mesh);
    this.hoverMeshes.push(mesh);
    this.baseGroup.add(mesh);
  }

  addSystem(systemId, mesh, pickable = false) {
    mesh.userData.systemId = systemId;
    mesh.userData.partName = mesh.name;
    mesh.userData.partInfo = systemId === "muscular" ? "" : partInfo(systemId, mesh.name);
    this.systemGroups.get(systemId)?.add(mesh);
    this.hoverMeshes.push(mesh);
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
      ["Head skin", baseEllipsoid([0, 2.35, 0], [0.44, 0.55, 0.42])],
      ["Neck skin", baseCylinder([0, 1.62, 0], 0.2, 0.25, 0.42)],
      ["Chest and abdominal skin", baseEllipsoid([0, 0.65, -0.03], [0.98, 1.25, 0.5])],
      ["Pelvic skin", baseEllipsoid([0, -0.86, -0.02], [0.78, 0.62, 0.45])],
      ["Left upper-arm skin", baseCylinder([-1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, -0.16])],
      ["Right upper-arm skin", baseCylinder([1.08, 0.55, 0], 0.22, 0.19, 1.6, [0, 0, 0.16])],
      ["Left forearm and hand skin", baseCylinder([-1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, -0.1])],
      ["Right forearm and hand skin", baseCylinder([1.34, -0.42, 0], 0.16, 0.13, 1.35, [0, 0, 0.1])],
      ["Left thigh skin", baseCylinder([-0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, 0.04])],
      ["Right thigh skin", baseCylinder([0.42, -1.45, 0], 0.28, 0.22, 1.48, [0.04, 0, -0.04])],
      ["Left lower-leg skin", baseCylinder([-0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, 0.02])],
      ["Right lower-leg skin", baseCylinder([0.42, -2.58, 0], 0.17, 0.13, 1.2, [-0.02, 0, -0.02])],
      ["Left foot skin", baseEllipsoid([-0.42, -3.23, 0.16], [0.22, 0.12, 0.4])],
      ["Right foot skin", baseEllipsoid([0.42, -3.23, 0.16], [0.22, 0.12, 0.4])]
    ].forEach(([name, mesh]) => {
      mesh.name = name;
      this.addBase(mesh);
    });
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
      ["Left upper arm bone", [-0.88, 0.78, 0], [-1.24, 0.08, 0.04]],
      ["Right upper arm bone", [0.88, 0.78, 0], [1.24, 0.08, 0.04]],
      ["Left forearm bones", [-1.25, -0.08, 0.03], [-1.38, -0.86, 0.05]],
      ["Right forearm bones", [1.25, -0.08, 0.03], [1.38, -0.86, 0.05]],
      ["Left thigh bone", [-0.32, -0.95, 0], [-0.4, -1.95, 0.02]],
      ["Right thigh bone", [0.32, -0.95, 0], [0.4, -1.95, 0.02]],
      ["Left lower leg bones", [-0.4, -2.05, 0.02], [-0.4, -3.06, 0.04]],
      ["Right lower leg bones", [0.4, -2.05, 0.02], [0.4, -3.06, 0.04]],
      ["Left foot bones", [-0.4, -3.08, 0.06], [-0.4, -3.25, 0.55]],
      ["Right foot bones", [0.4, -3.08, 0.06], [0.4, -3.25, 0.55]]
    ].forEach(([name, start, end]) => {
      this.addSystem("skeletal", cylinderBetween({ name, systemId: "skeletal", start, end, radius: 0.045, color, opacity: 0.9 }));
    });

    [
      ["Left shoulder joint", [-0.88, 0.78, 0]],
      ["Right shoulder joint", [0.88, 0.78, 0]],
      ["Left elbow joint", [-1.24, 0.08, 0.04]],
      ["Right elbow joint", [1.24, 0.08, 0.04]],
      ["Left hip joint", [-0.32, -0.95, 0]],
      ["Right hip joint", [0.32, -0.95, 0]],
      ["Left knee joint", [-0.4, -2.02, 0.02]],
      ["Right knee joint", [0.4, -2.02, 0.02]]
    ].forEach(([name, position]) => {
      this.addSystem("skeletal", ellipsoid({ name, systemId: "skeletal", position, scale: [0.1, 0.1, 0.1], color, opacity: 0.9, segments: 18 }));
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
      ["Left adrenal gland", [-0.28, -0.15, 0.25], [0.09, 0.05, 0.05]],
      ["Right adrenal gland", [0.28, -0.15, 0.25], [0.09, 0.05, 0.05]],
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
      ["Left torso skin glands", [-0.6, 0.72, 0.48]],
      ["Right torso skin glands", [0.6, 0.72, 0.48]],
      ["Left abdominal skin glands", [-0.78, 0.1, 0.44]],
      ["Right abdominal skin glands", [0.78, 0.1, 0.44]],
      ["Left arm skin glands", [-1.1, 0.2, 0.21]],
      ["Right arm skin glands", [1.1, 0.2, 0.21]],
      ["Left thigh skin glands", [-0.45, -1.45, 0.33]],
      ["Right thigh skin glands", [0.45, -1.45, 0.33]]
    ].forEach(([name, position]) => {
      this.addSystem("exocrine", ellipsoid({ name, systemId: "exocrine", position, scale: [0.035, 0.035, 0.02], color, opacity: 0.86, segments: 12 }));
    });
  }

  buildLymphaticSystem() {
    const color = systemThemes.get("lymphatic");
    [
      ["Main lymph trunk", [0, 1.5, 0.24], [0, -1.1, 0.18]],
      ["Left arm lymph vessel", [-0.58, 0.75, 0.18], [-1.05, 0.2, 0.12]],
      ["Right arm lymph vessel", [0.58, 0.75, 0.18], [1.05, 0.2, 0.12]],
      ["Left leg lymph vessel", [-0.32, -0.78, 0.18], [-0.43, -2.2, 0.1]],
      ["Right leg lymph vessel", [0.32, -0.78, 0.18], [0.43, -2.2, 0.1]]
    ].forEach(([name, start, end]) => {
      this.addSystem("lymphatic", cylinderBetween({ name, systemId: "lymphatic", start, end, radius: 0.018, color, opacity: 0.75 }));
    });

    [
      ["Left cervical lymph nodes", [-0.18, 1.48, 0.3]],
      ["Right cervical lymph nodes", [0.18, 1.48, 0.3]],
      ["Left axillary lymph nodes", [-0.7, 0.58, 0.26]],
      ["Right axillary lymph nodes", [0.7, 0.58, 0.26]],
      ["Left inguinal lymph nodes", [-0.32, -0.86, 0.24]],
      ["Right inguinal lymph nodes", [0.32, -0.86, 0.24]],
      ["Left popliteal lymph nodes", [-0.38, -2.28, 0.16]],
      ["Right popliteal lymph nodes", [0.38, -2.28, 0.16]]
    ].forEach(([name, position]) => {
      this.addSystem("lymphatic", ellipsoid({ name, systemId: "lymphatic", position, scale: [0.065, 0.065, 0.045], color, opacity: 0.94, segments: 16 }));
    });
  }

  buildNervousSystem() {
    const color = systemThemes.get("nervous");
    this.addSystem("nervous", ellipsoid({ name: "Brain", systemId: "nervous", position: [0, 2.42, 0.06], scale: [0.31, 0.24, 0.28], color, opacity: 0.9, segments: 28 }));
    this.addSystem("nervous", cylinder({ name: "Spinal cord", systemId: "nervous", position: [0, 0.28, -0.02], radiusTop: 0.035, radiusBottom: 0.04, height: 2.5, color, opacity: 0.92 }));

    [
      ["Left brachial nerve pathway", [0, 1.0, -0.02], [-1.22, 0.12, 0.08]],
      ["Right brachial nerve pathway", [0, 1.0, -0.02], [1.22, 0.12, 0.08]],
      ["Left sciatic nerve pathway", [0, 0.0, -0.02], [-0.42, -2.95, 0.06]],
      ["Right sciatic nerve pathway", [0, 0.0, -0.02], [0.42, -2.95, 0.06]],
      ["Left cranial nerve branch", [0, 1.45, -0.02], [-0.28, 2.12, 0.16]],
      ["Right cranial nerve branch", [0, 1.45, -0.02], [0.28, 2.12, 0.16]]
    ].forEach(([name, start, end]) => {
      this.addSystem("nervous", cylinderBetween({ name, systemId: "nervous", start, end, radius: 0.015, color, opacity: 0.86 }));
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
      const name = index === 0 ? "Left reproductive duct" : "Right reproductive duct";
      this.addSystem("reproductive", cylinderBetween({ name, systemId: "reproductive", start, end, radius: 0.014, color, opacity: 0.82 }));
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
      ["Left ureter", [-0.28, -0.24, 0.15], [-0.06, -0.92, 0.18]],
      ["Right ureter", [0.28, -0.24, 0.15], [0.06, -0.92, 0.18]],
      ["Urethra", [0, -1.16, 0.18], [0, -1.34, 0.18]]
    ].forEach(([name, start, end]) => {
      this.addSystem("urinary", cylinderBetween({ name, systemId: "urinary", start, end, radius: 0.018, color, opacity: 0.84 }));
    });
  }

  buildCirculatorySystem() {
    const red = systemThemes.get("circulatory");
    const blue = "#3578bf";
    this.addSystem("circulatory", ellipsoid({ name: "Heart", systemId: "circulatory", position: [-0.12, 0.72, 0.32], scale: [0.17, 0.2, 0.12], color: red, opacity: 0.95, segments: 24, rotation: [0, 0, -0.2] }));

    [
      ["Aorta and head artery", [-0.08, 0.58, 0.26], [0, 1.26, 0.2], red],
      ["Left upper-body artery", [0, 1.24, 0.2], [-0.95, 0.1, 0.12], red],
      ["Right upper-body artery", [0, 1.24, 0.2], [0.95, 0.1, 0.12], red],
      ["Left leg artery", [-0.05, 0.48, 0.22], [-0.36, -3.05, 0.08], red],
      ["Right leg artery", [0.05, 0.48, 0.22], [0.36, -3.05, 0.08], red],
      ["Superior vena cava pathway", [0.09, 0.54, 0.16], [0, 1.18, 0.08], blue],
      ["Left upper-body vein", [0, 1.18, 0.08], [-1.05, 0, -0.02], blue],
      ["Right upper-body vein", [0, 1.18, 0.08], [1.05, 0, -0.02], blue],
      ["Left leg vein", [-0.07, 0.4, 0.1], [-0.48, -2.9, -0.02], blue],
      ["Right leg vein", [0.07, 0.4, 0.1], [0.48, -2.9, -0.02], blue]
    ].forEach(([name, start, end, color]) => {
      this.addSystem("circulatory", cylinderBetween({ name, systemId: "circulatory", start, end, radius: 0.024, color, opacity: 0.86 }));
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
      const name = index === 0 ? "Left main bronchus" : "Right main bronchus";
      this.addSystem("respiratory", cylinderBetween({ name, systemId: "respiratory", start, end, radius: 0.025, color, opacity: 0.8 }));
    });
  }

  bindEvents() {
    this.onResize = () => this.resize();
    this.onPointerMove = (event) => this.handlePointerMove(event);
    this.onPointerLeave = () => {
      this.setHoveredMesh(null);
    };
    this.onPointerDown = (event) => {
      this.drag.active = true;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
      this.setHoveredMesh(null);
      this.renderer.domElement.setPointerCapture(event.pointerId);
    };
    this.onPointerUp = (event) => {
      this.drag.active = false;
      const selected = this.pickPart(event);
      if (selected?.userData.muscleId) {
        this.onSelect?.(selected.userData.muscleId);
      }
    };
    this.onPointerCancel = () => {
      this.drag.active = false;
      this.setHoveredMesh(null);
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

    this.setHoveredMesh(this.pickPart(event), event);
  }

  setHoveredMesh(mesh, event) {
    const previous = this.hoveredMesh;
    this.hoveredMesh = mesh;
    this.hoveredId = mesh?.userData.muscleId ?? null;
    this.renderer.domElement.style.cursor = mesh?.userData.muscleId ? "pointer" : mesh ? "help" : "grab";

    if (mesh && event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.onHover?.({
        name: mesh.userData.partName || mesh.name,
        description: mesh.userData.partInfo || "",
        systemId: mesh.userData.systemId,
        systemLabel: systemLabels.get(mesh.userData.systemId) ?? "Body System",
        color: systemThemes.get(mesh.userData.systemId) ?? mesh.userData.baseColor,
        isMuscle: mesh.userData.systemId === "muscular",
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    } else {
      this.onHover?.(null);
    }

    if (previous !== mesh) {
      this.updateMaterials();
    }
  }

  pickPart(event) {
    const hoverableMeshes = this.hoverMeshes.filter((mesh) => {
      const systemId = mesh.userData.systemId;
      return this.visibleSystems.has(systemId) && mesh.visible && (mesh.parent?.visible ?? true);
    });
    if (hoverableMeshes.length === 0) return null;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(hoverableMeshes, false);
    const visibleHit = hits.find((hit) => hit.object.userData.systemId !== "integumentary") ?? hits[0];
    return visibleHit?.object ?? null;
  }

  setSelected(id) {
    this.selectedId = id;
    this.updateMaterials();
  }

  setVisibleSystems(ids) {
    this.visibleSystems = new Set(ids.filter((id) => systemIds.has(id)));
    this.setHoveredMesh(null);
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
    this.hoverMeshes.forEach((mesh) => {
      const isSelected = mesh.userData.muscleId && mesh.userData.muscleId === this.selectedId;
      const isHovered = mesh === this.hoveredMesh;
      mesh.material.color.set(mesh.userData.baseColor);
      if (mesh.userData.systemId === "integumentary" && this.visibleSystems.has("integumentary")) {
        mesh.material.color.set(systemThemes.get("integumentary"));
      }
      mesh.material.emissive = new THREE.Color(isSelected ? "#ffffff" : isHovered ? "#ffffff" : "#000000");
      mesh.material.emissiveIntensity = isSelected ? 0.34 : isHovered ? 0.22 : 0;
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
