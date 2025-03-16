import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  DrawerNavigationEventMap,
} from "@react-navigation/drawer";
import { withLayoutContext } from "expo-router";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";

const { Navigator } = createDrawerNavigator();

type DrawerProps = {
  id?: string;
  children: React.ReactNode;
};

// This can be used like `<Drawer />`
export const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof Navigator,
  DrawerNavigationState<ParamListBase>,
  DrawerNavigationEventMap
>(Navigator);