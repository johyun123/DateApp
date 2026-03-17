/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Pressable } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Ionicons from "react-native-vector-icons/Ionicons";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { SafeAreaView } from "react-native-safe-area-context"

import MainAccount from "./screens/MainAccount/MainAccount"
import Login from "./screens/Login/Login"
import Register from "./screens/Register/Register"
import MainPage from "./screens/MainPage/MainPage"
import EditProfile from "./screens/EditProfile/EditProfile"
import SellerJoin from "./screens/SellerJoin/SellerJoin"
import EditSeller from "./screens/EditSeller/EditSeller"
import ServiceAdd from "./screens/ServiceAdd/ServiceAdd"
import ServiceMng from "./screens/ServiceMng/ServiceMng"
import ServicePage from "./screens/ServicePage/ServicePage"
import Payment from "./screens/Payment/Payment"
import TradePage from "./screens/TradePage/TradePage"
import CreditMng from "./screens/CreditMng/CreditMng"
import SelledPage from "./screens/SelledPage/SelledPage"
import Revenue from "./screens/Revenue/Revenue"

import PayMng from "./screens/PayMng/PayMng"

import Category from "./screens/Category/Category"
import AdviceDate from "./screens/Category/AdviceDate"
import CallDate from "./screens/Category/CallDate"
import DailyDate from "./screens/Category/DailyDate"
import FassionModel from "./screens/Category/FassionModel"
import GameDate from "./screens/Category/GameDate"
import Matching from "./screens/Category/Matching"
import SnsModel from "./screens/Category/SnsModel"

import Map from "./screens/Map/Map"
import MyPage from "./screens/MyPage/MyPage"
import WishList from "./screens/WishList/WishList"
import ChatList from "./screens/ChatList/ChatList"

import CustomDrawerContent from "./screens/Util/CustomDrawerContent"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🎨 Dark Theme Colors
const COLORS = {
  background: '#0A1628',
  card: '#0F2138',
  border: '#1A3A5C',
  primary: '#4A9EFF',
  text: '#FFFFFF',
  textSecondary: '#6B8CAE',
  inactive: '#4A5A6B',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MainPage"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home-outline";

          if (route.name === "Category") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "MainPage") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "WishList") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "MyPage") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "ChatList") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Category"
        component={Category}
        options={{ title: "카테고리" }}
      />
      <Tab.Screen
        name="WishList"
        component={WishList}
        options={{ title: "찜" }}
      />
      <Tab.Screen
        name="MainPage"
        component={MainPage}
        options={{ title: "홈" }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{ title: "메시지" }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{ title: "내 정보" }}
      />
    </Tab.Navigator>
  );
}

// 🎨 Common Header Styles
const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: COLORS.background,
  },
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

function App() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainAccount"
          screenOptions={{
            ...commonHeaderOptions,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen
            name="MainAccount"
            component={MainAccount}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TabRoot"
            component={TabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: "프로필 편집" }}
          />

          <Stack.Screen
            name="SellerJoin"
            component={SellerJoin}
            options={{ title: "판매자 등록" }}
          />

          <Stack.Screen
            name="EditSeller"
            component={EditSeller}
            options={{ title: "판매자 프로필 편집" }}
          />

          <Stack.Screen
            name="ServiceAdd"
            component={ServiceAdd}
            options={{ title: "서비스 등록" }}
          />

          <Stack.Screen
            name="ServiceMng"
            component={ServiceMng}
            options={{ title: "서비스 관리" }}
          />

          <Stack.Screen
            name="PayMng"
            component={PayMng}
            options={{ title: "수익 관리" }}
          />

          <Stack.Screen
            name="AdviceDate"
            component={AdviceDate}
            options={{ title: "고민상담" }}
          />

          <Stack.Screen
            name="CallDate"
            component={CallDate}
            options={{ title: "전화 데이트" }}
          />

          <Stack.Screen
            name="DailyDate"
            component={DailyDate}
            options={{ title: "일일 데이트" }}
          />

          <Stack.Screen
            name="FassionModel"
            component={FassionModel}
            options={{ title: "패션 모델" }}
          />

          <Stack.Screen
            name="GameDate"
            component={GameDate}
            options={{ title: "게임 데이트" }}
          />

          <Stack.Screen
            name="Matching"
            component={Matching}
            options={{ title: "매칭 서비스" }}
          />

          <Stack.Screen
            name="SnsModel"
            component={SnsModel}
            options={{ title: "SNS 모델" }}
          />

          <Stack.Screen
            name="ServicePage"
            component={ServicePage}
            options={{ title: "서비스 소개" }}
          />

          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ title: "결제하기" }}
          />

          <Stack.Screen
            name="TradePage"
            component={TradePage}
            options={{ title: "예약 상세" }}
          />

          <Stack.Screen
            name="CreditMng"
            component={CreditMng}
            options={{ title: "결제 관리" }}
          />

          <Stack.Screen
            name="SelledPage"
            component={SelledPage}
            options={{ title: "거래 관리" }}
          />

          <Stack.Screen
            name="Revenue"
            component={Revenue}
            options={{ title: "수익 관리" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;