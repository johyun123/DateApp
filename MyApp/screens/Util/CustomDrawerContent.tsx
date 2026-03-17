import { View, Alert, Pressable, Text } from "react-native"
import { createDrawerNavigator, DrawerContentScrollView,
    DrawerItemList } from "@react-navigation/drawer"
import { firebaseAuth } from "../../firebase"

function CustomDrawerContent(props: any) {
    const { navigation } = props;

  async function logout(){
    try {
      await firebaseAuth.logout();
      Alert.alert("알림", "로그아웃 되었습니다.");
      navigation.navigate("MainAccount");
    } catch (e) {
      Alert.alert("에러", e.message);
    }
  };


  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* ✅ 기존 드로워 메뉴들 그대로 출력 */}
      <DrawerItemList {...props} />

      {/* ✅ 아래쪽 고정 영역 */}
      <View style={{ marginTop: "auto", padding: 16 }}>
        <View style={{ flexDirection: "row" }}>

          <Pressable
            onPress={() => navigation.navigate("MyPage")}
            style={{
              flex: 1,
              backgroundColor: "#E9E9E9",
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontWeight: "700", color: "#222" }}>내정보</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              backgroundColor: "#FF4D4D",
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800", color: "white" }}>로그아웃</Text>
          </Pressable>

        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent