import { View, TextInput, Alert, Image, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { useState, useEffect } from "react";
import BasicImg from "../../imgSource/BasicProfileImg.jpg";
import { firebaseAuth, firestoreDB } from "../../firebase";
import rnStorage from "@react-native-firebase/storage";
import Ionicons from "react-native-vector-icons/Ionicons";

function ServiceAdd({ navigation }) {
  const [uri, setUri] = useState(null);
  const [title, setTitle] = useState("");
  const [smpIntroduce, setSmpIntroduce] = useState("");
  const [describe, setDescribe] = useState("");
  const [price, setPrice] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("")
  const [user, setUser] = useState();
  const [docUser, setDocUser] = useState();

  useEffect(() => {
    const unsub = firebaseAuth.onChange(async (u) => {
      setUser(u);
      if (u?.uid) await loadData(u.uid);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  async function loadData(u) {
    const snps = await firestoreDB.getAllUsers();
    const list = snps.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const userData = list.find((item) => item.uid == u);
    setDocUser(userData);
  }

  async function uploadImageToStorage(localUri, svcFolder) {
    const safeFolder = (svcFolder || "service").replace(/[\/\\?#.%]+/g, "_");
    const fileName = `services/${safeFolder}/${Date.now()}.jpg`;
    const reference = rnStorage().ref(fileName);
    await reference.putFile(localUri);
    const downloadURL = await reference.getDownloadURL();
    return { downloadURL, storagePath: fileName };
  }

  async function pick() {
    const res = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
      quality: 0.8,
    });

    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert("에러", res.errorMessage || res.errorCode);
      return;
    }

    const picked = res.assets?.[0];
    if (!picked?.uri) return;
    setUri(picked.uri);
  }

  async function ServiceAddSubmit() {
    if (!docUser?.uid) {
      Alert.alert("경고", "로그인 정보를 불러오는 중입니다.");
      return;
    }

    if (!title.trim() || !smpIntroduce.trim() || !describe.trim() || !price.trim() || !province.trim() || !city.trim() || !uri) {
      Alert.alert("경고", "입력하지 않은 정보가 있습니다");
      return;
    }

    try {
      const uploaded = await uploadImageToStorage(uri, title);
      const photoURL = uploaded.downloadURL;
      const photoPath = uploaded.storagePath;
      const region = `${province} ${city}`;
      const name = docUser.sellerName

      await firestoreDB.addService(docUser.uid, {
        name, title, smpIntroduce, describe, price, region, type,
        photoURL, photoPath, createdAt: Date.now(),
      });

      Alert.alert("알림", "서비스 등록이 완료되었습니다.");
      setTitle("");
      setSmpIntroduce("");
      setDescribe("");
      setPrice("");
      setProvince("");
      setCity("");
      setUri(null);
      navigation.navigate("ServiceMng")
    } catch (e) {
      Alert.alert("경고", e.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>서비스 등록</Text>
          <Text style={styles.headerSubtitle}>판매할 서비스 정보를 입력하세요</Text>
        </View>

        {/* Image Upload */}
        <View style={styles.imageSection}>
          <Pressable onPress={pick} style={styles.imageContainer}>
            <Image
              source={uri ? { uri } : BasicImg}
              style={styles.image}
            />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.cameraText}>서비스 사진 선택</Text>
            </View>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Category */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="grid" size={20} color="#6B8CAE" />
              <Text style={styles.label}>서비스 분야</Text>
            </View>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                placeholder={{
                  label: `활동분야: ${docUser?.sellerType ?? "로딩 중"}`,
                  value: docUser?.sellerType ?? null,
                }}
                onValueChange={(value)=> setType(value)}
                items={[
                  { label: "일일 데이트", value:"일일 데이트" },
                  { label: "게임 데이트", value:"게임 데이트" },
                  { label: "전화 데이트", value:"전화 데이트" },
                  { label: "고민상담", value:"고민상담" },
                  { label: "SNS 사진 모델", value:"SNS 사진 모델" },
                  { label: "패션 모델", value:"패션 모델" },
                ]}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text" size={20} color="#6B8CAE" />
              <Text style={styles.label}>서비스 제목</Text>
            </View>
            <TextInput
              placeholder="서비스 제목을 입력하세요"
              placeholderTextColor="#6B8CAE"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          {/* Simple Intro */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#6B8CAE" />
              <Text style={styles.label}>서비스 소개</Text>
            </View>
            <TextInput
              placeholder="서비스 소개를 입력하세요"
              placeholderTextColor="#6B8CAE"
              value={smpIntroduce}
              onChangeText={setSmpIntroduce}
              multiline
              style={[styles.input, styles.textAreaSmall]}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="reader" size={20} color="#6B8CAE" />
              <Text style={styles.label}>상세 설명 및 자기소개</Text>
            </View>
            <TextInput
              placeholder="서비스 설명 및 자기소개를 입력하세요"
              placeholderTextColor="#6B8CAE"
              value={describe}
              onChangeText={setDescribe}
              multiline
              style={[styles.input, styles.textAreaLarge]}
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="cash" size={20} color="#6B8CAE" />
              <Text style={styles.label}>서비스 가격</Text>
            </View>
            <TextInput
              placeholder="가격을 입력하세요"
              placeholderTextColor="#6B8CAE"
              keyboardType="numeric"
              value={price}
              onChangeText={(text)=>{
                const onlyNums = text.replace(/[^0-9]/g, "")
                const formatNumber = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                setPrice(formatNumber)
              }}
              style={styles.input}
            />
            {price && (
              <Text style={styles.pricePreview}>{price}원</Text>
            )}
          </View>

          {/* Province */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="location" size={20} color="#6B8CAE" />
              <Text style={styles.label}>지역 선택</Text>
            </View>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                placeholder={{ label: "지역을 선택해주세요", value: null }}
                value={province}
                onValueChange={(value) => {
                  setProvince(value || "");
                  setCity("");
                }}
                items={[
                  { label: "경기도", value: "경기도" },
                  { label: "서울특별시", value: "서울특별시" },
                ]}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* City - 경기도 */}
          {province === "경기도" && (
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="business" size={20} color="#6B8CAE" />
                <Text style={styles.label}>시/군</Text>
              </View>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  placeholder={{ label: "시를 선택하세요", value: null }}
                  value={city}
                  onValueChange={(value) => setCity(value || "")}
                  items={[
                    { label: "수원시", value: "수원시" },
                    { label: "용인시", value: "용인시" },
                    { label: "고양시", value: "고양시" },
                    { label: "화성시", value: "화성시" },
                    { label: "성남시", value: "성남시" },
                    { label: "부천시", value: "부천시" },
                    { label: "남양주시", value: "남양주시" },
                    { label: "안산시", value: "안산시" },
                    { label: "평택시", value: "평택시" },
                    { label: "안양시", value: "안양시" },
                    { label: "시흥시", value: "시흥시" },
                    { label: "김포시", value: "김포시" },
                    { label: "파주시", value: "파주시" },
                    { label: "의정부시", value: "의정부시" },
                    { label: "하남시", value: "하남시" },
                    { label: "광주시", value: "광주시" },
                    { label: "광명시", value: "광명시" },
                    { label: "군포시", value: "군포시" },
                    { label: "양주시", value: "양주시" },
                    { label: "오산시", value: "오산시" },
                    { label: "이천시", value: "이천시" },
                    { label: "안성시", value: "안성시" },
                    { label: "구리시", value: "구리시" },
                    { label: "포천시", value: "포천시" },
                    { label: "의왕시", value: "의왕시" },
                    { label: "여주시", value: "여주시" },
                    { label: "과천시", value: "과천시" },
                    { label: "동두천시", value: "동두천시" },
                    { label: "가평군", value: "가평군" },
                    { label: "양평군", value: "양평군" },
                    { label: "연천군", value: "연천군" },
                  ]}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
          )}

          {/* City - 서울 */}
          {province === "서울특별시" && (
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="business" size={20} color="#6B8CAE" />
                <Text style={styles.label}>구</Text>
              </View>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  placeholder={{ label: "구를 선택하세요", value: null }}
                  value={city}
                  onValueChange={(value) => setCity(value || "")}
                  items={[
                    { label: "강남구", value: "강남구" },
                    { label: "강동구", value: "강동구" },
                    { label: "강북구", value: "강북구" },
                    { label: "강서구", value: "강서구" },
                    { label: "관악구", value: "관악구" },
                    { label: "광진구", value: "광진구" },
                    { label: "구로구", value: "구로구" },
                    { label: "금천구", value: "금천구" },
                    { label: "노원구", value: "노원구" },
                    { label: "도봉구", value: "도봉구" },
                    { label: "동대문구", value: "동대문구" },
                    { label: "동작구", value: "동작구" },
                    { label: "마포구", value: "마포구" },
                    { label: "서대문구", value: "서대문구" },
                    { label: "서초구", value: "서초구" },
                    { label: "성동구", value: "성동구" },
                    { label: "성북구", value: "성북구" },
                    { label: "송파구", value: "송파구" },
                    { label: "양천구", value: "양천구" },
                    { label: "영등포구", value: "영등포구" },
                    { label: "용산구", value: "용산구" },
                    { label: "은평구", value: "은평구" },
                    { label: "종로구", value: "종로구" },
                    { label: "중구", value: "중구" },
                    { label: "중랑구", value: "중랑구" },
                  ]}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
          )}

          {/* Selected Location Display */}
          {province && city && (
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={16} color="#4A9EFF" />
              <Text style={styles.locationText}>{province} {city}</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={ServiceAddSubmit}>
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>서비스 등록</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  scrollView: { flex: 1 },

  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 24 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#6B8CAE' },

  imageSection: { alignItems: 'center', paddingVertical: 24 },
  imageContainer: { position: 'relative' },
  image: { width: 300, height: 300, borderRadius: 16, backgroundColor: '#1A3A5C' },
  cameraOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(10, 22, 40, 0.85)', paddingVertical: 16, alignItems: 'center', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cameraText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginTop: 8 },

  form: { paddingHorizontal: 24, gap: 20 },
  inputGroup: { backgroundColor: '#0F2138', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#1A3A5C' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  input: { backgroundColor: '#1A3A5C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#FFFFFF' },
  textAreaSmall: { minHeight: 80, textAlignVertical: 'top', paddingTop: 14 },
  textAreaLarge: { minHeight: 150, textAlignVertical: 'top', paddingTop: 14 },
  pricePreview: { fontSize: 18, fontWeight: '700', color: '#4A9EFF', marginTop: 12 },

  pickerContainer: { backgroundColor: '#1A3A5C', borderRadius: 8, overflow: 'hidden' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A3A5C', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  locationText: { fontSize: 14, fontWeight: '600', color: '#4A9EFF' },

  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', marginHorizontal: 24, marginTop: 32, paddingVertical: 18, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

const pickerSelectStyles = {
  inputIOS: { fontSize: 15, paddingVertical: 14, paddingHorizontal: 16, color: '#FFFFFF' },
  inputAndroid: { fontSize: 15, paddingVertical: 14, paddingHorizontal: 16, color: '#FFFFFF' },
  placeholder: { color: '#6B8CAE' },
};

export default ServiceAdd;