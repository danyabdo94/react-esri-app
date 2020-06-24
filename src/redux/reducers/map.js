// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// ACTION TYPES //
export const types = {
  MAP_LOADED: "MAP_LOADED",
  MAP_REQUESTS: "MAP_REQUESTS",
  MAP_SHOP: "MAP_SHOP",
  MAP_REQUESTS_ORDERED: "MAP_REQUESTS_ORDERED",
  MAP_EXTENT_ACTION: "MAP_EXTENT_ACTION",
  MAP_REFRESH: "MAP_REFRESH",
};

// REDUCERS //
export const initialState = {
  loaded: false,
  requests: [],
  isExtent: false,
  isRefresh: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.MAP_LOADED:
      return {
        ...state,
        loaded: true,
      };
    case types.MAP_REQUESTS:
      const { requests } = action.payload;
      return {
        ...state,
        requests: requests,
      };
    case types.MAP_SHOP:
      const { shopData } = action.payload;
      return {
        ...state,
        shopData: shopData,
      };
    case types.MAP_REQUESTS_ORDERED:
      const { requestsOrdered } = action.payload;
      return {
        ...state,
        requestsOrdered: requestsOrdered,
      };

    case types.MAP_EXTENT_ACTION:
      const { isExtent } = action.payload;
      return {
        ...state,
        isExtent: isExtent,
      };

    case types.MAP_REFRESH: {
      const { isRefresh } = action.payload;
      return {
        ...state,
        isRefresh: isRefresh,
      };
    }
    default:
      return state;
  }
};

// ACTIONS //
export const mapLoaded = () => ({ type: types.MAP_LOADED, payload: {} });

export const mapRequests = (requests) => ({
  type: types.MAP_REQUESTS,
  payload: { requests },
});

export const mapShop = (shopData) => ({
  type: types.MAP_SHOP,
  payload: { shopData },
});

export const mapRequestsOrdered = (requestsOrdered) => ({
  type: types.MAP_REQUESTS_ORDERED,
  payload: { requestsOrdered },
});

export const mapExtentAction = (isExtent) => ({
  type: types.MAP_EXTENT_ACTION,
  payload: { isExtent },
});

export const mapRefresh = (isRefresh) => ({
  type: types.MAP_REFRESH,
  payload: { isRefresh },
});
