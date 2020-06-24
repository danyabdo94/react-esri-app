import React from "react";
import Map from "./esri/map/Map";
import { mapLoaded } from "../redux/reducers/map";

export class MapWrapper extends React.Component {
  render() {
    return (
      <Map
        onMapLoaded={mapLoaded}
        mapConfig={this.props.configurations}
      ></Map>
    );
  }
}
