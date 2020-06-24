import React from "react";
import { Col, Row } from "react-styled-flexboxgrid";
import MegaPhoneIcon from "calcite-ui-icons-react/MegaPhoneIcon";
import LayerPolygonServiceIcon from "calcite-ui-icons-react/LayerPolygonServiceIcon";
import PlayIcon from "calcite-ui-icons-react/PlayIcon";
import ResetIcon from "calcite-ui-icons-react/ResetIcon";
import RefreshIcon from "calcite-ui-icons-react/RefreshIcon";
import MagnifyingGlassIcon from "calcite-ui-icons-react/MagnifyingGlassIcon";
import ShoppingCartIcon from "calcite-ui-icons-react/ShoppingCartIcon";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { requestTypeChange } from "../redux/reducers/deliveryRequests";
import {
  mapRequestsOrdered,
  mapExtentAction,
  mapRefresh,
} from "../redux/reducers/map";

const Span20px = styled.span`
  font-size: 20px;
`;

const DivOverflowY = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
`;

const H3NoMargin = styled.h3`
  margin: 0;
`;

const PNoMargin = styled.p`
  margin: 0;
`;

const StyledButton = styled.button`
  background: transparent;
  color: white;
  border: 0;
  cursor: pointer;
`;
const StyledRow = styled(Row)`
  && {
    background: #000000;
    color: white;
    min-height: 40px;
    position: relative;
  }
`;
const Triangle = styled.div`
   {
    content: "";
    position: relative;
    top: 0;
    left: 10%;
    margin-left: -10px;
    width: 0;
    height: 0;
    border-top: solid 10px #000000;
    border-left: solid 10px transparent;
    border-right: solid 10px transparent;
  }
`;

const NumberedCircle = styled.div`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 8px;

  background: #ccc;
  color: #666;
  text-align: center;

  font: 32px Arial, sans-serif;
  font-weight: bold;
`;

const SmallNumberedCircle = styled.div`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 6px;

  background: #ccc;
  color: #666;
  text-align: center;

  font: 24px Arial, sans-serif;
  font-weight: bold;
`;

const ReversedSmallNumberedCircle = styled.div`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 4px;

  background: #fff;
  color: #666;
  text-align: center;

  font: 24px Arial, sans-serif;
  font-weight: bold;
`;

const H2NoMarginCentered = styled.h2`
  margin: 0;
  text-align: center;
  text-align: -webkit-center;
`;

const RequestsWrapper = () => {
  let listOfRequestsOrderedForRoute = [];
  const dispatch = useDispatch();
  const refresh = () => {
    dispatch(mapRefresh(true));
  };
  const magnify = () => {
    console.log("magnify");
    dispatch(mapExtentAction(true));
  };
  const changeType = (type) => {
    dispatch(requestTypeChange(type));
  };
  const companyInfo = useSelector((state) => state.config.companyInfo);
  const getRouteList = () => {
    let list = getRoutesFromRequests();
    return list;
  };

  const getRoutesFromRequests = () => {
    const shop = {
      type: "SHOP",
      quantity: 0,
      name: companyInfo.name,
      x: -13150434.468,
      y: 4051557.357,
      latitude: companyInfo.data.shopLocation.latitude,
      longitude: companyInfo.data.shopLocation.longitude,
    };
    let arrayOfRoutes = []; // array of routes like [ahmed,mohamed,ali,SHOP,omar,....]
    arrayOfRoutes.push(shop);
    let currentCarrierSizeOfTruck = 0;
    for (let index = 0; index < requests.length; index++) {
      const element = requests[index];
      if (
        currentCarrierSizeOfTruck + element.attributes.quantity >
        companyInfo.data.deliveryTruckCapacity
      ) {
        arrayOfRoutes.push(shop);
        currentCarrierSizeOfTruck = 0;
      }
      arrayOfRoutes.push({
        type: "CUSTOMER",
        quantity: element.attributes.quantity,
        name: element.attributes.client_name,
        x: element.geometry.x,
        y: element.geometry.y,
        latitude: null,
        longitude: null,
      });
      currentCarrierSizeOfTruck += element.attributes.quantity;
    }
    listOfRequestsOrderedForRoute = arrayOfRoutes;
    return arrayOfRoutes;
  };
  const play = () => {
    let dataToStore = [...listOfRequestsOrderedForRoute];
    dataToStore.map((point) => (point.type = "point"));
    dispatch(mapRequestsOrdered(dataToStore));
  };

  const requests = useSelector((state) => state.map.requests);
  const type = useSelector((state) => state.requests.type);

  return (
    <DivOverflowY>
      <StyledRow
        style={{
          background: companyInfo.primaryColor,
        }}
      >
        <Col
          xs={8}
          sm={8}
          md={8}
          center={true}
          lg={(true, 8)}
          style={{
            textAlign: "left",
            paddingLeft: "1rem",
            placeSelf: "center",
            alignItems: "center",
          }}
        >
          {type === "Plan" ? (
            <Span20px>
              <LayerPolygonServiceIcon size={16} /> Plan
            </Span20px>
          ) : (
            <div>
              <Span20px>
                <MegaPhoneIcon size={16} /> Requests
              </Span20px>
            </div>
          )}
        </Col>
        <Col
          xs={4}
          sm={4}
          md={4}
          lg={(true, 4)}
          style={{ placeSelf: "center" }}
        >
          {type === "Plan" ? (
            <Span20px>
              <Row>
                <Col xs={6} sm={6} md={6} lg={(true, 6)}>
                  <StyledButton key="PlayIcon">
                    <PlayIcon size={24} onClick={() => play()} />{" "}
                  </StyledButton>
                </Col>
                <Col xs={6} sm={6} md={6} lg={(true, 6)}>
                  <StyledButton key="ResetIcon">
                    <ResetIcon
                      onClick={() => changeType("Request")}
                      size={24}
                    />
                  </StyledButton>
                </Col>
              </Row>
            </Span20px>
          ) : (
            <Span20px>
              <Row>
                <Col xs={4} sm={4} md={4} lg={(true, 4)}>
                  <StyledButton>
                    <RefreshIcon size={24} onClick={() => refresh()} />{" "}
                  </StyledButton>
                </Col>
                <Col xs={4} sm={4} md={4} lg={(true, 4)}>
                  <StyledButton>
                    <MagnifyingGlassIcon size={24} onClick={() => magnify()} />{" "}
                  </StyledButton>
                </Col>
                <Col xs={4} sm={4} md={4} lg={(true, 4)}>
                  <StyledButton>
                    <LayerPolygonServiceIcon
                      size={24}
                      onClick={() => changeType("Plan")}
                    />
                  </StyledButton>
                </Col>
              </Row>
            </Span20px>
          )}
        </Col>
      </StyledRow>

      <Triangle style={{ borderTopColor: companyInfo.primaryColor }}></Triangle>

      <Row style={{ marginTop: "-10px" }}>
        <Col xs={12} sm={12} md={12} lg={(true, 12)}>
          {type === "Plan"
            ? getRouteList().map((item, index) => {
                return (
                  <Row
                    style={{
                      backgroundColor:
                        item.type === "SHOP" ? "#9b9b9b" : "#ffffff",
                      color: item.type === "SHOP" ? "black" : "inherit",
                      borderBottom: "gray 1px solid",
                      minHeight: "3rem",
                      padding: "1%",
                    }}
                    key={index}
                  >
                    <Col
                      xs={3}
                      sm={3}
                      md={3}
                      lg={(true, 3)}
                      style={{ placeSelf: "center" }}
                    >
                      {item.type === "SHOP" ? (
                        <H2NoMarginCentered>
                          <ReversedSmallNumberedCircle>
                            <ShoppingCartIcon size={24} />
                          </ReversedSmallNumberedCircle>
                        </H2NoMarginCentered>
                      ) : (
                        <H2NoMarginCentered>
                          <SmallNumberedCircle>
                            {item.quantity}
                          </SmallNumberedCircle>
                        </H2NoMarginCentered>
                      )}
                    </Col>

                    <Col
                      xs={9}
                      sm={9}
                      md={9}
                      lg={(true, 9)}
                      style={{ alignSelf: "center" }}
                    >
                      <PNoMargin>
                        <b>{item.name}</b>
                      </PNoMargin>
                    </Col>
                  </Row>
                );
              })
            : requests.map((value, index) => {
                return (
                  <Row
                    style={{
                      backgroundColor: "#f4f4f4",
                      borderBottom: "black 1px solid",
                      padding: "1%",
                      textAlign: "left",
                    }}
                    key={index}
                  >
                    <Col xs={9} sm={9} md={9} lg={(true, 9)}>
                      <H3NoMargin>{value.attributes.client_name}</H3NoMargin>
                      <PNoMargin
                        style={{
                          color: companyInfo.secondaryColor,
                          fontWeight: "bold",
                        }}
                      >
                        {value.attributes.address}
                      </PNoMargin>
                    </Col>
                    <Col
                      xs={3}
                      sm={3}
                      md={3}
                      lg={(true, 3)}
                      style={{ placeSelf: "center" }}
                    >
                      <H2NoMarginCentered>
                        <NumberedCircle>
                          {value.attributes.quantity}
                        </NumberedCircle>
                      </H2NoMarginCentered>
                    </Col>
                  </Row>
                );
              })}
        </Col>
      </Row>
    </DivOverflowY>
  );
};

export default RequestsWrapper;
