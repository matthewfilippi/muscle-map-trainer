import * as THREE from "../node_modules/three/build/three.module.js";

const yAxis = new THREE.Vector3(0, 1, 0);
const xAxis = new THREE.Vector3(1, 0, 0);
const zAxis = new THREE.Vector3(0, 0, 1);
const skin = "#d8d1c8";
const dark = "#26342e";
const metal = "#6b7470";
const rubber = "#2f3337";
const equipmentAccent = "#3578bf";

function mix(start, end, amount) {
  return start + (end - start) * amount;
}

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

function normalizedDirection(vector, fallback = zAxis) {
  const direction = vector?.clone?.() ?? fallback.clone();
  if (direction.lengthSq() < 0.0001) return fallback.clone();
  return direction.normalize();
}

function orientLocalXAxis(object, direction) {
  object.quaternion.setFromUnitVectors(xAxis, normalizedDirection(direction));
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
    this.variant = options.variant ?? options.pattern;
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

    const jointColor = "#1f2c28";

    this.parts.torso = addSphere(this.body, [0, 0.65, 0], [0.45, 0.78, 0.26], torsoColor, { opacity: 0.9 });
    this.parts.ribcage = addSphere(this.body, [0, 0.78, 0.03], [0.38, 0.42, 0.22], torsoColor, { opacity: 0.42 });
    this.parts.abdomen = addSphere(this.body, [0, 0.25, 0.02], [0.3, 0.28, 0.18], skin, { opacity: 0.48 });
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
    this.parts.leftPalm = addSphere(this.body, [-0.65, 0.3, 0], [0.11, 0.055, 0.09], "#17231f");
    this.parts.rightPalm = addSphere(this.body, [0.65, 0.3, 0], [0.11, 0.055, 0.09], "#17231f");
    this.parts.leftThumb = addSphere(this.body, [-0.65, 0.3, 0], [0.035, 0.035, 0.035], "#0f1916");
    this.parts.rightThumb = addSphere(this.body, [0.65, 0.3, 0], [0.035, 0.035, 0.035], "#0f1916");
    this.parts.leftGrip = segmentMesh("#111b17", 0.018);
    this.parts.rightGrip = segmentMesh("#111b17", 0.018);
    this.body.add(this.parts.leftGrip);
    this.body.add(this.parts.rightGrip);
    this.parts.leftFoot = addSphere(this.body, [-0.26, -1.12, 0.1], [0.2, 0.07, 0.32], legColor);
    this.parts.rightFoot = addSphere(this.body, [0.26, -1.12, 0.1], [0.2, 0.07, 0.32], legColor);

    [
      "leftShoulderJoint",
      "rightShoulderJoint",
      "leftElbowJoint",
      "rightElbowJoint",
      "leftWristJoint",
      "rightWristJoint",
      "leftHipJoint",
      "rightHipJoint",
      "leftKneeJoint",
      "rightKneeJoint",
      "leftAnkleJoint",
      "rightAnkleJoint"
    ].forEach((key) => {
      this.parts[key] = addSphere(this.body, [0, 0, 0], [0.045, 0.045, 0.045], jointColor, { opacity: 0.88 });
    });
  }

  buildEquipment() {
    const ids = this.equipmentIds;
    const variant = this.variant;
    const is = (...variants) => variants.includes(variant);

    if (ids.includes("mat") || is("deadBug", "frontPlank", "sidePlank", "birdDog", "gluteBridge", "abWheelRollout")) {
      const matZ = is("deadBug", "gluteBridge", "ballLegCurl") ? 0.35 : 0.2;
      this.props.mat = addBox(this.propGroup, [0, -1.15, matZ], [1.9, 0.025, 1.35], "#68bfa3", { opacity: 0.45 });
    }

    if (ids.includes("bench") || ids.includes("roman-chair")) {
      let benchPosition = [0, -0.55, -0.15];
      let benchScale = [1.15, 0.1, 0.54];
      let benchRotation = [0, 0, 0];

      if (is("benchPressDumbbell", "benchPressBarbell", "closeGripBenchPress")) {
        benchPosition = [0, -0.72, 0.48];
        benchScale = [1.16, 0.09, 0.92];
      }

      if (is("inclineDumbbellCurl", "proneYRaise", "proneNeckExtension")) {
        benchPosition = [0, -0.6, 0.2];
        benchScale = [1.12, 0.08, 0.82];
        benchRotation = [-0.42, 0, 0];
      }

      if (is("benchDip")) {
        benchPosition = [0, -0.5, -0.34];
        benchScale = [1.2, 0.12, 0.44];
      }

      if (is("seatedOverheadPress", "wristCurl")) {
        benchPosition = [0, -0.68, 0.0];
        benchScale = [0.82, 0.12, 0.72];
      }

      if (is("hipThrust")) {
        benchPosition = [0, -0.68, -0.48];
        benchScale = [1.18, 0.12, 0.48];
      }

      if (is("splitSquat")) {
        benchPosition = [0.42, -0.84, -0.54];
        benchScale = [0.72, 0.12, 0.46];
      }

      if (is("backExtension") || ids.includes("roman-chair")) {
        benchPosition = [0, -0.72, 0.08];
        benchScale = [0.92, 0.1, 0.56];
        benchRotation = [-0.38, 0, 0];
      }

      this.props.bench = addBox(this.propGroup, benchPosition, benchScale, "#5b6660", { rotation: benchRotation });
      addCylinder(this.propGroup, [benchPosition[0] - 0.42, -0.92, benchPosition[2] - 0.18], 0.035, 0.035, 0.52, metal);
      addCylinder(this.propGroup, [benchPosition[0] + 0.42, -0.92, benchPosition[2] + 0.18], 0.035, 0.035, 0.52, metal);

      if (is("backExtension")) {
        this.props.romanFootPad = addCylinder(this.propGroup, [0, -0.96, -0.58], 0.055, 0.055, 1.04, rubber, {
          rotation: [0, 0, Math.PI / 2]
        });
      }
    }

    if (ids.includes("box") || ids.includes("step")) {
      let boxPosition = [0, -0.92, -0.72];
      let boxScale = [0.86, 0.36, 0.64];

      if (is("stepUp")) {
        boxPosition = [0.22, -0.9, 0.22];
        boxScale = [0.74, 0.32, 0.55];
      }

      if (is("boxSquat")) {
        boxPosition = [0, -0.88, -0.38];
        boxScale = [0.92, 0.34, 0.58];
      }

      if (is("standingCalfRaise", "singleLegCalfRaise")) {
        boxPosition = [0, -1.13, 0.28];
        boxScale = [0.92, 0.06, 0.46];
      }

      this.props.box = addBox(this.propGroup, boxPosition, boxScale, "#b9c5bd");
    }

    if (ids.includes("wall")) {
      const wallZ = is("wallSlide", "tibialisRaise") ? -0.34 : -0.95;
      this.props.wall = addBox(this.propGroup, [0, 0.35, wallZ], [2.05, 1.9, 0.035], "#c9d6cf", { opacity: 0.75 });
    }

    if (ids.includes("pull-up-bar") || ids.includes("towel")) {
      addCylinder(this.propGroup, [-1.05, 0.36, -0.45], 0.035, 0.035, 2.65, metal);
      addCylinder(this.propGroup, [1.05, 0.36, -0.45], 0.035, 0.035, 2.65, metal);
      this.props.pullBar = addCylinder(this.propGroup, [0, 1.68, -0.45], 0.035, 0.035, 2.2, metal, { rotation: [0, 0, Math.PI / 2] });
      if (ids.includes("towel")) {
        this.props.towel = addBox(this.propGroup, [0, 1.2, -0.43], [0.14, 0.72, 0.025], "#f7faf7");
      }
    }

    if (ids.includes("cable")) {
      addCylinder(this.propGroup, [-1.35, 0.28, -0.45], 0.04, 0.04, 2.7, metal);
      addBox(this.propGroup, [-1.35, -1.04, -0.45], [0.32, 0.2, 0.28], metal);
      addTorus(this.propGroup, [-1.35, 1.42, -0.45], 0.12, 0.018, metal, { rotation: [Math.PI / 2, 0, 0] });
      this.props.cableLine = segmentMesh("#222", 0.012);
      this.propGroup.add(this.props.cableLine);

      if (is("cableFly")) {
        addCylinder(this.propGroup, [1.35, 0.28, -0.45], 0.04, 0.04, 2.7, metal);
        addBox(this.propGroup, [1.35, -1.04, -0.45], [0.32, 0.2, 0.28], metal);
        addTorus(this.propGroup, [1.35, 1.42, -0.45], 0.12, 0.018, metal, { rotation: [Math.PI / 2, 0, 0] });
        this.props.cableLineRight = segmentMesh("#222", 0.012);
        this.propGroup.add(this.props.cableLineRight);
      }
    }

    if (ids.includes("machine")) {
      const seatPosition = is("donkeyCalfRaise") ? [0, -0.44, 0.44] : [0, -0.7, 0.05];
      const seatScale = is("donkeyCalfRaise") ? [0.92, 0.1, 0.5] : [0.82, 0.1, 0.62];
      this.props.machineSeat = addBox(this.propGroup, seatPosition, seatScale, "#7a8680", {
        rotation: is("donkeyCalfRaise") ? [-0.55, 0, 0] : [0, 0, 0]
      });
      this.props.machinePad = addCylinder(this.propGroup, [0, -0.74, 0.72], 0.06, 0.06, 0.88, rubber, {
        rotation: [0, 0, Math.PI / 2]
      });
    }

    if (ids.includes("band") || ids.includes("anchor")) {
      this.props.bandLine = segmentMesh("#df6a9c", 0.018);
      this.propGroup.add(this.props.bandLine);
      let anchor = [0, -1.1, -0.55];
      if (is("latPulldown")) anchor = [0, 1.68, -0.5];
      if (is("bandNeckRotation")) anchor = [-1.05, 1.45, -0.36];
      if (is("ankleEversion")) anchor = [-0.88, -1.05, 0.34];
      this.props.anchor = addSphere(this.propGroup, anchor, [0.08, 0.08, 0.08], "#df6a9c");
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
    addCylinder(group, [0, 0, 0], 0.027, 0.027, 0.42, metal, { rotation: [0, 0, Math.PI / 2] });
    addCylinder(group, [-0.25, 0, 0], 0.085, 0.085, 0.075, rubber, { rotation: [0, 0, Math.PI / 2] });
    addCylinder(group, [0.25, 0, 0], 0.085, 0.085, 0.075, rubber, { rotation: [0, 0, Math.PI / 2] });
    group.position.set(x, y, z);
    this.propGroup.add(group);
    return group;
  }

  basePose() {
    return {
      root: makePoint(0, 0.02, 0),
      torsoLean: 0,
      shoulderY: 0.95,
      shoulderZ: 0,
      hipY: -0.04,
      hipZ: 0,
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
      rightFoot: makePoint(0.28, -1.14, 0.24),
      leftGripAxis: makePoint(0, 0, 1),
      rightGripAxis: makePoint(0, 0, 1)
    };
  }

  poseForVariant(pose, phase, swing, progress) {
    const variant = this.variant;
    const is = (...variants) => variants.includes(variant);
    const step = (swing + 1) / 2;

    if (is("wallSlide")) {
      pose.root.z = -0.03;
      pose.shoulderZ = -0.18;
      pose.hipZ = -0.16;
      pose.leftElbow = makePoint(-0.48, 0.82 + phase * 0.28, -0.31);
      pose.rightElbow = makePoint(0.48, 0.82 + phase * 0.28, -0.31);
      pose.leftHand = makePoint(-0.64 + phase * 0.2, 1.08 + phase * 0.46, -0.32);
      pose.rightHand = makePoint(0.64 - phase * 0.2, 1.08 + phase * 0.46, -0.32);
      return pose;
    }

    if (is("lateralRaise")) {
      pose.root.y = 0.02;
      pose.torsoLean = 0;
      pose.shoulderY = 0.95;
      pose.hipY = -0.04;
      pose.leftElbow = makePoint(mix(-0.6, -0.84, phase), mix(0.36, 0.9, phase), mix(0.1, 0.14, phase));
      pose.rightElbow = makePoint(mix(0.6, 0.84, phase), mix(0.36, 0.9, phase), mix(0.1, 0.14, phase));
      pose.leftHand = makePoint(mix(-0.68, -1.06, phase), mix(0.02, 0.8, phase), mix(0.2, 0.14, phase));
      pose.rightHand = makePoint(mix(0.68, 1.06, phase), mix(0.02, 0.8, phase), mix(0.2, 0.14, phase));
      pose.leftGripAxis = makePoint(0, 0, 1);
      pose.rightGripAxis = makePoint(0, 0, 1);
      return pose;
    }

    if (is("benchDip")) {
      pose.root.y = -0.18 - phase * 0.18;
      pose.shoulderY = 0.68;
      pose.hipY = -0.22;
      pose.shoulderZ = 0.06;
      pose.hipZ = 0.25;
      pose.torsoLean = 0.14;
      pose.leftHand = makePoint(-0.42, -0.32, -0.34);
      pose.rightHand = makePoint(0.42, -0.32, -0.34);
      pose.leftElbow = makePoint(-0.5, 0.1 - phase * 0.18, -0.22);
      pose.rightElbow = makePoint(0.5, 0.1 - phase * 0.18, -0.22);
      pose.leftKnee = makePoint(-0.26, -0.68, 0.68);
      pose.rightKnee = makePoint(0.26, -0.68, 0.68);
      pose.leftAnkle = makePoint(-0.28, -1.06, 1.0);
      pose.rightAnkle = makePoint(0.28, -1.06, 1.0);
      pose.leftFoot = makePoint(-0.28, -1.1, 1.22);
      pose.rightFoot = makePoint(0.28, -1.1, 1.22);
      return pose;
    }

    if (is("benchPressDumbbell", "benchPressBarbell", "closeGripBenchPress")) {
      const grip = is("closeGripBenchPress") ? 0.28 : 0.46;
      pose.root.y = -0.44;
      pose.torsoLean = Math.PI / 2;
      pose.shoulderY = 0.04;
      pose.hipY = 0.0;
      pose.shoulderZ = 0.08;
      pose.hipZ = 0.7;
      pose.neckOffset = makePoint(0, 0.02, -0.18);
      pose.headOffset = makePoint(0, 0.03, -0.28);
      pose.leftElbow = makePoint(-0.58, -0.12 + phase * 0.26, 0.22);
      pose.rightElbow = makePoint(0.58, -0.12 + phase * 0.26, 0.22);
      pose.leftHand = makePoint(-grip, -0.04 + phase * 0.56, 0.18);
      pose.rightHand = makePoint(grip, -0.04 + phase * 0.56, 0.18);
      pose.leftKnee = makePoint(-0.28, -0.48, 0.95);
      pose.rightKnee = makePoint(0.28, -0.48, 0.95);
      pose.leftAnkle = makePoint(-0.34, -1.02, 1.12);
      pose.rightAnkle = makePoint(0.34, -1.02, 1.12);
      pose.leftFoot = makePoint(-0.34, -1.1, 1.28);
      pose.rightFoot = makePoint(0.34, -1.1, 1.28);
      return pose;
    }

    if (is("inclinePushUp")) {
      pose.root.y = -0.36 - phase * 0.08;
      pose.torsoLean = Math.PI / 2.35;
      pose.shoulderY = 0.18 - phase * 0.12;
      pose.hipY = -0.12 - phase * 0.04;
      pose.shoulderZ = -0.02;
      pose.hipZ = 0.82;
      pose.neckOffset = makePoint(0, 0.02, -0.1);
      pose.headOffset = makePoint(0, 0.03, -0.26);
      pose.leftHand = makePoint(-0.36, -0.16, -0.34);
      pose.rightHand = makePoint(0.36, -0.16, -0.34);
      pose.leftElbow = makePoint(-0.52, 0.08 - phase * 0.16, -0.12);
      pose.rightElbow = makePoint(0.52, 0.08 - phase * 0.16, -0.12);
      pose.leftKnee = makePoint(-0.24, -0.56, 1.06);
      pose.rightKnee = makePoint(0.24, -0.56, 1.06);
      pose.leftAnkle = makePoint(-0.26, -1.02, 1.32);
      pose.rightAnkle = makePoint(0.26, -1.02, 1.32);
      pose.leftFoot = makePoint(-0.26, -1.12, 1.5);
      pose.rightFoot = makePoint(0.26, -1.12, 1.5);
      return pose;
    }

    if (is("cableFly")) {
      pose.leftElbow = makePoint(mix(-0.98, -0.42, phase), 0.6, 0.18);
      pose.rightElbow = makePoint(mix(0.98, 0.42, phase), 0.6, 0.18);
      pose.leftHand = makePoint(mix(-1.22, -0.14, phase), 0.46 + phase * 0.08, 0.32);
      pose.rightHand = makePoint(mix(1.22, 0.14, phase), 0.46 + phase * 0.08, 0.32);
      return pose;
    }

    if (is("seatedOverheadPress")) {
      pose.root.y = -0.22;
      pose.hipY = -0.32;
      pose.leftKnee = makePoint(-0.32, -0.68, 0.36);
      pose.rightKnee = makePoint(0.32, -0.68, 0.36);
      pose.leftAnkle = makePoint(-0.34, -1.08, 0.45);
      pose.rightAnkle = makePoint(0.34, -1.08, 0.45);
      pose.leftElbow = makePoint(-0.52, 0.74 + phase * 0.3, 0.18);
      pose.rightElbow = makePoint(0.52, 0.74 + phase * 0.3, 0.18);
      pose.leftHand = makePoint(-0.4, 0.58 + phase * 0.78, 0.25);
      pose.rightHand = makePoint(0.4, 0.58 + phase * 0.78, 0.25);
      return pose;
    }

    if (is("landminePress")) {
      pose.root.y = -0.18;
      pose.leftKnee = makePoint(-0.28, -1.02, -0.05);
      pose.leftAnkle = makePoint(-0.28, -1.08, -0.35);
      pose.leftFoot = makePoint(-0.28, -1.12, -0.5);
      pose.rightKnee = makePoint(0.32, -0.58, 0.38);
      pose.rightAnkle = makePoint(0.32, -1.1, 0.48);
      pose.rightFoot = makePoint(0.32, -1.14, 0.66);
      pose.leftElbow = makePoint(-0.48, 0.56, 0.12);
      pose.leftHand = makePoint(-0.32, 0.26, 0.16);
      pose.rightElbow = makePoint(0.35 + phase * 0.08, 0.72 + phase * 0.3, 0.24 - phase * 0.12);
      pose.rightHand = makePoint(0.28 + phase * 0.36, 0.58 + phase * 0.62, 0.3 - phase * 0.28);
      return pose;
    }

    if (is("cablePressdown")) {
      pose.leftElbow = makePoint(-0.4, 0.5, 0.18);
      pose.rightElbow = makePoint(0.4, 0.5, 0.18);
      pose.leftHand = makePoint(-0.32, mix(0.34, -0.16, phase), 0.28);
      pose.rightHand = makePoint(0.32, mix(0.34, -0.16, phase), 0.28);
      return pose;
    }

    if (is("overheadTricepsExtension")) {
      pose.leftElbow = makePoint(-0.2, 1.26, 0.1);
      pose.rightElbow = makePoint(0.2, 1.26, 0.1);
      pose.leftHand = makePoint(-0.16, mix(0.98, 1.48, phase), mix(0.28, 0.16, phase));
      pose.rightHand = makePoint(0.16, mix(0.98, 1.48, phase), mix(0.28, 0.16, phase));
      return pose;
    }

    if (is("bandCurl", "dumbbellCurl", "reverseCurl")) {
      const handY = mix(0.02, 0.66, phase);
      pose.leftElbow = makePoint(-0.48, 0.46, 0.12);
      pose.rightElbow = makePoint(0.48, 0.46, 0.12);
      pose.leftHand = makePoint(-0.42, handY, 0.28);
      pose.rightHand = makePoint(0.42, handY, 0.28);
      return pose;
    }

    if (is("inclineDumbbellCurl")) {
      pose.root.y = -0.34;
      pose.torsoLean = 0.48;
      pose.shoulderZ = -0.04;
      pose.hipZ = 0.28;
      pose.leftElbow = makePoint(-0.48, 0.28, 0.14);
      pose.rightElbow = makePoint(0.48, 0.28, 0.14);
      pose.leftHand = makePoint(-0.54, mix(-0.18, 0.42, phase), 0.32);
      pose.rightHand = makePoint(0.54, mix(-0.18, 0.42, phase), 0.32);
      pose.leftKnee = makePoint(-0.3, -0.62, 0.46);
      pose.rightKnee = makePoint(0.3, -0.62, 0.46);
      return pose;
    }

    if (is("wristCurl")) {
      pose.root.y = -0.26;
      pose.leftElbow = makePoint(-0.34, 0.06, 0.06);
      pose.rightElbow = makePoint(0.34, 0.06, 0.06);
      pose.leftHand = makePoint(-0.34, -0.1 + phase * 0.12, 0.36);
      pose.rightHand = makePoint(0.34, -0.1 + phase * 0.12, 0.36);
      return pose;
    }

    if (is("pullUp", "chinUp", "towelHang")) {
      const pullPhase = is("towelHang") ? 0 : phase;
      pose.root.y = -0.08 + pullPhase * 0.36;
      pose.leftElbow = makePoint(-0.42, 1.26 - pullPhase * 0.32, -0.18);
      pose.rightElbow = makePoint(0.42, 1.26 - pullPhase * 0.32, -0.18);
      pose.leftHand = makePoint(-0.58, 1.72 - pullPhase * 0.1, -0.43);
      pose.rightHand = makePoint(0.58, 1.72 - pullPhase * 0.1, -0.43);
      pose.leftKnee = makePoint(-0.22, -0.58 + pullPhase * 0.1, 0.1);
      pose.rightKnee = makePoint(0.22, -0.58 + pullPhase * 0.1, 0.1);
      pose.leftAnkle = makePoint(-0.22, -1.05 + pullPhase * 0.08, 0.08);
      pose.rightAnkle = makePoint(0.22, -1.05 + pullPhase * 0.08, 0.08);
      return pose;
    }

    if (is("latPulldown")) {
      pose.root.y = -0.18;
      pose.leftKnee = makePoint(-0.32, -1.04, 0.02);
      pose.rightKnee = makePoint(0.32, -1.04, 0.02);
      pose.leftAnkle = makePoint(-0.32, -1.08, -0.28);
      pose.rightAnkle = makePoint(0.32, -1.08, -0.28);
      pose.leftElbow = makePoint(-0.5, mix(1.25, 0.72, phase), -0.05);
      pose.rightElbow = makePoint(0.5, mix(1.25, 0.72, phase), -0.05);
      pose.leftHand = makePoint(-0.62, mix(1.58, 0.82, phase), -0.28);
      pose.rightHand = makePoint(0.62, mix(1.58, 0.82, phase), -0.28);
      return pose;
    }

    if (is("cableRow")) {
      pose.torsoLean = 0.18;
      pose.leftElbow = makePoint(-0.5, 0.42, 0.1);
      pose.leftHand = makePoint(-0.64, 0.16, 0.18);
      pose.rightElbow = makePoint(mix(0.64, 0.42, phase), 0.45, mix(0.4, 0.12, phase));
      pose.rightHand = makePoint(mix(0.96, 0.48, phase), 0.34, mix(0.52, 0.18, phase));
      return pose;
    }

    if (is("proneYRaise", "proneNeckExtension")) {
      pose.root.y = -0.46;
      pose.torsoLean = Math.PI / 2.15;
      pose.shoulderY = 0.1;
      pose.hipY = -0.05;
      pose.shoulderZ = -0.08;
      pose.hipZ = 0.6;
      pose.neckOffset = makePoint(0, 0.01, -0.12);
      pose.headOffset = makePoint(0, phase * 0.1, -0.25);
      pose.leftElbow = makePoint(-0.68, 0.0 + phase * 0.12, -0.2);
      pose.rightElbow = makePoint(0.68, 0.0 + phase * 0.12, -0.2);
      pose.leftHand = makePoint(-0.86, -0.02 + phase * 0.2, -0.46);
      pose.rightHand = makePoint(0.86, -0.02 + phase * 0.2, -0.46);
      pose.leftKnee = makePoint(-0.26, -0.52, 0.98);
      pose.rightKnee = makePoint(0.26, -0.52, 0.98);
      return pose;
    }

    if (is("shrug")) {
      pose.shoulderY = 0.95 + phase * 0.16;
      pose.leftHand = makePoint(-0.68, -0.12 + phase * 0.04, 0.18);
      pose.rightHand = makePoint(0.68, -0.12 + phase * 0.04, 0.18);
      pose.leftElbow = makePoint(-0.62, 0.38 + phase * 0.1, 0.1);
      pose.rightElbow = makePoint(0.62, 0.38 + phase * 0.1, 0.1);
      return pose;
    }

    if (is("facePull")) {
      pose.leftElbow = makePoint(mix(-0.46, -0.82, phase), mix(0.68, 0.9, phase), 0.1);
      pose.rightElbow = makePoint(mix(0.46, 0.82, phase), mix(0.68, 0.9, phase), 0.1);
      pose.leftHand = makePoint(mix(-0.78, -0.34, phase), mix(0.68, 1.02, phase), 0.26);
      pose.rightHand = makePoint(mix(0.78, 0.34, phase), mix(0.68, 1.02, phase), 0.26);
      return pose;
    }

    if (is("highPull")) {
      pose.leftElbow = makePoint(-0.46, mix(0.24, 0.92, phase), 0.12);
      pose.rightElbow = makePoint(0.46, mix(0.24, 0.92, phase), 0.12);
      pose.leftHand = makePoint(-0.42, mix(-0.14, 0.64, phase), 0.26);
      pose.rightHand = makePoint(0.42, mix(-0.14, 0.64, phase), 0.26);
      pose.root.y += phase * 0.08;
      return pose;
    }

    if (is("chinTuck", "neckIsometric", "bandNeckRotation", "harnessNeckExtension")) {
      pose.headTilt = is("neckIsometric") ? 0 : swing * 0.12;
      if (is("chinTuck")) {
        pose.neckOffset = makePoint(0, 0.24, -0.03 - phase * 0.08);
        pose.headOffset = makePoint(0, 0.42, -0.08 - phase * 0.1);
      }
      pose.leftHand = makePoint(-0.22, 1.48, 0.28);
      pose.rightHand = makePoint(0.48, 0.68, 0.14);
      pose.leftElbow = makePoint(-0.48, 1.18, 0.18);
      pose.rightElbow = makePoint(0.62, 0.48, 0.08);
      return pose;
    }

    if (is("birdDog")) {
      pose.root.y = -0.58;
      pose.torsoLean = Math.PI / 2;
      pose.shoulderY = 0.16;
      pose.hipY = 0.08;
      pose.shoulderZ = -0.12;
      pose.hipZ = 0.58;
      pose.neckOffset = makePoint(0, 0.02, -0.12);
      pose.headOffset = makePoint(0, 0.02, -0.25);
      pose.leftHand = makePoint(-0.38, -0.42, -0.28 - phase * 0.34);
      pose.leftElbow = makePoint(-0.42, -0.14, -0.22 - phase * 0.24);
      pose.rightHand = makePoint(0.38, -0.72, -0.2);
      pose.rightElbow = makePoint(0.42, -0.32, -0.12);
      pose.leftKnee = makePoint(-0.32, -0.72, 0.62);
      pose.leftAnkle = makePoint(-0.32, -1.0, 0.9);
      pose.leftFoot = makePoint(-0.32, -1.12, 1.04);
      pose.rightKnee = makePoint(0.32, -0.74, 0.62 + phase * 0.28);
      pose.rightAnkle = makePoint(0.32, -0.7 + phase * 0.2, 1.0 + phase * 0.4);
      pose.rightFoot = makePoint(0.32, -0.68 + phase * 0.24, 1.2 + phase * 0.44);
      return pose;
    }

    if (is("backExtension")) {
      pose.root.y = -0.34;
      pose.torsoLean = mix(1.15, 0.38, phase);
      pose.shoulderY = 0.16 + phase * 0.2;
      pose.hipY = -0.18;
      pose.shoulderZ = -0.04 + phase * 0.3;
      pose.hipZ = 0.42;
      pose.neckOffset = makePoint(0, 0.03, -0.1);
      pose.headOffset = makePoint(0, 0.04, -0.25);
      pose.leftHand = makePoint(-0.36, 0.1 + phase * 0.18, 0.16 + phase * 0.2);
      pose.rightHand = makePoint(0.36, 0.1 + phase * 0.18, 0.16 + phase * 0.2);
      pose.leftKnee = makePoint(-0.26, -0.58, 0.76);
      pose.rightKnee = makePoint(0.26, -0.58, 0.76);
      pose.leftAnkle = makePoint(-0.28, -0.98, 0.92);
      pose.rightAnkle = makePoint(0.28, -0.98, 0.92);
      return pose;
    }

    if (is("deadlift")) {
      pose.torsoLean = mix(0.86, 0.08, phase);
      pose.root.y = -0.22 + phase * 0.2;
      pose.leftKnee = makePoint(-0.34, -0.72 + phase * 0.08, 0.35);
      pose.rightKnee = makePoint(0.34, -0.72 + phase * 0.08, 0.35);
      pose.leftHand = makePoint(-0.38, mix(-0.82, -0.14, phase), 0.36);
      pose.rightHand = makePoint(0.38, mix(-0.82, -0.14, phase), 0.36);
      pose.leftElbow = makePoint(-0.48, mix(-0.28, 0.34, phase), 0.24);
      pose.rightElbow = makePoint(0.48, mix(-0.28, 0.34, phase), 0.24);
      return pose;
    }

    if (is("romanianDeadlift")) {
      pose.torsoLean = phase * 0.62;
      pose.root.z += phase * 0.2;
      pose.leftHand = makePoint(-0.38, mix(-0.12, -0.62, phase), 0.34);
      pose.rightHand = makePoint(0.38, mix(-0.12, -0.62, phase), 0.34);
      pose.leftElbow = makePoint(-0.5, mix(0.38, -0.02, phase), 0.22);
      pose.rightElbow = makePoint(0.5, mix(0.38, -0.02, phase), 0.22);
      return pose;
    }

    if (is("deadBug")) {
      pose.root.y = -0.58;
      pose.torsoLean = Math.PI / 2;
      pose.shoulderY = 0.04;
      pose.hipY = 0.0;
      pose.shoulderZ = -0.16;
      pose.hipZ = 0.44;
      pose.neckOffset = makePoint(0, 0.02, -0.12);
      pose.headOffset = makePoint(0, 0.03, -0.25);
      pose.leftElbow = makePoint(-0.28, 0.18, -0.25 - phase * 0.24);
      pose.leftHand = makePoint(-0.28, 0.2, -0.44 - phase * 0.46);
      pose.rightElbow = makePoint(0.28, 0.2, -0.2);
      pose.rightHand = makePoint(0.28, 0.42, -0.18);
      pose.leftKnee = makePoint(-0.26, 0.2, 0.5);
      pose.leftAnkle = makePoint(-0.26, -0.08, 0.8);
      pose.leftFoot = makePoint(-0.26, -0.16, 0.96);
      pose.rightKnee = makePoint(0.26, 0.18 - phase * 0.12, 0.48 + phase * 0.28);
      pose.rightAnkle = makePoint(0.26, -0.02 - phase * 0.32, 0.8 + phase * 0.44);
      pose.rightFoot = makePoint(0.26, -0.08 - phase * 0.38, 0.96 + phase * 0.54);
      return pose;
    }

    if (is("frontPlank", "abWheelRollout")) {
      pose.root.y = -0.68;
      pose.torsoLean = Math.PI / 2.05;
      pose.shoulderY = 0.08;
      pose.hipY = -0.02;
      pose.shoulderZ = mix(-0.08, 0.34, is("abWheelRollout") ? phase : 0);
      pose.hipZ = 0.76;
      pose.neckOffset = makePoint(0, 0.02, -0.12);
      pose.headOffset = makePoint(0, 0.03, -0.24);
      pose.leftElbow = makePoint(-0.34, -0.24, -0.18 + (is("abWheelRollout") ? phase * 0.42 : 0));
      pose.rightElbow = makePoint(0.34, -0.24, -0.18 + (is("abWheelRollout") ? phase * 0.42 : 0));
      pose.leftHand = makePoint(-0.32, -0.6, -0.22 + (is("abWheelRollout") ? phase * 0.62 : 0));
      pose.rightHand = makePoint(0.32, -0.6, -0.22 + (is("abWheelRollout") ? phase * 0.62 : 0));
      pose.leftKnee = makePoint(-0.22, -0.52, 0.98);
      pose.rightKnee = makePoint(0.22, -0.52, 0.98);
      pose.leftAnkle = makePoint(-0.24, -1.04, 1.3);
      pose.rightAnkle = makePoint(0.24, -1.04, 1.3);
      return pose;
    }

    if (is("cableCrunch")) {
      pose.root.y = -0.22;
      pose.torsoLean = phase * 0.8;
      pose.leftKnee = makePoint(-0.32, -1.04, 0.08);
      pose.rightKnee = makePoint(0.32, -1.04, 0.08);
      pose.leftHand = makePoint(-0.24, 1.18 - phase * 0.36, 0.2);
      pose.rightHand = makePoint(0.24, 1.18 - phase * 0.36, 0.2);
      pose.leftElbow = makePoint(-0.36, 0.88 - phase * 0.18, 0.16);
      pose.rightElbow = makePoint(0.36, 0.88 - phase * 0.18, 0.16);
      return pose;
    }

    if (is("sidePlank")) {
      pose.root.y = -0.64;
      pose.torsoLean = Math.PI / 2.05;
      pose.shoulderWidth = 0.28;
      pose.hipWidth = 0.2;
      pose.shoulderY = 0.1;
      pose.hipY = 0.0;
      pose.shoulderZ = -0.08;
      pose.hipZ = 0.62;
      pose.leftElbow = makePoint(-0.3, -0.32, -0.12);
      pose.leftHand = makePoint(-0.38, -0.74, -0.08);
      pose.rightElbow = makePoint(0.3, 0.12, 0.16);
      pose.rightHand = makePoint(0.44, 0.45, 0.2);
      pose.leftKnee = makePoint(-0.12, -0.48, 0.92);
      pose.rightKnee = makePoint(0.12, -0.46, 0.92);
      pose.leftAnkle = makePoint(-0.12, -0.98, 1.24);
      pose.rightAnkle = makePoint(0.12, -0.96, 1.24);
      return pose;
    }

    if (is("pallofPress")) {
      pose.leftElbow = makePoint(-0.28, 0.58, 0.18);
      pose.rightElbow = makePoint(0.28, 0.58, 0.18);
      pose.leftHand = makePoint(mix(-0.16, -0.34, phase), 0.5, mix(0.2, 0.54, phase));
      pose.rightHand = makePoint(mix(0.16, 0.34, phase), 0.5, mix(0.2, 0.54, phase));
      return pose;
    }

    if (is("woodChop")) {
      pose.leftElbow = makePoint(mix(-0.5, 0.1, phase), mix(1.08, 0.2, phase), 0.12);
      pose.rightElbow = makePoint(mix(-0.18, 0.48, phase), mix(0.98, 0.1, phase), 0.12);
      pose.leftHand = makePoint(mix(-0.72, 0.32, phase), mix(1.24, -0.18, phase), 0.28);
      pose.rightHand = makePoint(mix(-0.48, 0.58, phase), mix(1.2, -0.12, phase), 0.28);
      pose.root.x = mix(-0.06, 0.08, phase);
      return pose;
    }

    if (is("gluteBridge", "hipThrust", "ballLegCurl")) {
      pose.root.y = -0.62 + phase * 0.2;
      pose.torsoLean = Math.PI / 2;
      pose.shoulderY = is("hipThrust") ? -0.03 : 0.0;
      pose.hipY = mix(-0.26, 0.05, phase);
      pose.shoulderZ = is("hipThrust") ? -0.26 : -0.06;
      pose.hipZ = 0.52;
      pose.neckOffset = makePoint(0, 0.02, -0.12);
      pose.headOffset = makePoint(0, 0.03, -0.25);
      pose.leftKnee = makePoint(-0.32, -0.42 + phase * 0.2, 0.86 - (is("ballLegCurl") ? phase * 0.42 : 0));
      pose.rightKnee = makePoint(0.32, -0.42 + phase * 0.2, 0.86 - (is("ballLegCurl") ? phase * 0.42 : 0));
      pose.leftAnkle = makePoint(-0.32, -1.0 + phase * 0.18, 1.08 - (is("ballLegCurl") ? phase * 0.6 : 0));
      pose.rightAnkle = makePoint(0.32, -1.0 + phase * 0.18, 1.08 - (is("ballLegCurl") ? phase * 0.6 : 0));
      pose.leftHand = makePoint(-0.44, -0.62, 0.34);
      pose.rightHand = makePoint(0.44, -0.62, 0.34);
      return pose;
    }

    if (is("stepUp")) {
      pose.root.y = -0.1 + phase * 0.24;
      pose.leftKnee = makePoint(-0.22, mix(-0.76, -0.42, phase), 0.3);
      pose.leftAnkle = makePoint(-0.22, mix(-1.04, -0.78, phase), 0.34);
      pose.leftFoot = makePoint(-0.22, mix(-1.08, -0.84, phase), 0.48);
      pose.rightKnee = makePoint(0.32, -0.54 + phase * 0.04, 0.34);
      pose.rightAnkle = makePoint(0.32, -1.1 + phase * 0.24, 0.54);
      return pose;
    }

    if (is("splitSquat")) {
      pose.root.y = -0.02 - phase * 0.28;
      pose.leftKnee = makePoint(-0.24, -0.58 - phase * 0.08, 0.44);
      pose.leftAnkle = makePoint(-0.24, -1.08, 0.5);
      pose.leftFoot = makePoint(-0.24, -1.14, 0.66);
      pose.rightKnee = makePoint(0.36, -0.82 - phase * 0.1, -0.22);
      pose.rightAnkle = makePoint(0.42, -0.92, -0.52);
      pose.rightFoot = makePoint(0.42, -0.88, -0.66);
      pose.leftHand = makePoint(-0.72, -0.18, 0.2);
      pose.rightHand = makePoint(0.72, -0.18, 0.2);
      return pose;
    }

    if (is("boxSquat", "gobletSquat", "frontSquat", "cyclistSquat")) {
      pose.root.y -= phase * 0.34;
      pose.leftKnee = makePoint(-0.34, -0.62 - phase * 0.1, 0.42 + phase * 0.04);
      pose.rightKnee = makePoint(0.34, -0.62 - phase * 0.1, 0.42 + phase * 0.04);
      if (is("gobletSquat")) {
        pose.leftHand = makePoint(-0.14, 0.5 - phase * 0.18, 0.34);
        pose.rightHand = makePoint(0.14, 0.5 - phase * 0.18, 0.34);
        pose.leftElbow = makePoint(-0.34, 0.54 - phase * 0.16, 0.22);
        pose.rightElbow = makePoint(0.34, 0.54 - phase * 0.16, 0.22);
      } else if (is("frontSquat")) {
        pose.leftHand = makePoint(-0.42, 0.84 - phase * 0.3, 0.2);
        pose.rightHand = makePoint(0.42, 0.84 - phase * 0.3, 0.2);
        pose.leftElbow = makePoint(-0.62, 0.88 - phase * 0.22, 0.3);
        pose.rightElbow = makePoint(0.62, 0.88 - phase * 0.22, 0.3);
      } else {
        pose.leftHand = makePoint(-0.44, 0.56 - phase * 0.22, 0.34);
        pose.rightHand = makePoint(0.44, 0.56 - phase * 0.22, 0.34);
      }
      return pose;
    }

    if (is("seatedLegCurl", "seatedCalfRaise")) {
      pose.root.y = -0.22;
      pose.hipY = -0.3;
      pose.leftKnee = makePoint(-0.28, -0.62, 0.34);
      pose.rightKnee = makePoint(0.28, -0.62, 0.34);
      const ankleY = is("seatedCalfRaise") ? -1.02 + phase * 0.08 : mix(-1.04, -0.68, phase);
      const ankleZ = is("seatedCalfRaise") ? 0.62 : mix(0.62, 0.28, phase);
      pose.leftAnkle = makePoint(-0.28, ankleY, ankleZ);
      pose.rightAnkle = makePoint(0.28, ankleY, ankleZ);
      pose.leftFoot = makePoint(-0.28, ankleY - 0.06, ankleZ + 0.18);
      pose.rightFoot = makePoint(0.28, ankleY - 0.06, ankleZ + 0.18);
      return pose;
    }

    if (is("nordicCurl")) {
      pose.root.y = -0.42;
      pose.torsoLean = mix(0.0, 1.05, phase);
      pose.shoulderY = 0.84 - phase * 0.28;
      pose.hipY = -0.08;
      pose.shoulderZ = phase * 0.58;
      pose.hipZ = 0.1;
      pose.leftKnee = makePoint(-0.28, -1.06, 0.08);
      pose.rightKnee = makePoint(0.28, -1.06, 0.08);
      pose.leftAnkle = makePoint(-0.28, -1.08, -0.36);
      pose.rightAnkle = makePoint(0.28, -1.08, -0.36);
      pose.leftHand = makePoint(-0.44, 0.2 - phase * 0.24, 0.24 + phase * 0.36);
      pose.rightHand = makePoint(0.44, 0.2 - phase * 0.24, 0.24 + phase * 0.36);
      return pose;
    }

    if (is("standingCalfRaise", "singleLegCalfRaise")) {
      pose.root.y += phase * 0.22;
      if (is("singleLegCalfRaise")) {
        pose.rightKnee = makePoint(0.18, -0.72, 0.16);
        pose.rightAnkle = makePoint(0.18, -0.92, 0.22);
        pose.rightFoot = makePoint(0.18, -0.94, 0.34);
      }
      pose.leftFoot.y += phase * 0.04;
      pose.rightFoot.y += phase * 0.04;
      return pose;
    }

    if (is("donkeyCalfRaise")) {
      pose.torsoLean = 0.86;
      pose.root.y = -0.06 + phase * 0.16;
      pose.shoulderZ = 0.3;
      pose.hipZ = 0.0;
      pose.leftHand = makePoint(-0.5, -0.22, 0.52);
      pose.rightHand = makePoint(0.5, -0.22, 0.52);
      pose.leftFoot.y += phase * 0.04;
      pose.rightFoot.y += phase * 0.04;
      return pose;
    }

    if (is("toeYoga", "ankleAlphabet", "tibialisRaise", "balanceReach", "ankleEversion")) {
      if (is("ankleAlphabet", "ankleEversion")) {
        pose.root.y = -0.22;
        pose.hipY = -0.32;
        pose.leftKnee = makePoint(-0.28, -0.66, 0.3);
        pose.leftAnkle = makePoint(-0.28, -0.98, 0.58);
        pose.leftFoot = makePoint(-0.28 + swing * 0.08, -1.02 + Math.cos(progress * Math.PI * 4) * 0.05, 0.82);
      } else if (is("tibialisRaise")) {
        pose.shoulderZ = -0.15;
        pose.hipZ = -0.12;
        pose.leftFoot.y += phase * 0.03;
        pose.rightFoot.y += phase * 0.03;
        pose.leftFoot.rotationX = -phase * 0.4;
        pose.rightFoot.rotationX = -phase * 0.4;
      } else if (is("balanceReach")) {
        pose.root.y = -0.02 - phase * 0.08;
        pose.leftKnee = makePoint(-0.2, -0.6, 0.18);
        pose.leftAnkle = makePoint(-0.2, -1.1, 0.24);
        pose.rightKnee = makePoint(0.24, -0.64, 0.24 + phase * 0.25);
        pose.rightAnkle = makePoint(0.3, -1.04, 0.44 + phase * 0.44);
        pose.rightFoot = makePoint(0.34, -1.08, 0.66 + phase * 0.58);
      } else {
        pose.leftFoot.y += Math.max(0, swing) * 0.04;
        pose.rightFoot.y += Math.max(0, -swing) * 0.04;
      }
      return pose;
    }

    return null;
  }

  poseFor(progress) {
    const pose = this.basePose(progress);
    const phase = (1 - Math.cos(progress * Math.PI * 2)) / 2;
    const swing = Math.sin(progress * Math.PI * 2);

    const variantPose = this.poseForVariant(pose, phase, swing, progress);
    if (variantPose) return variantPose;

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
    const shoulderCenter = makePoint(root.x, pose.shoulderY + root.y, pose.shoulderZ + root.z);
    const hipCenter = makePoint(root.x, pose.hipY + root.y, pose.hipZ + root.z);
    const lean = pose.torsoLean;

    shoulderCenter.z += Math.sin(lean) * 0.38;
    shoulderCenter.y -= (1 - Math.cos(lean)) * 0.18;

    const leftShoulder = shoulderCenter.clone().add(makePoint(-pose.shoulderWidth, 0, 0));
    const rightShoulder = shoulderCenter.clone().add(makePoint(pose.shoulderWidth, 0, 0));
    const leftHip = hipCenter.clone().add(makePoint(-pose.hipWidth, 0, 0));
    const rightHip = hipCenter.clone().add(makePoint(pose.hipWidth, 0, 0));
    const neckOffset = pose.neckOffset ?? makePoint(0, 0.24, 0.03);
    const headOffset = pose.headOffset ?? makePoint(Math.sin(pose.headTilt) * 0.08, 0.42, Math.cos(pose.headTilt) * 0.03);
    const neck = shoulderCenter.clone().add(neckOffset);
    const head = neck.clone().add(headOffset);

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
    const leftWrist = leftElbow.clone().lerp(leftHand, 0.84);
    const rightWrist = rightElbow.clone().lerp(rightHand, 0.84);
    const leftGripAxis = normalizedDirection(pose.leftGripAxis);
    const rightGripAxis = normalizedDirection(pose.rightGripAxis);

    this.parts.torso.position.copy(shoulderCenter.clone().lerp(hipCenter, 0.5));
    this.parts.torso.rotation.x = lean;
    this.parts.ribcage.position.copy(shoulderCenter.clone().lerp(hipCenter, 0.28));
    this.parts.ribcage.rotation.x = lean;
    this.parts.abdomen.position.copy(shoulderCenter.clone().lerp(hipCenter, 0.68));
    this.parts.abdomen.rotation.x = lean;
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
    this.parts.leftPalm.position.copy(leftHand);
    this.parts.rightPalm.position.copy(rightHand);
    this.parts.leftThumb.position.copy(leftHand.clone().add(leftGripAxis.clone().multiplyScalar(0.12)).add(makePoint(0, 0.025, 0)));
    this.parts.rightThumb.position.copy(rightHand.clone().add(rightGripAxis.clone().multiplyScalar(-0.12)).add(makePoint(0, 0.025, 0)));
    placeSegment(
      this.parts.leftGrip,
      leftHand.clone().add(leftGripAxis.clone().multiplyScalar(-0.16)),
      leftHand.clone().add(leftGripAxis.clone().multiplyScalar(0.16)),
      0.018
    );
    placeSegment(
      this.parts.rightGrip,
      rightHand.clone().add(rightGripAxis.clone().multiplyScalar(-0.16)),
      rightHand.clone().add(rightGripAxis.clone().multiplyScalar(0.16)),
      0.018
    );
    this.parts.leftFoot.position.copy(leftFoot);
    this.parts.rightFoot.position.copy(rightFoot);
    this.parts.leftFoot.rotation.x = pose.leftFoot.rotationX ?? (this.pattern === "ankle" ? Math.sin(this.clock.elapsedTime * 4) * 0.3 : 0.08);
    this.parts.rightFoot.rotation.x = pose.rightFoot.rotationX ?? (this.pattern === "ankle" ? -Math.sin(this.clock.elapsedTime * 4) * 0.3 : 0.08);

    this.parts.leftShoulderJoint.position.copy(leftShoulder);
    this.parts.rightShoulderJoint.position.copy(rightShoulder);
    this.parts.leftElbowJoint.position.copy(leftElbow);
    this.parts.rightElbowJoint.position.copy(rightElbow);
    this.parts.leftWristJoint.position.copy(leftWrist);
    this.parts.rightWristJoint.position.copy(rightWrist);
    this.parts.leftHipJoint.position.copy(leftHip);
    this.parts.rightHipJoint.position.copy(rightHip);
    this.parts.leftKneeJoint.position.copy(leftKnee);
    this.parts.rightKneeJoint.position.copy(rightKnee);
    this.parts.leftAnkleJoint.position.copy(leftAnkle);
    this.parts.rightAnkleJoint.position.copy(rightAnkle);

    this.lastPose = {
      leftHand,
      rightHand,
      leftFoot,
      rightFoot,
      head,
      shoulderCenter,
      hipCenter,
      leftGripAxis,
      rightGripAxis
    };
  }

  updateEquipment(progress) {
    if (!this.lastPose) return;
    const { leftHand, rightHand, leftFoot, rightFoot, head, shoulderCenter, hipCenter, leftGripAxis, rightGripAxis } = this.lastPose;
    const variant = this.variant;
    const is = (...variants) => variants.includes(variant);
    const midpoint = leftHand.clone().add(rightHand).multiplyScalar(0.5);
    const footMidpoint = leftFoot.clone().add(rightFoot).multiplyScalar(0.5);

    if (this.props.leftDumbbell) {
      if (is("gobletSquat")) {
        this.props.leftDumbbell.position.copy(midpoint.clone().add(makePoint(0, -0.08, 0.02)));
        this.props.rightDumbbell.position.copy(midpoint.clone().add(makePoint(0, -0.08, 0.02)));
        orientLocalXAxis(this.props.leftDumbbell, yAxis);
        orientLocalXAxis(this.props.rightDumbbell, yAxis);
      } else {
        this.props.leftDumbbell.position.copy(leftHand);
        this.props.rightDumbbell.position.copy(rightHand);
        orientLocalXAxis(this.props.leftDumbbell, leftGripAxis);
        orientLocalXAxis(this.props.rightDumbbell, rightGripAxis);
      }
    }

    if (this.props.kettlebell) {
      const kettlebellTarget = is("suitcaseCarry") ? rightHand : midpoint;
      this.props.kettlebell.position.copy(kettlebellTarget.clone().add(makePoint(0, -0.14, 0.05)));
    }

    if (this.props.barbell) {
      let barTarget = midpoint;
      if (is("hipThrust")) barTarget = hipCenter.clone().add(makePoint(0, 0.02, 0.06));
      if (is("frontSquat")) barTarget = shoulderCenter.clone().add(makePoint(0, -0.05, 0.18));
      if (is("deadlift")) barTarget = midpoint.clone().add(makePoint(0, -0.08, 0));
      this.props.barbell.position.copy(barTarget);
      this.props.leftPlate.position.copy(barTarget.clone().add(makePoint(-0.9, 0, 0)));
      this.props.rightPlate.position.copy(barTarget.clone().add(makePoint(0.9, 0, 0)));
    }

    if (this.props.cableLine) {
      if (is("cableFly")) {
        placeSegment(this.props.cableLine, makePoint(-1.35, 1.18, -0.45), leftHand, 0.012);
        if (this.props.cableLineRight) {
          placeSegment(this.props.cableLineRight, makePoint(1.35, 1.18, -0.45), rightHand, 0.012);
        }
      } else {
        let anchor = makePoint(-1.35, 1.42, -0.45);
        let target = midpoint;
        if (is("cableRow")) {
          anchor = makePoint(-1.35, -0.52, -0.45);
          target = rightHand;
        }
        if (is("facePull")) {
          anchor = makePoint(-1.35, 0.95, -0.45);
        }
        if (is("pallofPress")) {
          anchor = makePoint(-1.35, 0.48, -0.45);
        }
        if (is("woodChop")) {
          anchor = makePoint(-1.35, 1.36, -0.45);
        }
        if (is("seatedLegCurl")) {
          anchor = makePoint(0, -0.76, 0.72);
          target = footMidpoint;
        }
        placeSegment(this.props.cableLine, anchor, target, 0.012);
      }
    }

    if (this.props.bandLine) {
      let anchor = this.props.anchor?.position?.clone() ?? makePoint(0, -1.1, -0.55);
      let target = midpoint;
      if (is("latPulldown")) target = midpoint;
      if (is("bandNeckRotation")) target = head;
      if (is("ankleEversion")) target = leftFoot;
      if (is("bandCurl")) anchor = footMidpoint.clone().add(makePoint(0, -0.02, -0.18));
      placeSegment(this.props.bandLine, anchor, target, 0.018);
    }

    if (this.props.abWheel) {
      this.props.abWheel.position.copy(makePoint(midpoint.x, -1.06, midpoint.z + 0.08));
      this.props.abWheel.rotation.x = progress * Math.PI * 4;
    }

    if (this.props.landmine) {
      placeSegment(this.props.landmine, makePoint(-0.25, -1.04, -0.45), rightHand, 0.025);
    }

    if (this.props.ball && is("ballLegCurl")) {
      this.props.ball.position.copy(footMidpoint.clone().add(makePoint(0, -0.02, 0.05)));
    }

    if (this.props.machinePad && is("seatedLegCurl")) {
      this.props.machinePad.position.copy(footMidpoint.clone().add(makePoint(0, 0.08, -0.02)));
    }

    if (this.props.machinePad && is("seatedCalfRaise")) {
      this.props.machinePad.position.copy(makePoint(0, -0.72, 0.32));
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
    this.body.rotation.y = -0.28;
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
