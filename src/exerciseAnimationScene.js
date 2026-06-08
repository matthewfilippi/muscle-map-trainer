import * as THREE from "../node_modules/three/build/three.module.js";

const yAxis = new THREE.Vector3(0, 1, 0);
const skin = "#d8d1c8";
const dark = "#26342e";
const metal = "#6b7470";
const rubber = "#2f3337";
const equipmentAccent = "#3578bf";

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.66,
    metalness: options.metalness ?? 0.04,
    transparent: options.opacity !== undefined && options.opacity < 1,
    opacity: options.opacity ?? 1
  });
}

function addBox(group, position, scale, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), makeMaterial(color, options));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addSphere(group, position, scale, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 18), makeMaterial(color, options));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(group, position, radiusTop, radiusBottom, height, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28), makeMaterial(color, options));
  mesh.position.set(...position);
  mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addTorus(group, position, radius, tube, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 18, 48), makeMaterial(color, options));
  mesh.position.set(...position);
  mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function segmentMesh(color, radius = 0.08) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 24), makeMaterial(color));
  mesh.userData.radius = radius;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function placeSegment(mesh, start, end, radius = mesh.userData.radius ?? 0.08) {
  const direction = end.clone().sub(start);
  const length = Math.max(direction.length(), 0.001);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);

  mesh.position.copy(midpoint);
  mesh.scale.set(radius, length, radius);
  mesh.quaternion.setFromUnitVectors(yAxis, direction.normalize());
}

function makePoint(x, y, z = 0) {
  return new THREE.Vector3(x, y, z);
}

function equipmentIdsFromOptions(equipment) {
  return equipment.map((item) => item.id);
}

export class ExerciseAnimationScene {
  constructor(container, options) {
    this.container = container;
    this.pattern = options.pattern;
    this.equipment = options.equipment;
    this.equipmentIds = equipmentIdsFromOptions(options.equipment);
    this.muscleColor = options.muscleColor;
    this.exerciseName = options.exerciseName;
    this.clock = new THREE.Clock();
    this.parts = {};
    this.props = {};

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f7fbf8");

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(0, 1.2, 7.1);
    this.camera.lookAt(0, 0.45, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight("#ffffff", "#a9b4ad", 2.4));

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#7ec8ff", 1.1);
    rimLight.position.set(-5, 3, -4);
    this.scene.add(rimLight);

    this.floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 72),
      makeMaterial("#dfe9e2", { roughness: 0.9 })
    );
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -1.18;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.body = new THREE.Group();
    this.propGroup = new THREE.Group();
    this.scene.add(this.body);
    this.scene.add(this.propGroup);

    this.buildBody();
    this.buildEquipment();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.animate();
  }

  buildBody() {
    const active = this.muscleColor;
    const limbColor = ["press", "pull", "curl", "raise", "carry"].includes(this.pattern) ? active : skin;
    const legColor = ["squat", "hinge", "calf", "ankle"].includes(this.pattern) ? active : skin;
    const torsoColor = ["core", "hinge", "neck"].includes(this.pattern) ? active : skin;

    this.parts.torso = addSphere(this.body, [0, 0.65, 0], [0.45, 0.78, 0.26], torsoColor, { opacity: 0.96 });
    this.parts.pelvis = addSphere(this.body, [0, -0.1, 0], [0.42, 0.26, 0.25], skin, { opacity: 0.95 });
    this.parts.head = addSphere(this.body, [0, 1.68, 0], [0.22, 0.25, 0.22], "#f1ccb6");
    this.parts.neck = segmentMesh(torsoColor, 0.09);
    this.body.add(this.parts.neck);

    ["leftUpperArm", "leftForearm", "rightUpperArm", "rightForearm"].forEach((key) => {
      this.parts[key] = segmentMesh(limbColor, key.includes("Upper") ? 0.085 : 0.07);
      this.body.add(this.parts[key]);
    });

    ["leftThigh", "leftShin", "rightThigh", "rightShin"].forEach((key) => {
      this.parts[key] = segmentMesh(legColor, key.includes("Thigh") ? 0.11 : 0.08);
      this.body.add(this.parts[key]);
    });

    this.parts.leftHand = addSphere(this.body, [-0.65, 0.3, 0], [0.08, 0.08, 0.08], dark);
    this.parts.rightHand = addSphere(this.body, [0.65, 0.3, 0], [0.08, 0.08, 0.08], dark);
    this.parts.leftFoot = addSphere(this.body, [-0.26, -1.12, 0.1], [0.2, 0.07, 0.32], legColor);
    this.parts.rightFoot = addSphere(this.body, [0.26, -1.12, 0.1], [0.2, 0.07, 0.32], legColor);
  }

  buildEquipment() {
    const ids = this.equipmentIds;

    if (ids.includes("mat")) {
      this.props.mat = addBox(this.propGroup, [0, -1.14, 0], [1.7, 0.025, 1.18], "#68bfa3", { opacity: 0.45 });
    }

    if (ids.includes("bench") || ids.includes("roman-chair")) {
      this.props.bench = addBox(this.propGroup, [0, -0.55, -0.15], [1.15, 0.1, 0.54], "#5b6660");
      this.props.bench.rotation.z = this.pattern === "hinge" ? -0.25 : 0;
      addCylinder(this.propGroup, [-0.42, -0.82, -0.15], 0.035, 0.035, 0.52, metal);
      addCylinder(this.propGroup, [0.42, -0.82, -0.15], 0.035, 0.035, 0.52, metal);
    }

    if (ids.includes("box") || ids.includes("step")) {
      this.props.box = addBox(this.propGroup, [0, -0.92, -0.72], [0.86, 0.36, 0.64], "#b9c5bd");
    }

    if (ids.includes("wall")) {
      this.props.wall = addBox(this.propGroup, [0, 0.35, -1.05], [1.9, 1.85, 0.035], "#c9d6cf", { opacity: 0.75 });
    }

    if (ids.includes("pull-up-bar") || ids.includes("towel")) {
      addCylinder(this.propGroup, [-1.05, 0.36, -0.45], 0.035, 0.035, 2.65, metal);
      addCylinder(this.propGroup, [1.05, 0.36, -0.45], 0.035, 0.035, 2.65, metal);
      this.props.pullBar = addCylinder(this.propGroup, [0, 1.68, -0.45], 0.035, 0.035, 2.2, metal, { rotation: [0, 0, Math.PI / 2] });
      if (ids.includes("towel")) {
        this.props.towel = addBox(this.propGroup, [0, 1.2, -0.43], [0.14, 0.72, 0.025], "#f7faf7");
      }
    }

    if (ids.includes("cable") || ids.includes("machine")) {
      addCylinder(this.propGroup, [-1.35, 0.28, -0.45], 0.04, 0.04, 2.7, metal);
      addBox(this.propGroup, [-1.35, -1.04, -0.45], [0.32, 0.2, 0.28], metal);
      addTorus(this.propGroup, [-1.35, 1.42, -0.45], 0.12, 0.018, metal, { rotation: [Math.PI / 2, 0, 0] });
      this.props.cableLine = segmentMesh("#222", 0.012);
      this.propGroup.add(this.props.cableLine);
    }

    if (ids.includes("band") || ids.includes("anchor")) {
      this.props.bandLine = segmentMesh("#df6a9c", 0.018);
      this.propGroup.add(this.props.bandLine);
      this.props.anchor = addSphere(this.propGroup, [0, -1.1, -0.55], [0.08, 0.08, 0.08], "#df6a9c");
    }

    if (ids.includes("barbell") || ids.includes("ez-bar")) {
      this.props.barbell = addCylinder(this.propGroup, [0, 0.12, 0.28], 0.025, 0.025, 1.58, metal, { rotation: [0, 0, Math.PI / 2] });
      this.props.leftPlate = addCylinder(this.propGroup, [-0.9, 0.12, 0.28], 0.16, 0.16, 0.08, rubber, { rotation: [0, 0, Math.PI / 2] });
      this.props.rightPlate = addCylinder(this.propGroup, [0.9, 0.12, 0.28], 0.16, 0.16, 0.08, rubber, { rotation: [0, 0, Math.PI / 2] });
    }

    if (ids.includes("dumbbells")) {
      this.props.leftDumbbell = this.createDumbbell(-0.65, 0.15, 0.22);
      this.props.rightDumbbell = this.createDumbbell(0.65, 0.15, 0.22);
    }

    if (ids.includes("kettlebell")) {
      this.props.kettlebell = new THREE.Group();
      addSphere(this.props.kettlebell, [0, 0, 0], [0.18, 0.18, 0.18], rubber);
      addTorus(this.props.kettlebell, [0, 0.2, 0], 0.15, 0.025, rubber);
      this.propGroup.add(this.props.kettlebell);
    }

    if (ids.includes("ab-wheel")) {
      this.props.abWheel = new THREE.Group();
      addCylinder(this.props.abWheel, [0, 0, 0], 0.22, 0.22, 0.12, rubber, { rotation: [Math.PI / 2, 0, 0] });
      addCylinder(this.props.abWheel, [0, 0, 0], 0.025, 0.025, 0.72, metal, { rotation: [0, 0, Math.PI / 2] });
      this.propGroup.add(this.props.abWheel);
    }

    if (ids.includes("landmine")) {
      this.props.landmine = addCylinder(this.propGroup, [0.45, -0.55, 0.1], 0.025, 0.025, 1.6, metal, { rotation: [0.95, 0, -0.55] });
      addSphere(this.propGroup, [-0.25, -1.04, -0.45], [0.12, 0.12, 0.12], metal);
    }

    if (ids.includes("ball")) {
      this.props.ball = addSphere(this.propGroup, [0, -0.8, -0.35], [0.36, 0.36, 0.36], "#8fd3ff", { opacity: 0.86 });
    }

    if (ids.includes("wedge")) {
      this.props.wedge = addBox(this.propGroup, [0, -1.08, 0.26], [0.84, 0.1, 0.38], "#d49b2a", { rotation: [-0.2, 0, 0] });
    }

    if (ids.includes("neck-harness")) {
      this.props.neckHarness = addTorus(this.propGroup, [0, 1.54, 0.02], 0.23, 0.018, rubber, { rotation: [Math.PI / 2, 0, 0] });
    }

    if (ids.includes("hand-resistance")) {
      addSphere(this.propGroup, [-0.24, 1.58, 0.24], [0.08, 0.08, 0.08], dark);
    }
  }

  createDumbbell(x, y, z) {
    const group = new THREE.Group();
    addCylinder(group, [0, 0, 0], 0.025, 0.025, 0.34, metal, { rotation: [0, 0, Math.PI / 2] });
    addCylinder(group, [-0.2, 0, 0], 0.075, 0.075, 0.06, rubber, { rotation: [0, 0, Math.PI / 2] });
    addCylinder(group, [0.2, 0, 0], 0.075, 0.075, 0.06, rubber, { rotation: [0, 0, Math.PI / 2] });
    group.position.set(x, y, z);
    this.propGroup.add(group);
    return group;
  }

  basePose(progress) {
    const p = progress;
    const bounce = Math.sin(p * Math.PI * 2) * 0.04;

    return {
      root: makePoint(0, 0.02 + bounce, 0),
      torsoLean: 0,
      shoulderY: 0.95,
      hipY: -0.04,
      headTilt: 0,
      shoulderWidth: 0.58,
      hipWidth: 0.36,
      leftElbow: makePoint(-0.72, 0.48, 0.08),
      rightElbow: makePoint(0.72, 0.48, 0.08),
      leftHand: makePoint(-0.86, 0.05, 0.2),
      rightHand: makePoint(0.86, 0.05, 0.2),
      leftKnee: makePoint(-0.28, -0.62, 0.08),
      rightKnee: makePoint(0.28, -0.62, 0.08),
      leftAnkle: makePoint(-0.28, -1.1, 0.04),
      rightAnkle: makePoint(0.28, -1.1, 0.04),
      leftFoot: makePoint(-0.28, -1.14, 0.24),
      rightFoot: makePoint(0.28, -1.14, 0.24)
    };
  }

  poseFor(progress) {
    const pose = this.basePose(progress);
    const phase = (1 - Math.cos(progress * Math.PI * 2)) / 2;
    const swing = Math.sin(progress * Math.PI * 2);

    if (this.pattern === "press") {
      pose.leftElbow = makePoint(-0.6, 0.72 + phase * 0.34, 0.24);
      pose.rightElbow = makePoint(0.6, 0.72 + phase * 0.34, 0.24);
      pose.leftHand = makePoint(-0.42, 0.28 + phase * 0.9, 0.36);
      pose.rightHand = makePoint(0.42, 0.28 + phase * 0.9, 0.36);
      pose.root.y -= 0.04;
    }

    if (this.pattern === "pull") {
      pose.leftElbow = makePoint(-0.54, 0.98 - phase * 0.28, 0.08);
      pose.rightElbow = makePoint(0.54, 0.98 - phase * 0.28, 0.08);
      pose.leftHand = makePoint(-0.72, 1.46 - phase * 0.56, -0.2);
      pose.rightHand = makePoint(0.72, 1.46 - phase * 0.56, -0.2);
      pose.root.y = -0.02 + phase * 0.18;
    }

    if (this.pattern === "curl") {
      pose.leftElbow = makePoint(-0.55, 0.48, 0.16);
      pose.rightElbow = makePoint(0.55, 0.48, 0.16);
      pose.leftHand = makePoint(-0.45, 0.06 + phase * 0.6, 0.28);
      pose.rightHand = makePoint(0.45, 0.06 + phase * 0.6, 0.28);
    }

    if (this.pattern === "raise") {
      pose.leftElbow = makePoint(-0.7 - phase * 0.22, 0.52 + phase * 0.32, 0.06);
      pose.rightElbow = makePoint(0.7 + phase * 0.22, 0.52 + phase * 0.32, 0.06);
      pose.leftHand = makePoint(-0.86 - phase * 0.34, 0.16 + phase * 0.68, 0.12);
      pose.rightHand = makePoint(0.86 + phase * 0.34, 0.16 + phase * 0.68, 0.12);
    }

    if (this.pattern === "squat") {
      pose.root.y -= phase * 0.38;
      pose.leftKnee = makePoint(-0.36, -0.62 - phase * 0.08, 0.42);
      pose.rightKnee = makePoint(0.36, -0.62 - phase * 0.08, 0.42);
      pose.leftAnkle = makePoint(-0.32, -1.1, 0.08);
      pose.rightAnkle = makePoint(0.32, -1.1, 0.08);
      pose.leftHand = makePoint(-0.44, 0.56 - phase * 0.22, 0.34);
      pose.rightHand = makePoint(0.44, 0.56 - phase * 0.22, 0.34);
      pose.leftElbow = makePoint(-0.68, 0.72 - phase * 0.18, 0.2);
      pose.rightElbow = makePoint(0.68, 0.72 - phase * 0.18, 0.2);
    }

    if (this.pattern === "hinge") {
      pose.torsoLean = phase * 0.52;
      pose.root.z += phase * 0.22;
      pose.leftKnee = makePoint(-0.28, -0.62, 0.12);
      pose.rightKnee = makePoint(0.28, -0.62, 0.12);
      pose.leftHand = makePoint(-0.42, -0.34 - phase * 0.32, 0.4);
      pose.rightHand = makePoint(0.42, -0.34 - phase * 0.32, 0.4);
      pose.leftElbow = makePoint(-0.55, 0.32 - phase * 0.28, 0.24);
      pose.rightElbow = makePoint(0.55, 0.32 - phase * 0.28, 0.24);
    }

    if (this.pattern === "core") {
      pose.root.y = -0.7 + Math.abs(swing) * 0.04;
      pose.torsoLean = Math.PI / 2.2;
      pose.leftHand = makePoint(-0.7 + swing * 0.18, -0.35, 0.52);
      pose.rightHand = makePoint(0.7 - swing * 0.18, -0.35, 0.52);
      pose.leftElbow = makePoint(-0.52, -0.28, 0.3);
      pose.rightElbow = makePoint(0.52, -0.28, 0.3);
      pose.leftKnee = makePoint(-0.36, -0.88, 0.42 + swing * 0.2);
      pose.rightKnee = makePoint(0.36, -0.88, 0.42 - swing * 0.2);
    }

    if (this.pattern === "carry") {
      pose.root.x += swing * 0.16;
      pose.leftHand = makePoint(-0.72, -0.2, 0.2);
      pose.rightHand = makePoint(0.72, -0.2, 0.2);
      pose.leftElbow = makePoint(-0.62, 0.42, 0.1);
      pose.rightElbow = makePoint(0.62, 0.42, 0.1);
      pose.leftKnee.y += Math.max(0, swing) * 0.12;
      pose.rightKnee.y += Math.max(0, -swing) * 0.12;
    }

    if (this.pattern === "calf") {
      pose.root.y += phase * 0.22;
      pose.leftFoot.y += phase * 0.03;
      pose.rightFoot.y += phase * 0.03;
    }

    if (this.pattern === "ankle") {
      pose.leftFoot.z += swing * 0.16;
      pose.rightFoot.z -= swing * 0.16;
      pose.leftHand = makePoint(-0.58, 0.24, 0.22);
      pose.rightHand = makePoint(0.58, 0.24, 0.22);
    }

    if (this.pattern === "neck") {
      pose.headTilt = swing * 0.18;
      pose.leftHand = makePoint(-0.2, 1.48, 0.28);
      pose.rightHand = makePoint(0.48, 0.68, 0.14);
      pose.leftElbow = makePoint(-0.48, 1.18, 0.18);
      pose.rightElbow = makePoint(0.62, 0.48, 0.08);
    }

    return pose;
  }

  applyPose(pose) {
    const root = pose.root;
    const shoulderCenter = makePoint(root.x, pose.shoulderY + root.y, root.z);
    const hipCenter = makePoint(root.x, pose.hipY + root.y, root.z);
    const lean = pose.torsoLean;

    shoulderCenter.z += Math.sin(lean) * 0.38;
    shoulderCenter.y -= (1 - Math.cos(lean)) * 0.18;

    const leftShoulder = shoulderCenter.clone().add(makePoint(-pose.shoulderWidth, 0, 0));
    const rightShoulder = shoulderCenter.clone().add(makePoint(pose.shoulderWidth, 0, 0));
    const leftHip = hipCenter.clone().add(makePoint(-pose.hipWidth, 0, 0));
    const rightHip = hipCenter.clone().add(makePoint(pose.hipWidth, 0, 0));
    const neck = shoulderCenter.clone().add(makePoint(0, 0.24, 0.03));
    const head = neck.clone().add(makePoint(Math.sin(pose.headTilt) * 0.08, 0.42, Math.cos(pose.headTilt) * 0.03));

    const leftElbow = pose.leftElbow.clone().add(root);
    const rightElbow = pose.rightElbow.clone().add(root);
    const leftHand = pose.leftHand.clone().add(root);
    const rightHand = pose.rightHand.clone().add(root);
    const leftKnee = pose.leftKnee.clone().add(root);
    const rightKnee = pose.rightKnee.clone().add(root);
    const leftAnkle = pose.leftAnkle.clone().add(root);
    const rightAnkle = pose.rightAnkle.clone().add(root);
    const leftFoot = pose.leftFoot.clone().add(root);
    const rightFoot = pose.rightFoot.clone().add(root);

    this.parts.torso.position.copy(shoulderCenter.clone().lerp(hipCenter, 0.5));
    this.parts.torso.rotation.x = lean;
    this.parts.pelvis.position.copy(hipCenter);
    this.parts.head.position.copy(head);
    this.parts.head.rotation.z = pose.headTilt;

    placeSegment(this.parts.neck, shoulderCenter, neck, 0.085);
    placeSegment(this.parts.leftUpperArm, leftShoulder, leftElbow, 0.08);
    placeSegment(this.parts.leftForearm, leftElbow, leftHand, 0.065);
    placeSegment(this.parts.rightUpperArm, rightShoulder, rightElbow, 0.08);
    placeSegment(this.parts.rightForearm, rightElbow, rightHand, 0.065);
    placeSegment(this.parts.leftThigh, leftHip, leftKnee, 0.1);
    placeSegment(this.parts.leftShin, leftKnee, leftAnkle, 0.075);
    placeSegment(this.parts.rightThigh, rightHip, rightKnee, 0.1);
    placeSegment(this.parts.rightShin, rightKnee, rightAnkle, 0.075);

    this.parts.leftHand.position.copy(leftHand);
    this.parts.rightHand.position.copy(rightHand);
    this.parts.leftFoot.position.copy(leftFoot);
    this.parts.rightFoot.position.copy(rightFoot);
    this.parts.leftFoot.rotation.x = this.pattern === "ankle" ? Math.sin(this.clock.elapsedTime * 4) * 0.3 : 0.08;
    this.parts.rightFoot.rotation.x = this.pattern === "ankle" ? -Math.sin(this.clock.elapsedTime * 4) * 0.3 : 0.08;

    this.lastPose = { leftHand, rightHand, head, shoulderCenter, hipCenter };
  }

  updateEquipment(progress) {
    if (!this.lastPose) return;
    const { leftHand, rightHand, head } = this.lastPose;
    const midpoint = leftHand.clone().add(rightHand).multiplyScalar(0.5);

    if (this.props.leftDumbbell) {
      this.props.leftDumbbell.position.copy(leftHand);
      this.props.rightDumbbell.position.copy(rightHand);
    }

    if (this.props.kettlebell) {
      this.props.kettlebell.position.copy(midpoint.clone().add(makePoint(0, -0.14, 0.05)));
    }

    if (this.props.barbell) {
      this.props.barbell.position.copy(midpoint);
      this.props.leftPlate.position.copy(midpoint.clone().add(makePoint(-0.9, 0, 0)));
      this.props.rightPlate.position.copy(midpoint.clone().add(makePoint(0.9, 0, 0)));
    }

    if (this.props.cableLine) {
      placeSegment(this.props.cableLine, makePoint(-1.35, 1.42, -0.45), midpoint, 0.012);
    }

    if (this.props.bandLine) {
      const anchor = this.pattern === "neck" ? makePoint(-0.9, 1.45, -0.4) : makePoint(0, -1.1, -0.55);
      const target = this.pattern === "neck" ? head : midpoint;
      placeSegment(this.props.bandLine, anchor, target, 0.018);
    }

    if (this.props.abWheel) {
      this.props.abWheel.position.copy(midpoint.clone().add(makePoint(0, -0.08, 0.2)));
      this.props.abWheel.rotation.x = progress * Math.PI * 4;
    }

    if (this.props.landmine) {
      this.props.landmine.position.copy(midpoint.clone().lerp(makePoint(-0.25, -1.04, -0.45), 0.45));
    }

    if (this.props.neckHarness) {
      this.props.neckHarness.position.copy(head.clone().add(makePoint(0, -0.05, 0)));
      this.props.neckHarness.rotation.z = Math.sin(progress * Math.PI * 2) * 0.16;
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 260);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    const progress = (elapsed % 2.2) / 2.2;
    const pose = this.poseFor(progress);
    this.applyPose(pose);
    this.updateEquipment(progress);
    this.body.rotation.y = -0.12 + Math.sin(elapsed * 0.6) * 0.05;
    this.propGroup.rotation.y = this.body.rotation.y;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
    this.container.replaceChildren();
  }
}
