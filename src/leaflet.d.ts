interface LeafletMap {
  setView(center: [number, number], zoom: number): this;
  addLayer(layer: LeafletMarkerClusterGroup): this;
  removeLayer(layer: LeafletMarkerClusterGroup): this;
  remove(): void;
}
interface LeafletTileLayer {
  addTo(map: LeafletMap): this;
}
interface DivIconOptions {
  html?: string;
  className?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
}
interface LeafletDivIcon {
  options: DivIconOptions;
}
interface LeafletMarker {
  addTo(map: LeafletMap | LeafletMarkerClusterGroup): this;
  bindTooltip(content: string, options?: { permanent?: boolean; direction?: string; opacity?: number }): this;
  on(event: string, fn: () => void): this;
  remove(): void;
}
interface LeafletMarkerOptions {
  icon?: LeafletDivIcon;
}
interface LeafletMarkerClusterGroup {
  addLayer(marker: LeafletMarker): this;
  addTo(map: LeafletMap): this;
  clearLayers(): this;
  remove(): void;
}
interface LeafletStatic {
  map(element: HTMLElement): LeafletMap;
  tileLayer(url: string, options: { attribution: string }): LeafletTileLayer;
  marker(latLng: [number, number], options?: LeafletMarkerOptions): LeafletMarker;
  divIcon(options: DivIconOptions): LeafletDivIcon;
  markerClusterGroup(options?: { maxClusterRadius?: number; spiderfyOnMaxZoom?: boolean; showCoverageOnHover?: boolean }): LeafletMarkerClusterGroup;
}
declare const L: LeafletStatic;
