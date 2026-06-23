import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2] || "assets/Enderly.ifc";
const outputPath = process.argv[3] || "data/enderly-buildings.geojson";
const terrainOutputPath = process.argv[4] || "data/enderly-terrain.geojson";
const sourceText = fs.readFileSync(inputPath, "utf8");

const statements = new Map();
const statementPattern = /#(\d+)\s*=\s*([A-Z0-9_]+)\(([\s\S]*?)\);/g;

for (const match of sourceText.matchAll(statementPattern)) {
  statements.set(`#${match[1]}`, {
    entity: match[2],
    args: splitTopLevel(match[3]),
  });
}

const mapConversion = findFirstEntity("IFCMAPCONVERSION");
const mapArgs = mapConversion?.args || [];
const eastings = Number(mapArgs[2] || 0);
const northings = Number(mapArgs[3] || 0);
const scale = mapArgs[7] && mapArgs[7] !== "$" ? Number(mapArgs[7]) : 1;
const axisX = mapArgs[5] && mapArgs[5] !== "$" ? Number(mapArgs[5]) : 1;
const axisY = mapArgs[6] && mapArgs[6] !== "$" ? Number(mapArgs[6]) : 0;
const zone = Number((sourceText.match(/IFCPROJECTEDCRS\('EPSG:326(\d\d)'/) || [])[1] || 17);

const points = new Map();
const pointLists3d = new Map();
const polylines = new Map();
const profiles = new Map();
const placements = new Map();
const solids = new Map();
const triangulatedFaceSets = new Map();
const shapeRepresentations = new Map();
const productShapes = new Map();
const buildings = [];
const terrainElements = [];

for (const [id, statement] of statements.entries()) {
  if (statement.entity === "IFCCARTESIANPOINT") {
    points.set(id, parseNumberTuple(statement.args[0]));
  }

  if (statement.entity === "IFCCARTESIANPOINTLIST3D") {
    pointLists3d.set(id, parseTupleList(statement.args[0]));
  }

  if (statement.entity === "IFCPOLYLINE") {
    polylines.set(id, refsFrom(statement.args[0]));
  }

  if (statement.entity === "IFCARBITRARYCLOSEDPROFILEDEF") {
    profiles.set(id, statement.args[2]);
  }

  if (statement.entity === "IFCAXIS2PLACEMENT3D") {
    placements.set(id, statement.args[0]);
  }

  if (statement.entity === "IFCEXTRUDEDAREASOLID") {
    solids.set(id, {
      profile: statement.args[0],
      placement: statement.args[1],
      depth: Number(statement.args[3]),
    });
  }

  if (statement.entity === "IFCTRIANGULATEDFACESET") {
    triangulatedFaceSets.set(id, {
      pointList: statement.args[0],
      faces: parseTupleList(statement.args[3]).map((face) => face.map((index) => Number(index))),
    });
  }

  if (statement.entity === "IFCSHAPEREPRESENTATION") {
    shapeRepresentations.set(id, refsFrom(statement.args[3]));
  }

  if (statement.entity === "IFCPRODUCTDEFINITIONSHAPE") {
    productShapes.set(id, refsFrom(statement.args[2]));
  }

  if (statement.entity === "IFCBUILDINGELEMENTPROXY") {
    buildings.push({
      id,
      globalId: unquote(statement.args[0]),
      name: unquote(statement.args[2]) || "Contextual Building",
      representation: statement.args[6],
    });
  }

  if (statement.entity === "IFCGEOGRAPHICELEMENT" && unquote(statement.args[2]).toLowerCase().includes("terrain")) {
    terrainElements.push({
      id,
      name: unquote(statement.args[2]) || "Terrain",
      representation: statement.args[6],
    });
  }
}

const rawFeatures = [];

for (const building of buildings) {
  const shapeRefs = productShapes.get(building.representation) || [];
  const solidIds = shapeRefs.flatMap((shapeRef) => shapeRepresentations.get(shapeRef) || []).filter((ref) => solids.has(ref));

  for (const solidId of solidIds) {
    const solid = solids.get(solidId);
    const polylineRef = profiles.get(solid.profile);
    const pointRefs = polylines.get(polylineRef) || [];
    const localRing = pointRefs.map((pointRef) => points.get(pointRef)).filter(Boolean);

    if (localRing.length < 4) continue;

    const placementPoint = points.get(placements.get(solid.placement)) || [0, 0, 0];
    const ring = closeRing(
      localRing.map(([x, y]) => localToLngLat(Number(x) + Number(placementPoint[0] || 0), Number(y) + Number(placementPoint[1] || 0))),
    );

    if (ring.length < 4) continue;

    const baseElevation = Number(placementPoint[2] || 0);
    const height = Number(solid.depth || 0);
    const area = polygonAreaMeters(localRing);
    const centroid = ringCentroid(ring);
    const renderClass = classifyBuilding(height, area);

    rawFeatures.push({
      type: "Feature",
      properties: {
        id: building.id.replace("#", "ifc-"),
        source_id: building.globalId,
        name: building.name,
        height: round(height, 2),
        area_sqm: round(area, 1),
        render_class: renderClass,
        base_elevation: round(baseElevation, 2),
        centroid_lng: round(centroid[0], 7),
        centroid_lat: round(centroid[1], 7),
      },
      geometry: {
        type: "Polygon",
        coordinates: [ring.map(([lng, lat]) => [round(lng, 7), round(lat, 7)])],
      },
    });
  }
}

const bounds = rawFeatures.reduce(
  (acc, feature) => {
    for (const [lng, lat] of feature.geometry.coordinates[0]) {
      acc.west = Math.min(acc.west, lng);
      acc.south = Math.min(acc.south, lat);
      acc.east = Math.max(acc.east, lng);
      acc.north = Math.max(acc.north, lat);
    }
    return acc;
  },
  { west: Infinity, south: Infinity, east: -Infinity, north: -Infinity },
);

const featureCollection = {
  type: "FeatureCollection",
  name: "Enderly Park IFC contextual buildings",
  metadata: {
    source: path.basename(inputPath),
    source_crs: `EPSG:326${zone}`,
    generated_from: "tools/ifc-to-geojson.mjs",
    building_count: rawFeatures.length,
    bounds: [
      [round(bounds.west, 7), round(bounds.south, 7)],
      [round(bounds.east, 7), round(bounds.north, 7)],
    ],
    center: [round((bounds.west + bounds.east) / 2, 7), round((bounds.south + bounds.north) / 2, 7)],
  },
  features: rawFeatures,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(featureCollection, null, 2)}\n`);
fs.mkdirSync(path.dirname(terrainOutputPath), { recursive: true });
fs.writeFileSync(terrainOutputPath, `${JSON.stringify(terrainFeatureCollection(), null, 2)}\n`);

console.log(`Converted ${rawFeatures.length} IFC building solids to ${outputPath}`);
console.log(`Bounds: ${JSON.stringify(featureCollection.metadata.bounds)}`);
console.log(`Converted IFC terrain mesh to ${terrainOutputPath}`);

function findFirstEntity(entity) {
  for (const statement of statements.values()) {
    if (statement.entity === entity) return statement;
  }
  return null;
}

function splitTopLevel(value) {
  const parts = [];
  let current = "";
  let depth = 0;
  let inString = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const nextChar = value[index + 1];

    if (char === "'") {
      current += char;
      if (inString && nextChar === "'") {
        current += nextChar;
        index += 1;
      } else {
        inString = !inString;
      }
      continue;
    }

    if (!inString && char === "(") depth += 1;
    if (!inString && char === ")") depth -= 1;

    if (!inString && char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseNumberTuple(value) {
  return value
    .replace(/^\(+|\)+$/g, "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((number) => !Number.isNaN(number));
}

function parseTupleList(value = "") {
  const tuples = [];
  const tuplePattern = /\(([^()]+)\)/g;

  for (const match of value.matchAll(tuplePattern)) {
    const tuple = match[1]
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((number) => !Number.isNaN(number));

    if (tuple.length > 0) tuples.push(tuple);
  }

  return tuples;
}

function refsFrom(value = "") {
  return value.match(/#\d+/g) || [];
}

function unquote(value = "") {
  if (value === "$") return "";
  return value.replace(/^'|'$/g, "").replace(/''/g, "'");
}

function localToLngLat(x, y) {
  const easting = eastings + scale * (axisX * x - axisY * y);
  const northing = northings + scale * (axisY * x + axisX * y);
  return utmToLngLat(easting, northing, zone);
}

function closeRing(ring) {
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first && last && first[0] === last[0] && first[1] === last[1]) return ring;
  return [...ring, first];
}

function ringCentroid(ring) {
  let x = 0;
  let y = 0;
  const count = Math.max(ring.length - 1, 1);

  for (let index = 0; index < count; index += 1) {
    x += ring[index][0];
    y += ring[index][1];
  }

  return [x / count, y / count];
}

function polygonAreaMeters(ring) {
  let area = 0;
  const count = ring.length;

  for (let index = 0; index < count; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % count];
    area += Number(current[0] || 0) * Number(next[1] || 0) - Number(next[0] || 0) * Number(current[1] || 0);
  }

  return Math.abs(area / 2);
}

function classifyBuilding(height, area) {
  if (area >= 420 || height >= 10) return "infrastructure";
  if (area >= 165 || height >= 6.5) return "community-building";
  if (area <= 80 && height <= 4.8) return "small-house";
  return "house";
}

function terrainFeatureCollection() {
  const terrainFaces = [];
  const terrainEdges = new Map();

  for (const terrain of terrainElements) {
    const shapeRefs = productShapes.get(terrain.representation) || [];
    const faceSetIds = shapeRefs
      .flatMap((shapeRef) => shapeRepresentations.get(shapeRef) || [])
      .filter((ref) => triangulatedFaceSets.has(ref));

    for (const faceSetId of faceSetIds) {
      const faceSet = triangulatedFaceSets.get(faceSetId);
      const facePoints = pointLists3d.get(faceSet.pointList) || [];

      for (const face of faceSet.faces) {
        if (face.length < 3) continue;

        const coords = face
          .map((pointIndex) => facePoints[pointIndex - 1])
          .filter(Boolean)
          .map(([x, y]) => localToLngLat(Number(x), Number(y)))
          .map(([lng, lat]) => [round(lng, 7), round(lat, 7)]);

        if (coords.length < 3) continue;

        terrainFaces.push([[...coords, coords[0]]]);

        for (let index = 0; index < face.length; index += 1) {
          const current = face[index];
          const next = face[(index + 1) % face.length];
          const edgeKey = [current, next].sort((a, b) => a - b).join("-");
          if (!terrainEdges.has(edgeKey)) {
            const start = facePoints[current - 1];
            const end = facePoints[next - 1];
            if (start && end) {
              terrainEdges.set(edgeKey, [
                localToLngLat(Number(start[0]), Number(start[1])).map((number) => round(number, 7)),
                localToLngLat(Number(end[0]), Number(end[1])).map((number) => round(number, 7)),
              ]);
            }
          }
        }
      }
    }
  }

  return {
    type: "FeatureCollection",
    name: "Enderly Park IFC terrain mesh",
    metadata: {
      source: path.basename(inputPath),
      source_crs: `EPSG:326${zone}`,
      generated_from: "tools/ifc-to-geojson.mjs",
      triangle_count: terrainFaces.length,
      edge_count: terrainEdges.size,
    },
    features: [
      {
        type: "Feature",
        properties: {
          role: "surface",
          name: "Enderly Park terrain surface",
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: terrainFaces,
        },
      },
      {
        type: "Feature",
        properties: {
          role: "mesh",
          name: "Enderly Park terrain mesh",
        },
        geometry: {
          type: "MultiLineString",
          coordinates: Array.from(terrainEdges.values()),
        },
      },
    ],
  };
}

function round(number, digits) {
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

function utmToLngLat(easting, northing, utmZone) {
  const k0 = 0.9996;
  const a = 6378137;
  const f = 1 / 298.257223563;
  const e = Math.sqrt(f * (2 - f));
  const e1 = (1 - Math.sqrt(1 - e ** 2)) / (1 + Math.sqrt(1 - e ** 2));
  const x = easting - 500000;
  const m = northing / k0;
  const mu = m / (a * (1 - e ** 2 / 4 - (3 * e ** 4) / 64 - (5 * e ** 6) / 256));
  const j1 = (3 * e1) / 2 - (27 * e1 ** 3) / 32;
  const j2 = (21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32;
  const j3 = (151 * e1 ** 3) / 96;
  const j4 = (1097 * e1 ** 4) / 512;
  const fp = mu + j1 * Math.sin(2 * mu) + j2 * Math.sin(4 * mu) + j3 * Math.sin(6 * mu) + j4 * Math.sin(8 * mu);
  const ep2 = e ** 2 / (1 - e ** 2);
  const c1 = ep2 * Math.cos(fp) ** 2;
  const t1 = Math.tan(fp) ** 2;
  const r1 = (a * (1 - e ** 2)) / (1 - e ** 2 * Math.sin(fp) ** 2) ** 1.5;
  const n1 = a / Math.sqrt(1 - e ** 2 * Math.sin(fp) ** 2);
  const d = x / (n1 * k0);
  const latitude =
    fp -
    ((n1 * Math.tan(fp)) / r1) *
      (d ** 2 / 2 -
        ((5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * ep2) * d ** 4) / 24 +
        ((61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * ep2 - 3 * c1 ** 2) * d ** 6) / 720);
  const longitude =
    ((d -
      ((1 + 2 * t1 + c1) * d ** 3) / 6 +
      ((5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * ep2 + 24 * t1 ** 2) * d ** 5) / 120) /
      Math.cos(fp)) +
    degToRad((utmZone - 1) * 6 - 180 + 3);

  return [radToDeg(longitude), radToDeg(latitude)];
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}
