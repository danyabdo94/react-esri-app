import React, { useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  mapRequests,
  mapShop,
  mapLoaded,
  mapExtentAction,
} from "../redux/reducers/map";


// hooks allow us to create a map component as a function

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export function EsriMap({ id, mapOptions }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);
  const dispatch = useDispatch();
  const requestsOrdered = useSelector((state) => state.map.requestsOrdered);
  const isExtent = useSelector((state) => state.map.isExtent);
  const isRefresh = useSelector((state) => state.map.isRefresh);
  let currentZoom = useRef(null);
  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      let view;
      // the following code is based on this sample:
      // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
      // first lazy-load the esri classes
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/MapImageLayer",
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/GraphicsLayer",
          "esri/tasks/RouteTask",
          "esri/tasks/support/RouteParameters",
          "esri/tasks/support/FeatureSet",
          "esri/Graphic",
          "esri/geometry/support/webMercatorUtils",
          "esri/geometry/Point",
          "esri/geometry/Extent",
          "esri/core/watchUtils",
          "esri/widgets/Print",
          "esri/Color",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/geometry/Polyline",
          "esri/symbols/SimpleLineSymbol",
          "dojox/gfx/fx",
          "dojo/_base/lang",
        ],
        {
          css: true,
        }
      ).then(
        ([
          Map,
          MapView,
          MapImageLayer,
          QueryTask,
          Query,
          GraphicsLayer,
          RouteTask,
          RouteParameters,
          FeatureSet,
          Graphic,
          webMercatorUtils,
          Point,
          Extent,
          watchUtils,
          Print,
          Color,
          SimpleMarkerSymbol,
          Polyline,
          SimpleLineSymbol,
          fx,
          lang,
        ]) => {
          const currentZoomVal = currentZoom.current
            ? currentZoom.current
            : mapOptions.zoom;

          // then we load a web map from an id
          let routeLayer = new GraphicsLayer();
          let routeTask = new RouteTask({
            url:
              "http://204.11.33.8:6080/arcgis/rest/services/GSS/Routing_ServiceArea/NAServer/Route",
          });
          let routeParams = new RouteParameters({
            stops: new FeatureSet(),
            outSpatialReference: {
              // autocasts as new SpatialReference()
              wkid: 3857,
            },
          });
          let stopSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            style: "cross",
            size: 15,
            outline: {
              // autocasts as new SimpleLineSymbol()
              width: 4,
            },
          };

          // Define the symbology used to display the route
          let routeSymbol = {
            type: "simple-line", // autocasts as SimpleLineSymbol()
            color: [0, 0, 255, 0.5],
            width: 5,
          };
          const map = new Map({
            ...mapOptions,
            zoom: currentZoomVal,
            basemap: "streets",
            layers: [routeLayer], // Add the route layer to the map
          });
          // show the map at the element
          let view = new MapView({
            map,
            container: mapEl.current,
            ...mapOptions,
            zoom: currentZoomVal,
          });
          let layer = new MapImageLayer({
            url:
              "http://192.168.9.95:6080/arcgis/rest/services/GSS/StoreDelivery/MapServer",
          });
          getQuery();

          let queryTask2 = new QueryTask({
            url:
              "http://192.168.9.95:6080/arcgis/rest/services/GSS/StoreDelivery/MapServer/1",
          });
          let query2 = new Query();
          query2.returnGeometry = true;
          query2.outFields = ["*"];
          query2.where = "";

          queryTask2.executeJSON(query2).then((results) => {
            dispatch(mapShop(results));
          });

          map.add(layer);

          if (requestsOrdered && requestsOrdered.length) {
            requestsOrdered.forEach((element) => {
              let newPoint = new Point({
                x: element.x,
                y: element.y,
                spatialReference: {
                  wkid: 102100,
                  latestWkid: 3857,
                },
              });

              addStop(newPoint);
            });
          }
          var print = new Print({
            view: view,
            printServiceUrl:
              "http://192.168.9.95:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
          });

          view.ui.add(print, {
            position: "top-left",
          });

          if (isExtent) {
            // let extent = new Extent();
            layer.when(function () {
              view.goTo(layer.fullExtent);
            });
          }

          if (isRefresh) {
            // let extent = new Extent();
            getQuery();
          }

          function getQuery() {
            let queryTask = new QueryTask({
              url:
                "http://192.168.9.95:6080/arcgis/rest/services/GSS/StoreDelivery/MapServer/0",
            });
            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ["*"];
            query.orderByFields = ["req_date"];
            query.where = "quantity > 0";

            queryTask.executeJSON(query).then((results) => {
              dispatch(mapRequests(results.features));
            });
          }

          function addStop(point) {
            // Add a point at the location of the map click
            let stop = new Graphic({
              geometry: point,
              symbol: stopSymbol,
            });
            routeLayer.add(stop);

            // Execute the route task if 2 or more stops are input
            routeParams.stops.features.push(stop);
            routeTask.solve(routeParams).then(showRoute, (err) => {
              console.log(err);
            });
          }
          // Adds the solved route to the map as a graphic
          function showRoute(data) {
            let routeResult = data.routeResults[0].route;
            routeResult.symbol = routeSymbol;
            routeLayer.add(routeResult);
          }

          // eslint-disable-next-line
          let beginScale = null;

          watchUtils.when(view, "interacting", function () {
            beginScale = view.get("scale");
            dispatch(mapExtentAction(false));
          });
          watchUtils.when(view, "stationary", function () {
            const currentZoomLevel = view.get("zoom");
            currentZoom.current = currentZoomLevel;
          });

          // wait for the view to load TODO: may not need this?
          return view.when(() => {
            dispatch(mapLoaded());
            // return a reference to the view
            return view;
          });
        }
      );
      return () => {
        // clean up the map view
        if (!!view) {
          view.destroy();
          view = null;
        }
      };
    },
    // only re-load the map if the id has changed
    [id, mapOptions, dispatch, requestsOrdered, isExtent, isRefresh]
  );
  return <Container ref={mapEl}></Container>;
}
