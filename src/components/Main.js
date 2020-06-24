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

// React imports
import React from "react";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
// import { mapLoaded } from "../redux/reducers/map";
import { startAuth, logout } from "../redux/reducers/auth";

// Component imports
import TopNav from "calcite-react/TopNav";
import TopNavBrand from "calcite-react/TopNav/TopNavBrand";
import TopNavTitle from "calcite-react/TopNav/TopNavTitle";
import TopNavList from "calcite-react/TopNav/TopNavList";
// import Map from "./esri/map/Map";
import LoadScreen from "./LoadScreen";
import UserAccount from "./UserAccount";

// import { render } from "react-dom";
import { GoldenLayoutComponent } from "./golden-layout-wrapper/goldenLayoutComponent";
import { MapWrapper } from "./MapWrapper";
import RequestsWrapper from "./RequestsWrapper";

import { AppContext } from "./golden-layout-wrapper/appContext";

// Styled Components
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
`;

// const MapWrapper = styled.div`
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   position: relative;
//   z-index: 0;
//   overflow: hidden;
// `;
const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  max-height: 30px;
  background-color: #4c4c4c;
  color: #ffffff;
  text-align: center;
  justify-content: center;
`;

const FooterAnchor = styled.a`
  color: #ffffff;
  padding-left: 2px;
`;

const Logo = styled(TopNavBrand)`
  justify-content: center;
  & img {
    height: 55px;
  }
`;

const Nav = styled(TopNav)`
  && {
    z-index: 5;
  }
`;

const NavList = styled(TopNavList)`
  text-align: left;
`;

const NavTitle = styled(TopNavTitle)`
  && {
    color: white;
  }
  :hover {
    color: #484848 !important;
  }
`;

// Component definition
const Main = (props) => {
  console.log(window);
  let CCIAPIInstance =  window.CCIAPI;
  console.log(CCIAPIInstance.addCall());
  const auth = useSelector((state) => state.auth);
  const config = useSelector((state) => state.config);
  const isMapLoaded = useSelector((state) => state.map.loaded);
  const dispatch = useDispatch();
  // Sign in button click event

  const signIn = () => {
    const { clientId, sessionId, popup } = config;
    dispatch(
      startAuth({
        clientId,
        sessionId,
        popup,
        signInRequest: true,
      })
    );
  };

  // Sign out button click event
  const signOut = () => {
    dispatch(logout(config.sessionId));
  };

  return (
    <Container>
      <LoadScreen isLoading={!isMapLoaded} />

      <Nav style={{
            background: config.companyInfo.primaryColor,
          }}>
        <Logo
          href="#"
          src={config.companyInfo.logoURL}
          style={{
            height: "100%",
            width: "5%",
            background: config.companyInfo.secondaryColor,
          }}
        />
        <NavTitle
          href="#"
          style={{
            width: "21%",
            background: config.companyInfo.secondaryColor,
            textAlign: "left",
            fontWeight: "bold",
            fontFamily: "cursive",
          }}
        >
          {config.companyInfo.name}
        </NavTitle>
        <NavList></NavList>
        <UserAccount
          user={auth.user}
          portal={auth.portal}
          token={auth.token}
          loggedIn={auth.loggedIn}
          signIn={signIn}
          signOut={signOut}
        />
      </Nav>

      <AppContext.Provider>
        <GoldenLayoutComponent //config from simple react example: https://golden-layout.com/examples/#qZXEyv
          htmlAttrs={{
            style: {
              padding: "1%",
              height: "98%",
              width: "98%",
              background: "#F4F4F4",
            },
          }}
          config={{
            content: [
              {
                type: "row",
                content: [
                  {
                    title: "Requests",
                    type: "react-component",
                    component: "leftWrapper",
                    width: 28,
                    height: 100,
                    props: {},
                    isClosable: false,
                  },
                  {
                    title: "MAP",
                    type: "react-component",
                    component: "mapWrapper",
                    props: { configurations: config.mapConfig },
                    width: 70,
                    height: 100,
                    isClosable: false,
                  },
                ],
              },
            ],
          }}
          registerComponents={(myLayout) => {
            myLayout.registerComponent("mapWrapper", MapWrapper);
            myLayout.registerComponent("leftWrapper", RequestsWrapper);
          }}
        />
      </AppContext.Provider>

      {/* <MapWrapper>
        <Map onMapLoaded={mapLoaded} mapConfig={config.mapConfig} />
      </MapWrapper> */}

      <Footer>
        <span>© {config.companyInfo.name}</span>
        <FooterAnchor href={config.companyInfo.websiteURL} target="_blank">
          {config.companyInfo.websiteURL}
        </FooterAnchor>
      </Footer>
    </Container>
  );
};

export default Main;
