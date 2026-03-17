import React, { useRef } from "react";
import { View, Pressable, Text, StyleSheet, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Region } from "react-native-maps";

export default function Map() {
  const mapRef = useRef<MapView>(null);

  // 초기 위치(서울 시청 근처 예시) - 원하는 좌표로 바꾸면 됨
  const initialRegion: Region = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const onPressSearch = () => {
    // 일단 버튼 동작 확인용
    Alert.alert("검색", "여기에 검색 로직을 붙이면 됨");

    // 예: 특정 위치로 이동
    // mapRef.current?.animateToRegion({
    //   latitude: 37.5700,
    //   longitude: 126.9769,
    //   latitudeDelta: 0.01,
    //   longitudeDelta: 0.01,
    // }, 800);
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={{ latitude: 37.5665, longitude: 126.9780 }} title="예시 마커" />
      </MapView>

      {/* 검색 버튼 (지도 위에 떠있게) */}
      <Pressable style={styles.searchBtn} onPress={onPressSearch}>
        <Text style={styles.searchBtnText}>검색</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  searchBtn: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    backgroundColor: "#fCAF50",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    elevation: 3, // android shadow
  },
  searchBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
});
