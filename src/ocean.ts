import * as THREE from 'three/webgpu';
import * as TSL from 'three/tsl';

// A few gentle sine waves. Each wave is a rolling bump that rises and falls; adding
// several of different size and direction gives a calm, varied surface.
const OCEAN_WGSL = /* wgsl */ `
  fn sineWave(xy: vec2<f32>, dir: vec2<f32>, wavelength: f32, amp: f32, t: f32) -> f32 {
    let d = normalize(dir);
    let w = 6.2831853 / wavelength;
    let phase = w * dot(d, xy) + t * 0.7;
    return amp * sin(phase);
  }

  fn oceanDisplace(base: vec3<f32>, t: f32) -> vec3<f32> {
    let xy = base.xy;
    var height = 0.0;
    height = height + sineWave(xy, vec2<f32>( 1.0,  0.2), 9.0, 0.050, t);
    height = height + sineWave(xy, vec2<f32>( 0.3,  1.0), 5.5, 0.030, t);
    height = height + sineWave(xy, vec2<f32>(-0.7,  0.5), 3.5, 0.015, t);
    return vec3<f32>(base.x, base.y, base.z + height);
  }
`;

const WATER_LEVEL = -0.55;

/** Builds the sea: a big plane whose surface is animated by the WGSL above.
 *  Returns the mesh plus an update(dt) that rolls the waves forward each frame. */
export function createOcean(): { mesh: THREE.Mesh; update: (dt: number) => void } {
  const uTime = TSL.uniform(0);

  const positionFn = TSL.wgslFn(`
    fn getPosition(base: vec3<f32>, t: f32) -> vec3<f32> {
      return oceanDisplace(base, t);
    }
    ${OCEAN_WGSL}
  `);
  const normalFn = TSL.wgslFn(`
    fn getNormal(base: vec3<f32>, t: f32) -> vec3<f32> {
      let e = 0.2;
      let p0 = oceanDisplace(base, t);
      let px = oceanDisplace(base + vec3<f32>(e, 0.0, 0.0), t);
      let py = oceanDisplace(base + vec3<f32>(0.0, e, 0.0), t);
      return normalize(cross(px - p0, py - p0));
    }
    ${OCEAN_WGSL}
  `);

  const geo = new THREE.PlaneGeometry(160, 160, 220, 220);
  const mat = new THREE.MeshStandardNodeMaterial({
    color: 0x2b8ca6,
    roughness: 0.35,
    metalness: 0.0,
  });
  mat.positionNode = positionFn(TSL.positionLocal, uTime);
  mat.normalNode = normalFn(TSL.positionLocal, uTime);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = WATER_LEVEL;

  let elapsed = 0;
  const update = (dt: number) => {
    elapsed += dt;
    uTime.value = elapsed;
  };

  return { mesh, update };
}
