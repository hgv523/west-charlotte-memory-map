const charlotteCenter = [-80.883, 35.2396];
const defaultMapView = {
  center: charlotteCenter,
  zoom: 14.05,
  pitch: 60,
  bearing: -28,
};

const enderlyModel = {
  center: [-80.8829931, 35.2395826],
  bounds: [
    [-80.8859945, 35.2367702],
    [-80.8799917, 35.2423949],
  ],
  source: "./data/enderly-buildings.geojson",
};

const corridorBounds = [
  [-81.035, 35.17],
  [-80.785, 35.315],
];

const highlightedRoads = [
  {
    id: "freedom-drive",
    name: "Freedom Dr",
    color: "#f0c66d",
    labelCoords: [-80.892, 35.2448],
    path: [
      [-80.9110451, 35.2574493],
      [-80.9082347, 35.2560359],
      [-80.9036045, 35.2535866],
      [-80.9002341, 35.251529],
      [-80.8990334, 35.2504706],
      [-80.8977378, 35.2494874],
      [-80.8964311, 35.2481581],
      [-80.8950735, 35.2469665],
      [-80.8932598, 35.2454246],
      [-80.8906735, 35.2434895],
      [-80.8884817, 35.2418058],
      [-80.8875346, 35.2412592],
      [-80.8857316, 35.2398884],
      [-80.884774, 35.2391653],
      [-80.883721, 35.238377],
      [-80.8804913, 35.235958],
      [-80.8788356, 35.2347284],
      [-80.876229, 35.2331591],
      [-80.8759038, 35.2329727],
    ],
  },
  {
    id: "wilkinson-blvd",
    name: "Wilkinson Blvd",
    color: "#48d7ff",
    labelCoords: [-80.916, 35.2288],
    path: [
      [-80.9538258, 35.2359514],
      [-80.9518703, 35.2356741],
      [-80.9459609, 35.2354584],
      [-80.9430924, 35.2353774],
      [-80.9409253, 35.2351468],
      [-80.9399956, 35.2348301],
      [-80.9344716, 35.2340115],
      [-80.9333517, 35.2338342],
      [-80.9304839, 35.2333806],
      [-80.9186759, 35.229951],
      [-80.9146981, 35.2282277],
      [-80.9124485, 35.2274087],
      [-80.9075973, 35.2253406],
      [-80.9044009, 35.2250419],
      [-80.9006309, 35.2247433],
      [-80.8978804, 35.2245795],
      [-80.8965, 35.2244038],
      [-80.8911544, 35.22436],
      [-80.8884322, 35.2241472],
      [-80.8845364, 35.2241242],
      [-80.878547, 35.2238027],
      [-80.8721698, 35.2231619],
    ],
  },
];

const seedMemoryPlaces = [
  {
    id: "ashley-wilkinson-market",
    name: "Corner Market on Wilkinson",
    street: "Wilkinson Blvd near Ashley Road",
    type: "Retail",
    year: 1989,
    coords: [-80.89086, 35.22595],
    height: 34,
    footprint: [
      [-80.89118, 35.22612],
      [-80.89066, 35.22613],
      [-80.89063, 35.22578],
      [-80.89116, 35.22576],
      [-80.89118, 35.22612],
    ],
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    description:
      "A small everyday stop remembered for paper bags, bright drink coolers, and neighbors recognizing each other before the evening traffic thickened along Wilkinson.",
  },
  {
    id: "freedom-auto-bay",
    name: "Freedom Drive Auto Bay",
    street: "Freedom Drive west of I-85",
    type: "Industrial",
    year: 2004,
    coords: [-80.91452, 35.24742],
    height: 42,
    footprint: [
      [-80.91486, 35.2477],
      [-80.91422, 35.24772],
      [-80.91417, 35.24718],
      [-80.91478, 35.24713],
      [-80.91486, 35.2477],
    ],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    description:
      "The building is remembered through the sound of open garage doors, summer heat on asphalt, and relatives waiting while repairs turned into long conversations.",
  },
  {
    id: "little-rock-road-house",
    name: "Little Rock Road House",
    street: "Little Rock Road near Wilkinson Blvd",
    type: "Home",
    year: 1976,
    coords: [-80.93875, 35.24385],
    height: 26,
    footprint: [
      [-80.93902, 35.24402],
      [-80.93855, 35.24403],
      [-80.93852, 35.24368],
      [-80.93898, 35.24366],
      [-80.93902, 35.24402],
    ],
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
    description:
      "A family porch memory: chairs pulled close to the shade, children cutting through the yard, and aircraft passing overhead on clear afternoons.",
  },
  {
    id: "freedom-church-hall",
    name: "Church Hall on Freedom",
    street: "Freedom Drive near Alleghany Street",
    type: "Church",
    year: 1995,
    coords: [-80.8842, 35.2392],
    height: 52,
    footprint: [
      [-80.88452, 35.23942],
      [-80.88392, 35.23944],
      [-80.8839, 35.23898],
      [-80.88448, 35.23895],
      [-80.88452, 35.23942],
    ],
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    description:
      "Remembered for folding tables, Sunday clothes, community notices, and the steady feeling that this was where news traveled before phones did.",
  },
];

let memoryPlaces = [];
let activeId = null;
let activeMarker = null;
let mapLayersReady = false;
let pendingCoords = null;
let pendingMarker = null;
let enderlyModelMarker = null;
let searchMarker = null;
let searchCandidates = [];
const memoryMarkers = new Map();
const roadLabelMarkers = [];

const buildingCount = document.querySelector("#buildingCount");
const memoryCount = document.querySelector("#memoryCount");
const memoryList = document.querySelector("#memoryList");
const detailPanel = document.querySelector("#detailPanel");
const detailImage = document.querySelector("#detailImage");
const openImageButton = document.querySelector("#openImageButton");
const detailStreet = document.querySelector("#detailStreet");
const detailTitle = document.querySelector("#detailTitle");
const detailDescription = document.querySelector("#detailDescription");
const detailYear = document.querySelector("#detailYear");
const detailType = document.querySelector("#detailType");
const addMemoryButton = document.querySelector("#addMemoryButton");
const resetViewButton = document.querySelector("#resetViewButton");
const closeDetailButton = document.querySelector("#closeDetailButton");
const deleteMemoryButton = document.querySelector("#deleteMemoryButton");
const memoryForm = document.querySelector("#memoryForm");
const cancelMemoryButton = document.querySelector("#cancelMemoryButton");
const selectedLocationText = document.querySelector("#selectedLocationText");
const imageInput = document.querySelector("#imageInput");
const imagePreview = document.querySelector("#imagePreview");
const imagePreviewWrap = document.querySelector("#imagePreviewWrap");
const angleControls = document.querySelector(".angle-controls");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const closeImageButton = document.querySelector("#closeImageButton");
const searchForm = document.querySelector("#searchForm");
const locationSearchInput = document.querySelector("#locationSearchInput");
const searchStatus = document.querySelector("#searchStatus");
const searchResults = document.querySelector("#searchResults");

const supabaseConfig = window.MemoryAtlasConfig || {};
const supabaseTable = supabaseConfig.supabaseTable || "memories";
const supabaseBucket = supabaseConfig.supabaseBucket || "memory-images";
const supabaseClient =
  supabaseConfig.supabaseUrl && supabaseConfig.supabaseAnonKey && window.supabase
    ? window.supabase.createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey)
    : null;
const memorySelectColumns =
  "id, place_name, street, description, memory_year, building_type, lng, lat, height, footprint, image_url, created_at";
const creatorTokenKey = "memory-atlas-creator-token";
let creatorToken = localStorage.getItem(creatorTokenKey);

if (!creatorToken) {
  creatorToken = crypto.randomUUID();
  localStorage.setItem(creatorTokenKey, creatorToken);
}

if (!window.maplibregl) {
  document.querySelector("#map").innerHTML =
    '<div class="map-error">MapLibre could not load. Check the network connection and refresh.</div>';
  throw new Error("MapLibre GL JS failed to load");
}

const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        attribution: "Tiles &copy; Esri",
      },
      transportation: {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri transportation reference",
      },
      places: {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri reference",
      },
      openmaptiles: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
        attribution: "OpenMapTiles Data from OpenStreetMap",
      },
    },
    layers: [
      {
        id: "satellite-raster",
        type: "raster",
        source: "satellite",
        paint: {
          "raster-saturation": 0.02,
          "raster-contrast": 0.08,
          "raster-brightness-min": 0.05,
          "raster-brightness-max": 0.92,
        },
      },
      {
        id: "transportation-reference",
        type: "raster",
        source: "transportation",
        paint: {
          "raster-opacity": 0.72,
        },
      },
      {
        id: "places-reference",
        type: "raster",
        source: "places",
        paint: {
          "raster-opacity": 0.78,
        },
      },
    ],
  },
  center: defaultMapView.center,
  zoom: defaultMapView.zoom,
  pitch: defaultMapView.pitch,
  bearing: defaultMapView.bearing,
  minZoom: 10.6,
  maxZoom: 18.5,
  maxBounds: corridorBounds,
  attributionControl: false,
  dragPan: true,
  dragRotate: true,
  scrollZoom: true,
  boxZoom: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
});

map.dragPan.enable();
map.scrollZoom.enable();
map.dragRotate.enable();
map.boxZoom.enable();
map.doubleClickZoom.enable();
map.keyboard.enable();
map.touchZoomRotate.enable();

map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  }),
  "top-right",
);
map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

function memoryFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: memoryPlaces.map((place) => ({
      type: "Feature",
      id: place.id,
      properties: {
        id: place.id,
        name: place.name,
        year: place.year,
        type: place.type,
        height: place.height,
        active: place.id === activeId,
      },
      geometry: {
        type: "Polygon",
        coordinates: [place.footprint],
      },
    })),
  };
}

function corridorFeatureCollection() {
  const [westSouth, eastNorth] = corridorBounds;
  const [west, south] = westSouth;
  const [east, north] = eastNorth;

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
      },
    ],
  };
}

function highlightedRoadFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: highlightedRoads.map((road) => ({
      type: "Feature",
      properties: {
        id: road.id,
        name: road.name,
        color: road.color,
      },
      geometry: {
        type: "LineString",
        coordinates: road.path,
      },
    })),
  };
}

function enderlyHighlightFeatureCollection() {
  const [[west, south], [east, north]] = enderlyModel.bounds;

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Enderly Park IFC model area",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
      },
    ],
  };
}

function getVectorSourceId() {
  const sources = map.getStyle().sources;
  return Object.keys(sources).find((id) => sources[id].type === "vector");
}

function addBase3DBuildings() {
  const sourceId = getVectorSourceId();
  if (!sourceId || map.getLayer("real-buildings-3d")) return;

  map.addLayer({
    id: "real-buildings-3d",
    type: "fill-extrusion",
    source: sourceId,
    "source-layer": "building",
    minzoom: 15,
    filter: ["has", "render_height"],
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["coalesce", ["get", "render_height"], 12],
        0,
        "#d8d4c8",
        40,
        "#c9c1b2",
        120,
        "#a9b6bc",
      ],
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["zoom"],
        15,
        0,
        16,
        ["coalesce", ["get", "render_height"], 12],
      ],
      "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
      "fill-extrusion-opacity": 0.72,
    },
  });
}

function addMemoryLayers() {
  if (map.getSource("memory-buildings")) return;

  map.addSource("corridor-boundary", {
    type: "geojson",
    data: corridorFeatureCollection(),
  });

  map.addLayer({
    id: "corridor-fill",
    type: "fill",
    source: "corridor-boundary",
    paint: {
      "fill-color": "#1f6f5b",
      "fill-opacity": 0.04,
    },
  });

  map.addLayer({
    id: "corridor-outline",
    type: "line",
    source: "corridor-boundary",
    paint: {
      "line-color": "#1f6f5b",
      "line-dasharray": [2, 2],
      "line-width": 2,
      "line-opacity": 0.75,
    },
  });

  map.addSource("highlighted-roads", {
    type: "geojson",
    data: highlightedRoadFeatureCollection(),
  });

  map.addLayer({
    id: "highlighted-roads-halo",
    type: "line",
    source: "highlighted-roads",
    paint: {
      "line-color": "#101e1a",
      "line-opacity": 0.74,
      "line-width": ["interpolate", ["linear"], ["zoom"], 12.7, 9, 16.5, 18],
      "line-blur": 1.3,
    },
  });

  map.addLayer({
    id: "highlighted-roads-core",
    type: "line",
    source: "highlighted-roads",
    paint: {
      "line-color": ["get", "color"],
      "line-opacity": 0.96,
      "line-width": ["interpolate", ["linear"], ["zoom"], 12.7, 4, 16.5, 9],
      "line-blur": 0.25,
    },
  });

  map.addSource("memory-buildings", {
    type: "geojson",
    data: memoryFeatureCollection(),
  });

  map.addLayer({
    id: "memory-building-extrusions",
    type: "fill-extrusion",
    source: "memory-buildings",
    paint: {
      "fill-extrusion-color": ["case", ["get", "active"], "#d9ad4f", "#bd5d45"],
      "fill-extrusion-height": ["case", ["get", "active"], ["+", ["get", "height"], 26], ["get", "height"]],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.92,
      "fill-extrusion-vertical-gradient": true,
    },
  });

  map.addLayer({
    id: "memory-building-outlines",
    type: "line",
    source: "memory-buildings",
    paint: {
      "line-color": "#fffdfa",
      "line-width": ["case", ["get", "active"], 4, 2],
      "line-opacity": 0.95,
    },
  });

  map.on("mouseenter", "memory-building-extrusions", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "memory-building-extrusions", () => {
    map.getCanvas().style.cursor = "";
  });
}

function addEnderlyModelLayer() {
  if (map.getSource("enderly-ifc-buildings")) return;

  map.addSource("enderly-ifc-highlight", {
    type: "geojson",
    data: enderlyHighlightFeatureCollection(),
  });

  map.addSource("enderly-ifc-buildings", {
    type: "geojson",
    data: enderlyModel.source,
  });

  map.addLayer({
    id: "enderly-ifc-highlight-fill",
    type: "fill",
    source: "enderly-ifc-highlight",
    minzoom: 11,
    paint: {
      "fill-color": "#f7e8b5",
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0.08, 14, 0.12, 16, 0.06],
    },
  });

  map.addLayer({
    id: "enderly-ifc-foundations",
    type: "fill-extrusion",
    source: "enderly-ifc-buildings",
    minzoom: 12.4,
    paint: {
      "fill-extrusion-color": "#4f5652",
      "fill-extrusion-height": 0.75,
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.48,
    },
  });

  map.addLayer({
    id: "enderly-ifc-model",
    type: "fill-extrusion",
    source: "enderly-ifc-buildings",
    minzoom: 12.4,
    paint: {
      "fill-extrusion-color": [
        "case",
        ["==", ["get", "render_class"], "small-house"],
        "#d9d2c4",
        ["==", ["get", "render_class"], "house"],
        "#c7bdae",
        ["==", ["get", "render_class"], "community-building"],
        "#b5bab4",
        ["==", ["get", "render_class"], "infrastructure"],
        "#8f9a99",
        "#c7bdae",
      ],
      "fill-extrusion-height": [
        "+",
        ["get", "height"],
        [
          "case",
          ["==", ["get", "render_class"], "infrastructure"],
          2.2,
          ["==", ["get", "render_class"], "community-building"],
          1.5,
          ["==", ["get", "render_class"], "small-house"],
          0.6,
          1,
        ],
      ],
      "fill-extrusion-base": 0,
      "fill-extrusion-opacity": 0.98,
      "fill-extrusion-vertical-gradient": true,
    },
  });

  map.addLayer({
    id: "enderly-ifc-highlight-outline",
    type: "line",
    source: "enderly-ifc-highlight",
    minzoom: 11,
    paint: {
      "line-color": "#f7e8b5",
      "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2, 14, 4.5, 16, 6],
      "line-opacity": 0.88,
      "line-dasharray": [1.4, 0.85],
      "line-blur": 0.25,
    },
  });

  map.addLayer({
    id: "enderly-ifc-footprint-halo",
    type: "line",
    source: "enderly-ifc-buildings",
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "render_class"], "infrastructure"],
        "#f0f2ec",
        "#fff9ea",
      ],
      "line-width": ["interpolate", ["linear"], ["zoom"], 12.5, 0.8, 16, 2.4],
      "line-opacity": 0.86,
    },
  });
}

function addEnderlyModelMarker() {
  if (enderlyModelMarker) return;

  const element = document.createElement("button");
  element.className = "enderly-model-marker";
  element.type = "button";
  element.textContent = "Enderly Park";
  element.setAttribute("aria-label", "Zoom to Enderly Park");
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    flyToEnderlyModel();
  });

  enderlyModelMarker = new maplibregl.Marker({
    element,
    anchor: "bottom",
  })
    .setLngLat(enderlyModel.center)
    .addTo(map);
}

function addRoadLabels() {
  if (roadLabelMarkers.length > 0) return;

  highlightedRoads.forEach((road) => {
    const element = document.createElement("div");
    element.className = "road-label-marker";
    element.style.setProperty("--road-color", road.color);
    element.textContent = road.name;

    const marker = new maplibregl.Marker({
      element,
      anchor: "center",
    })
      .setLngLat(road.labelCoords)
      .addTo(map);

    roadLabelMarkers.push(marker);
  });
}

function updateSelectedLocationText() {
  if (!pendingCoords) {
    selectedLocationText.textContent = "Map location: current view center";
    return;
  }

  selectedLocationText.textContent = `Selected map location: ${pendingCoords[1].toFixed(5)}, ${pendingCoords[0].toFixed(5)}`;
}

function setPendingLocation(coords) {
  pendingCoords = coords;
  updateSelectedLocationText();

  if (pendingMarker) pendingMarker.remove();

  const element = document.createElement("div");
  element.className = "pending-marker";
  element.textContent = "+";
  pendingMarker = new maplibregl.Marker({
    element,
    anchor: "center",
  })
    .setLngLat(coords)
    .addTo(map);
}

function clearPendingLocation() {
  pendingCoords = null;
  updateSelectedLocationText();

  if (pendingMarker) {
    pendingMarker.remove();
    pendingMarker = null;
  }
}

function openAddMemoryForm(coords) {
  activeId = null;
  detailPanel.classList.add("is-hidden");
  memoryForm.classList.remove("is-hidden");
  setPendingLocation(coords);
  renderPlaces();
}

function updateMemorySource() {
  const source = map.getSource("memory-buildings");
  if (source) source.setData(memoryFeatureCollection());
}

function renderMarkers() {
  memoryMarkers.forEach((marker) => marker.remove());
  memoryMarkers.clear();

  memoryPlaces.forEach((place) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `building-marker${place.id === activeId ? " is-active" : ""}`;
    element.textContent = place.year.toString().slice(2);
    element.setAttribute("aria-label", `Open memory for ${place.name}`);
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      openMemory(place.id);
    });

    const marker = new maplibregl.Marker({
      element,
      anchor: "bottom",
      offset: [0, -16],
    })
      .setLngLat(place.coords)
      .addTo(map);

    memoryMarkers.set(place.id, marker);
  });

  if (activeMarker) {
    activeMarker.remove();
    activeMarker = null;
  }

  const activePlace = memoryPlaces.find((place) => place.id === activeId);
  if (activePlace) {
    const label = document.createElement("div");
    label.className = "dialog-marker";
    label.innerHTML = `<strong>${activePlace.name}</strong><span>${activePlace.street}</span>`;
    activeMarker = new maplibregl.Marker({
      element: label,
      anchor: "bottom-left",
      offset: [18, -42],
    })
      .setLngLat(activePlace.coords)
      .addTo(map);
  }
}

function renderPlaces() {
  memoryList.innerHTML = "";
  buildingCount.textContent = memoryPlaces.length;
  memoryCount.textContent = memoryPlaces.length;

  memoryPlaces.forEach((place) => {
    const isActive = place.id === activeId;
    const card = document.createElement("button");
    card.className = `memory-card${isActive ? " is-active" : ""}`;
    card.type = "button";
    card.innerHTML = `<strong>${place.name}</strong><span>${place.street} · ${place.year}</span>`;
    card.addEventListener("click", () => openMemory(place.id));
    memoryList.appendChild(card);
  });

  updateMemorySource();
  renderMarkers();
}

function openMemory(id) {
  const place = memoryPlaces.find((item) => item.id === id);
  if (!place) return;

  activeId = id;
  renderPlaces();
  detailImage.src = place.image;
  detailImage.alt = `${place.name} memory reference`;
  detailStreet.textContent = place.street;
  detailTitle.textContent = place.name;
  detailDescription.textContent = place.description;
  detailYear.textContent = place.year;
  detailType.textContent = place.type;
  detailPanel.classList.remove("is-hidden");
  memoryForm.classList.add("is-hidden");
  clearPendingLocation();

  map.easeTo({
    center: place.coords,
    zoom: 16.6,
    pitch: 68,
    bearing: -36,
    duration: 900,
    padding: { right: 410, left: 40, top: 40, bottom: 40 },
  });
}

function openImageLightbox() {
  if (!detailImage.src) return;

  lightboxImage.src = detailImage.src;
  lightboxImage.alt = detailImage.alt || "Full memory image";
  lightboxCaption.textContent = detailTitle.textContent || "Memory image";
  imageLightbox.classList.remove("is-hidden");
}

function closeImageLightbox() {
  imageLightbox.classList.add("is-hidden");
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("alt");
  lightboxCaption.textContent = "";
}

async function deleteActiveMemory() {
  const place = memoryPlaces.find((item) => item.id === activeId);
  if (!place) return;

  const shouldDelete = window.confirm(`Delete "${place.name}" from the memory map?`);
  if (!shouldDelete) return;

  if (place.remote && supabaseClient) {
    const { data, error } = await supabaseClient.rpc("delete_memory", {
      p_memory_id: place.id,
      p_creator_token: creatorToken,
    });

    if (error) {
      window.alert("Could not delete this memory from the shared database.");
      console.warn("Could not delete shared memory", error.message);
      return;
    }

    if (!data) {
      window.alert("This shared memory can only be deleted from the browser that originally created it.");
      return;
    }
  }

  const index = memoryPlaces.findIndex((item) => item.id === activeId);
  if (index >= 0) memoryPlaces.splice(index, 1);

  activeId = null;
  detailPanel.classList.add("is-hidden");
  clearPendingLocation();
  renderPlaces();
}

function createFootprintFromPoint([lng, lat]) {
  const latOffset = 0.00022;
  const lngOffset = 0.00034;
  return [
    [lng - lngOffset, lat + latOffset],
    [lng + lngOffset, lat + latOffset * 0.85],
    [lng + lngOffset * 0.85, lat - latOffset],
    [lng - lngOffset, lat - latOffset * 0.8],
    [lng - lngOffset, lat + latOffset],
  ];
}

function normalizeRemoteMemory(row) {
  const coords = [Number(row.lng), Number(row.lat)];
  const footprint = Array.isArray(row.footprint) ? row.footprint : createFootprintFromPoint(coords);

  return {
    id: row.id,
    name: row.place_name,
    street: row.street,
    description: row.description,
    year: Number(row.memory_year) || new Date(row.created_at || Date.now()).getFullYear(),
    type: row.building_type || "Public space",
    coords,
    height: Number(row.height) || 36,
    footprint,
    image:
      row.image_url || "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    remote: true,
    creatorToken: row.creator_token,
  };
}

async function loadRemoteMemories() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from(supabaseTable)
    .select(memorySelectColumns)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Could not load shared memories", error.message);
    return;
  }

  if (data.length > 0 || !supabaseConfig.showSeedMemoriesWhenDatabaseEmpty) {
    memoryPlaces = data.map(normalizeRemoteMemory);
  } else {
    memoryPlaces = [...seedMemoryPlaces];
  }

  if (activeId && !memoryPlaces.some((place) => place.id === activeId)) {
    activeId = null;
    detailPanel.classList.add("is-hidden");
  }

  renderPlaces();
}

function readUploadedImage() {
  const file = imageInput.files && imageInput.files[0];
  if (!file) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function uploadMemoryImage(file, memoryId) {
  if (!file || !supabaseClient) return readUploadedImage();

  const extension = file.name.split(".").pop() || "jpg";
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const objectPath = `${creatorToken}/${memoryId}-${Date.now()}.${safeExtension}`;

  const { error } = await supabaseClient.storage.from(supabaseBucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabaseClient.storage.from(supabaseBucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function addMemoryFromForm(event) {
  event.preventDefault();

  const coords = pendingCoords || [map.getCenter().lng, map.getCenter().lat];
  const memoryId = crypto.randomUUID();
  const file = imageInput.files && imageInput.files[0];
  let uploadedImage = null;

  try {
    uploadedImage = await uploadMemoryImage(file, memoryId);
  } catch (error) {
    console.warn("Could not upload image", error.message);
    window.alert("The image could not be uploaded to shared storage. I will keep a local preview for this browser session.");
    uploadedImage = await readUploadedImage();
  }

  const height = 28 + Math.round(Math.random() * 28);
  const footprint = createFootprintFromPoint(coords);
  const draftPlace = {
    id: memoryId,
    name: document.querySelector("#placeNameInput").value,
    street: document.querySelector("#streetInput").value,
    description: document.querySelector("#descriptionInput").value,
    year: Number(document.querySelector("#yearInput").value) || new Date().getFullYear(),
    type: document.querySelector("#typeInput").value,
    coords,
    height,
    footprint,
    image:
      uploadedImage || "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  };
  let savedPlace = draftPlace;

  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from(supabaseTable)
      .insert({
        id: memoryId,
        place_name: draftPlace.name,
        street: draftPlace.street,
        description: draftPlace.description,
        memory_year: draftPlace.year,
        building_type: draftPlace.type,
        lng: coords[0],
        lat: coords[1],
        height,
        footprint,
        image_url: draftPlace.image,
        creator_token: creatorToken,
        status: "approved",
      })
      .select(memorySelectColumns)
      .single();

    if (error) {
      console.warn("Could not save shared memory", error.message);
      window.alert("The memory was added to this browser session, but it could not be saved to the shared database yet.");
    } else {
      savedPlace = normalizeRemoteMemory(data);
    }
  }

  if (supabaseClient && savedPlace.remote) {
    await loadRemoteMemories();
  } else {
    memoryPlaces.push(savedPlace);
  }
  memoryForm.reset();
  imagePreviewWrap.classList.add("is-hidden");
  imagePreview.removeAttribute("src");
  clearPendingLocation();
  openMemory(savedPlace.id);
}

function resetMapView() {
  activeId = null;
  detailPanel.classList.add("is-hidden");
  memoryForm.classList.add("is-hidden");
  clearPendingLocation();
  clearSearchMarker();
  clearSearchResults();
  locationSearchInput.value = "";
  setSearchStatus("");
  renderPlaces();
  map.easeTo({
    ...defaultMapView,
    duration: 800,
  });
}

function flyToEnderlyModel() {
  map.easeTo({
    center: enderlyModel.center,
    zoom: 15.2,
    pitch: 64,
    bearing: -32,
    duration: 900,
  });
}

function setSearchStatus(message) {
  searchStatus.textContent = message;
}

function clearSearchResults() {
  searchCandidates = [];
  searchResults.innerHTML = "";
  searchResults.classList.add("is-hidden");
}

function clearSearchMarker() {
  if (searchMarker) {
    searchMarker.remove();
    searchMarker = null;
  }
}

function isInsideMapBounds(candidate) {
  const [[west, south], [east, north]] = corridorBounds;
  return candidate.lng >= west && candidate.lng <= east && candidate.lat >= south && candidate.lat <= north;
}

function normalizeSearchCandidate(candidate) {
  const attributes = candidate.attributes || {};
  const lng = Number(candidate.location && candidate.location.x);
  const lat = Number(candidate.location && candidate.location.y);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

  return {
    label: attributes.PlaceName || attributes.ShortLabel || candidate.address || "Search result",
    detail: attributes.LongLabel || attributes.Place_addr || candidate.address || "Charlotte, NC",
    lng,
    lat,
    score: Number(candidate.score || 0),
  };
}

function renderSearchResults(candidates) {
  searchCandidates = candidates;
  searchResults.innerHTML = "";

  candidates.forEach((candidate, index) => {
    const resultButton = document.createElement("button");
    resultButton.type = "button";
    resultButton.dataset.index = String(index);

    const label = document.createElement("strong");
    label.textContent = candidate.label;

    const detail = document.createElement("span");
    detail.textContent = candidate.detail;

    resultButton.append(label, detail);
    searchResults.append(resultButton);
  });

  searchResults.classList.remove("is-hidden");
}

function selectSearchCandidate(candidate) {
  clearSearchMarker();

  const element = document.createElement("div");
  element.className = "search-location-marker";
  element.title = candidate.label;

  searchMarker = new maplibregl.Marker({
    element,
    anchor: "center",
  })
    .setLngLat([candidate.lng, candidate.lat])
    .addTo(map);

  map.easeTo({
    center: [candidate.lng, candidate.lat],
    zoom: Math.max(map.getZoom(), 15.35),
    pitch: Math.max(map.getPitch(), 58),
    bearing: map.getBearing(),
    duration: 900,
  });

  setSearchStatus(candidate.detail);
  clearSearchResults();
}

async function searchLocations(event) {
  event.preventDefault();

  const query = locationSearchInput.value.trim();
  if (!query) {
    clearSearchResults();
    setSearchStatus("Type a place, street, or address.");
    return;
  }

  clearSearchResults();
  setSearchStatus("Searching...");

  const searchText = /charlotte|north carolina|\bnc\b/i.test(query) ? query : `${query}, Charlotte, NC`;
  const [[west, south], [east, north]] = corridorBounds;
  const params = new URLSearchParams({
    SingleLine: searchText,
    f: "json",
    outFields: "PlaceName,ShortLabel,LongLabel,Place_addr,Addr_type",
    maxLocations: "6",
    sourceCountry: "USA",
    location: `${defaultMapView.center[0]},${defaultMapView.center[1]}`,
    searchExtent: `${west},${south},${east},${north}`,
  });
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Search failed with status ${response.status}`);

    const data = await response.json();
    const candidates = (data.candidates || [])
      .map(normalizeSearchCandidate)
      .filter(Boolean)
      .filter((candidate) => candidate.score >= 55 && isInsideMapBounds(candidate))
      .slice(0, 5);

    if (candidates.length === 0) {
      setSearchStatus("No nearby matches found.");
      return;
    }

    if (candidates.length === 1) {
      selectSearchCandidate(candidates[0]);
      return;
    }

    renderSearchResults(candidates);
    setSearchStatus(`${candidates.length} matches found.`);
  } catch (error) {
    console.warn("Location search failed", error.message);
    setSearchStatus("Search is not available right now.");
  }
}

function setupMapLayers() {
  if (mapLayersReady || !map.getStyle()) return;

  try {
    addBase3DBuildings();
    addMemoryLayers();
    addEnderlyModelLayer();
    addRoadLabels();
    addEnderlyModelMarker();
    mapLayersReady = true;
    renderPlaces();
    resetMapView();
  } catch (error) {
    console.warn("Map style is not ready yet", error.message);
  }
}

addMemoryButton.addEventListener("click", () => {
  const center = map.getCenter();
  openAddMemoryForm([center.lng, center.lat]);
});

cancelMemoryButton.addEventListener("click", () => {
  memoryForm.classList.add("is-hidden");
  clearPendingLocation();
});

closeDetailButton.addEventListener("click", () => {
  activeId = null;
  detailPanel.classList.add("is-hidden");
  renderPlaces();
});

openImageButton.addEventListener("click", openImageLightbox);
closeImageButton.addEventListener("click", closeImageLightbox);
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) closeImageLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageLightbox.classList.contains("is-hidden")) {
    closeImageLightbox();
  }
});

deleteMemoryButton.addEventListener("click", deleteActiveMemory);

resetViewButton.addEventListener("click", resetMapView);

memoryForm.addEventListener("submit", addMemoryFromForm);

searchForm.addEventListener("submit", searchLocations);

searchResults.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const candidate = searchCandidates[Number(button.dataset.index)];
  if (candidate) selectSearchCandidate(candidate);
});

angleControls.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  map.easeTo({
    bearing: Number(button.dataset.bearing),
    pitch: Number(button.dataset.pitch),
    duration: 700,
  });
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if (!file) {
    imagePreviewWrap.classList.add("is-hidden");
    imagePreview.removeAttribute("src");
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  imagePreview.src = previewUrl;
  imagePreviewWrap.classList.remove("is-hidden");
});

map.on("click", (event) => {
  const target = event.originalEvent.target;
  if (
    target.closest(".maplibregl-ctrl") ||
    target.closest(".maplibregl-marker") ||
    target.closest(".angle-controls") ||
    target.closest(".location-search")
  ) {
    return;
  }
  if (memoryForm.contains(event.originalEvent.target) || detailPanel.contains(event.originalEvent.target)) return;

  if (map.getLayer("memory-building-extrusions")) {
    const features = map.queryRenderedFeatures(event.point, {
      layers: ["memory-building-extrusions"],
    });
    const feature = features && features[0];
    if (feature) {
      openMemory(feature.properties.id);
      return;
    }
  }

  openAddMemoryForm([event.lngLat.lng, event.lngLat.lat]);
});

renderPlaces();
loadRemoteMemories();
map.on("style.load", setupMapLayers);
map.on("load", setupMapLayers);
map.on("idle", setupMapLayers);
map.on("error", (event) => {
  console.warn("Map loading issue", event && event.error ? event.error.message : event);
});

setTimeout(setupMapLayers, 1000);
setTimeout(setupMapLayers, 2500);

if (supabaseClient) {
  setInterval(() => {
    if (memoryForm.classList.contains("is-hidden")) loadRemoteMemories();
  }, 30000);
}

window.addEventListener("resize", () => {
  map.resize();
});
