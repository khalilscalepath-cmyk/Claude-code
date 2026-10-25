/* Carmel Homes — 3D dollhouse
 *
 * A cutaway view of a house, built as real geometry and turned by scroll.
 * This replaced an SVG wireframe that drew lines in a flat projection: it
 * read as a technical diagram, which is not what a buyer wants to look at.
 * A dollhouse is what Matterport and estate agents show, because people
 * understand a house they can see into.
 *
 * Modelled from Carmel's own plan: a 44x23 block, six rooms, the garage on
 * the street side. Walls are cut at roughly waist height so the interior
 * stays visible from above — that cut is the whole trick, and it is why
 * this reads as a house rather than a box.
 *
 * Three.js is vendored locally (r169, MIT), so the page still makes no
 * external requests.
 */

import * as THREE from '../../vendor/three.module.js';

/* ---------------- the plan ----------------
 * Feet, origin at the front-left corner. Column splits at 18 and 31, row
 * split at 14 — the same divisions the old floor-plan drawing used, so the
 * two describe one house. */

const W = 44;        // overall width
const D = 23;        // overall depth
const WALL = 0.55;   // wall thickness
const CUT = 4.6;     // height the walls are cut to, so you can see in
const ROOF = 9.0;    // where the roof planes float

/* How far the page may turn the house. Exported so the framing below and the
 * scroll driver on the page agree — the camera is pulled back far enough that
 * the house never crops anywhere in this range, and no further. */
export const TURN_FROM = -0.85;
export const TURN_TO = 0.70;

const ROOMS = [
  { name: 'Living',  x0: 0,  x1: 18, z0: 0,  z1: 14, floor: 0xb08456 },
  { name: 'Garage',  x0: 0,  x1: 18, z0: 14, z1: 23, floor: 0x8a8a8f },
  { name: 'Kitchen', x0: 18, x1: 31, z0: 0,  z1: 9,  floor: 0xc2a079 },
  { name: 'Dining',  x0: 18, x1: 31, z0: 9,  z1: 23, floor: 0xb08456 },
  { name: 'Primary', x0: 31, x1: 44, z0: 0,  z1: 14, floor: 0xb08456 },
  { name: 'Bath',    x0: 31, x1: 44, z0: 14, z1: 23, floor: 0xd8d4cc },
];

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

function mat(color, o = {}) {
  const spec = { color, roughness: o.rough ?? 0.85, metalness: o.metal ?? 0 };
  if (o.opacity != null) { spec.transparent = true; spec.opacity = o.opacity; }
  return new THREE.MeshStandardMaterial(spec);
}

/** A wall segment. Give it a line on the plan and a height. */
function wall(g, x0, x1, z0, z1, h, material) {
  const m = new THREE.Mesh(
    box(Math.max(Math.abs(x1 - x0), WALL), h, Math.max(Math.abs(z1 - z0), WALL)),
    material);
  m.position.set((x0 + x1) / 2 - W / 2, h / 2, (z0 + z1) / 2 - D / 2);
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}

/** A horizontal plate: floors, the ground, the roof. */
function slab(g, x0, x1, z0, z1, y, h, material) {
  const m = new THREE.Mesh(box(x1 - x0, h, z1 - z0), material);
  m.position.set((x0 + x1) / 2 - W / 2, y + h / 2, (z0 + z1) / 2 - D / 2);
  m.receiveShadow = true;
  g.add(m);
  return m;
}

/** Furniture: a block standing on the floor. */
function prop(g, x, z, w, h, d, color) {
  const m = new THREE.Mesh(box(w, h, d), mat(color, { rough: 0.7 }));
  m.position.set(x - W / 2, h / 2 + 0.12, z - D / 2);
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}

export function buildHouse() {
  const house = new THREE.Group();
  const stucco = mat(0xeae3d8, { rough: 0.95 });
  const inner = mat(0xf2ece2, { rough: 0.95 });

  slab(house, -1.2, W + 1.2, -1.2, D + 1.2, -0.45, 0.45, mat(0xcfc6b6, { rough: 1 }));
  for (const r of ROOMS) {
    slab(house, r.x0, r.x1, r.z0, r.z1, 0, 0.12, mat(r.floor, { rough: 0.65 }));
  }

  // exterior, cut at waist height
  wall(house, 0, W, 0, 0, CUT, stucco);
  wall(house, 0, W, D, D, CUT, stucco);
  wall(house, 0, 0, 0, D, CUT, stucco);
  wall(house, W, W, 0, D, CUT, stucco);

  // interior partitions, a touch lower so the plan reads
  const ih = CUT * 0.86;
  wall(house, 18, 18, 0, D, ih, inner);
  wall(house, 31, 31, 0, D, ih, inner);
  wall(house, 0, 18, 14, 14, ih, inner);
  wall(house, 18, 31, 9, 9, ih, inner);
  wall(house, 31, W, 14, 14, ih, inner);

  // living
  slab(house, 3, 15, 2.5, 11, 0.12, 0.04, mat(0x8d7f6d, { rough: 1 }));
  prop(house, 4.6, 6.8, 1.9, 2.3, 7.0, 0x6f6a66);
  prop(house, 9.2, 6.8, 3.4, 0.9, 1.8, 0x7a5f44);
  prop(house, 13.6, 4.2, 2.0, 2.0, 2.0, 0x6f6a66);
  prop(house, 13.6, 9.4, 2.0, 2.0, 2.0, 0x6f6a66);

  // garage
  prop(house, 5.0, 18.4, 6.4, 1.7, 3.1, 0x3b4654);
  prop(house, 12.6, 18.4, 6.4, 1.7, 3.1, 0x6c6f73);

  // kitchen
  prop(house, 24.5, 2.1, 11.0, 1.1, 1.9, 0x4a4a4e);
  prop(house, 24.5, 6.0, 7.2, 1.5, 2.6, 0x8c6a46);

  // dining
  prop(house, 24.5, 15.5, 7.6, 1.2, 3.0, 0x6b4f35);
  for (let i = 0; i < 3; i++) {
    prop(house, 21.8 + i * 2.6, 13.2, 1.0, 1.7, 1.0, 0x5a5550);
    prop(house, 21.8 + i * 2.6, 17.8, 1.0, 1.7, 1.0, 0x5a5550);
  }

  // primary
  prop(house, 37.5, 5.4, 7.4, 1.4, 8.2, 0xd6d1c7);
  prop(house, 37.5, 1.9, 7.4, 2.6, 0.6, 0x6b4f35);
  prop(house, 33.4, 2.4, 1.5, 1.2, 1.5, 0x6b4f35);
  prop(house, 41.6, 2.4, 1.5, 1.2, 1.5, 0x6b4f35);
  prop(house, 37.5, 11.4, 4.4, 0.9, 1.4, 0x7a6a58);

  // bath
  prop(house, 34.4, 20.0, 4.6, 1.3, 2.4, 0xf4f2ee);
  prop(house, 40.6, 16.4, 5.2, 1.4, 1.8, 0x55504a);

  // glazing — the thing Carmel actually sells
  const glass = mat(0x9fd4e8, { rough: 0.08, metal: 0.1, opacity: 0.26 });
  wall(house, 0.3, 17.7, 0.3, 0.3, CUT * 0.98, glass);
  wall(house, 31.3, 43.7, 0.3, 0.3, CUT * 0.98, glass);

  // roof planes, translucent and floating clear of the cut
  const roofMat = mat(0xb9ac99, { rough: 0.9, opacity: 0.2 });
  slab(house, -1.2, 31, -1.2, D + 1.2, ROOF, 0.5, roofMat).name = 'roofA';
  slab(house, 31, W + 1.2, -1.2, D + 1.2, ROOF - 1.4, 0.5, roofMat).name = 'roofB';

  return house;
}

/**
 * Mount the scene on a canvas. Returns { setTurn, setLift, resize, dispose }.
 * Nothing animates on its own — the page drives it from scroll position.
 */
export function mount(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);

  const rig = new THREE.Group();
  const house = buildHouse();
  rig.add(house);
  scene.add(rig);

  // one warm key from the south-west, a cool sky fill, and a low bounce so
  // the cut-open interiors do not go muddy
  const key = new THREE.DirectionalLight(0xfff1de, 2.4);
  key.position.set(36, 46, 28);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 180;
  const s = 44;
  key.shadow.camera.left = -s; key.shadow.camera.right = s;
  key.shadow.camera.top = s;   key.shadow.camera.bottom = -s;
  key.shadow.bias = -0.0015;
  scene.add(key);

  scene.add(new THREE.HemisphereLight(0xdceaff, 0xc0a078, 1.15));

  const bounce = new THREE.DirectionalLight(0xffd9b0, 0.5);
  bounce.position.set(-30, 12, -24);
  scene.add(bounce);

  const roofs = ['roofA', 'roofB'].map(n => house.getObjectByName(n)).filter(Boolean);

  // The corners the camera has to keep in frame at a given rotation: the
  // plan's footprint, at the ground and at the top of the cut walls. The roof
  // is translucent and fades as it lifts, so it is allowed to run off the top
  // rather than pushing the camera back and shrinking the house.
  const HX = W / 2 + 1.2, HZ = D / 2 + 1.2;
  const corners = [];
  for (const x of [-HX, HX]) for (const z of [-HZ, HZ]) {
    for (const y of [-0.5, CUT + 0.6]) corners.push(new THREE.Vector3(x, y, z));
  }

  const TARGET = new THREE.Vector3(0, 3.0, 0);
  const DIR = new THREE.Vector3(0, 0.64, 1.00).normalize();
  const probe = new THREE.Vector3();

  /** Put the camera `dist` back along DIR and return the worst |ndc| of the
   *  plan rotated by `t`. */
  function worstAt(dist, t) {
    camera.position.copy(DIR).multiplyScalar(dist).add(TARGET);
    camera.lookAt(TARGET);
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    const c = Math.cos(t), sn = Math.sin(t);
    let worst = 0;
    for (const p of corners) {
      probe.set(p.x * c + p.z * sn, p.y, -p.x * sn + p.z * c).project(camera);
      worst = Math.max(worst, Math.abs(probe.x), Math.abs(probe.y));
    }
    return worst;
  }

  /** Distance at which the plan rotated by `t` just fills the frame. */
  function solve(t) {
    let dist = 80;
    for (let i = 0; i < 10; i++) {
      const worst = worstAt(dist, t);
      if (!isFinite(worst) || worst <= 0) break;
      const next = dist * (worst / 0.96);
      if (Math.abs(next - dist) < 0.05) { dist = next; break; }
      dist = next;
    }
    return dist;
  }

  /* A rectangle sweeps a lot more of the frame on its diagonal than square on,
   * so one fixed distance either crops at the extremes or leaves the house
   * small in the middle. Instead the camera eases back and in with the turn.
   * The distances are solved once per layout and read back by interpolation,
   * which keeps the per-frame cost to arithmetic. */
  const STEPS = 48;
  const dists = new Float64Array(STEPS + 1);

  function solveTable() {
    for (let i = 0; i <= STEPS; i++) {
      dists[i] = solve(TURN_FROM + (TURN_TO - TURN_FROM) * (i / STEPS));
    }
  }

  function distanceFor(t) {
    const span = TURN_TO - TURN_FROM;
    const u = Math.min(1, Math.max(0, (t - TURN_FROM) / span)) * STEPS;
    const i = Math.min(STEPS - 1, Math.floor(u));
    return dists[i] + (dists[i + 1] - dists[i]) * (u - i);
  }

  let turn = 0, lift = 0;

  function render() {
    rig.rotation.y = turn;
    // the roof lifts away as you scroll in, so the rooms open up
    for (const r of roofs) {
      r.position.y = (r.name === 'roofA' ? ROOF : ROOF - 1.4) + 0.25 + lift * 4.2;
      // Gone by the time it has risen, so the finished state is six open
      // rooms and not a pale slab hanging over them.
      r.material.opacity = 0.22 * Math.max(0, 1 - lift);
      r.visible = r.material.opacity > 0.004;
    }
    camera.position.copy(DIR).multiplyScalar(distanceFor(turn)).add(TARGET);
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    solveTable();
    render();
  }

  return {
    setTurn(v) { turn = v; render(); },
    setLift(v) { lift = v; render(); },
    set(turnV, liftV) { turn = turnV; lift = liftV; render(); },
    resize,
    render,
    dispose() {
      renderer.dispose();
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      });
    },
  };
}
