import { View, Text, Image, ScrollView, Alert, Pressable, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

import rnStorage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import BasicImg from "../../imgSource/BasicProfileImg.jpg";

function MyPage({ navigation }){
  const [mode, setMode] = useState(false)
  const [openReserved, setOpenReserved] = useState(false)
  const [user, setUser] = useState()
  const [docUser, setDocUser] = useState()
  const [tradesData, setTradesData] = useState([])
  const [sellerTradesData, setSellerTradesData] = useState([])
  const [profileUrl, setProfileUrl] = useState("")
  const [sellerUrl, setSellerUrl] = useState("")
  const [openServiceSchedule, setOpenServiceSchedule] = useState(false)

  useEffect(()=>{
    firebaseAuth.onChange(async (u)=>{
         if (!u) {
              setUser(null)
              setDocUser(null)
              return
            }
      setUser(u);
      await loadData(u.uid)
      await loadTrades(u.uid)
    });
  }, [docUser])

  async function loadData(uid){
    const snps = await firestoreDB.getAllUsers()
    const list = snps.docs.map((doc)=>({
      id: doc.id,
      ...doc.data()
    }));
    const userData = list.find(item=>item.uid == uid)
    setDocUser(userData)
    setProfileUrl(userData?.profileImgURL ?? "")
    setSellerUrl(userData?.sellerImgURL ?? "")
  }

  async function uploadProfileToStorage(localUri, uid) {
  if(!mode){
    const path = `profiles/${uid}/${Date.now()}.jpg`;
    const ref = rnStorage().ref(path);
    await ref.putFile(localUri);
    const downloadURL = await ref.getDownloadURL();
    return { downloadURL, storagePath: path };
    } else {
        const path = `sellers/${uid}/${Date.now()}.jpg`;
            const ref = rnStorage().ref(path);
            await ref.putFile(localUri);
            const downloadURL = await ref.getDownloadURL();
            return { downloadURL, storagePath: path };
        }
  }

    async function loadTrades(uid){
            const snps = await firestoreDB.getAllTrades()
            const list = snps.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
                }))
            const filtered = list.filter(item=>item.uid == uid)
            const sellerFiltered = list.filter(item=>
                item.sellerUid == uid)
            setTradesData(filtered)
            setSellerTradesData(sellerFiltered)
            }

  async function pick() {
    if (!user?.uid || !docUser?.id) {
      Alert.alert("알림", "유저 정보 로딩 중이야. 잠깐만!")
      return;
    }

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

    try {
        if(!mode){
          const { downloadURL, storagePath } = await uploadProfileToStorage(picked.uri, user.uid);
          await firestoreDB.updateUserData(docUser.id, {
            profileImgURL: downloadURL,
            profileImgPath: storagePath,
          });
          setProfileUrl(downloadURL);
        } else {
              const { downloadURL, storagePath } = await uploadProfileToStorage(picked.uri, user.uid);
              await firestoreDB.updateUserData(docUser.id, {
                sellerImgURL: downloadURL,
                sellerImgPath: storagePath,
              });
              setSellerUrl(downloadURL);
            }

      Alert.alert("완료", "프로필 사진이 변경되었습니다.")
    } catch (e) {
      Alert.alert("업로드 실패", e.message)
    }
  }

  async function Logout(){
    try{
      await firebaseAuth.logout()
      navigation.navigate("MainAccount")
      Alert.alert("알림", "로그아웃 되었습니다.")
    } catch(e){
      Alert.alert("경고", e.message)
    }
  }

  function editProfile(){ navigation.navigate("EditProfile") }
  function editSeller(){ navigation.navigate("EditSeller") }
  function serviceAdd(){ navigation.navigate("ServiceAdd") }
  function serviceMng(){ navigation.navigate("ServiceMng") }
  function creditMng(){ navigation.navigate("CreditMng") }
  function revenue(){ navigation.navigate("Revenue") }

  function selledPage(id, sid) {
        navigation.navigate("SelledPage", {
            tradeId : id,
            serviceId : sid
        })
    }

  function tradePage(id, sid) {
      navigation.navigate("TradePage", {
          tradeId : id,
          serviceId : sid
      })
  }

  function sellerMode(){
    if(docUser?.sellerName == undefined) {
      Alert.alert("알림", "최초 판매자 등록 페이지로 이동합니다.")
      navigation.navigate("SellerJoin")
    } else {
      setMode(true)
    }
  }


  if(mode == false) {
    return(
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 프로필</Text>
          <Pressable style={styles.switchButton} onPress={sellerMode}>
            <Ionicons name="swap-horizontal" size={20} color="#4A9EFF" />
            <Text style={styles.switchText}>판매자 전환</Text>
          </Pressable>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Pressable onPress={pick} style={styles.profileImageContainer}>
            <Image
              source={ profileUrl ? { uri: profileUrl } : BasicImg }
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </Pressable>

          <Text style={styles.userName}>{docUser?.name ?? "로딩 중"}</Text>
          <Text style={styles.userIntro}>{docUser?.smpIntro ?? "로딩 중"}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="call-outline" size={20} color="#6B8CAE" />
            <Text style={styles.infoLabel}>연락처</Text>
            <Text style={styles.infoValue}>{docUser?.callNum ?? "로딩 중"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="wallet-outline" size={20} color="#6B8CAE" />
            <Text style={styles.infoLabel}>크레딧</Text>
            <Text style={styles.infoValue}>
              {(docUser?.credit ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton} onPress={editProfile}>
            <Ionicons name="create-outline" size={20} color="#4A9EFF" />
            <Text style={styles.actionButtonText}>프로필 편집</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={()=>setOpenReserved(!openReserved)}
          >
            <Ionicons name="calendar-outline" size={20} color="#4A9EFF" />
            <Text style={styles.actionButtonText}>예약 내역</Text>
          </Pressable>
          {/* Reservations List */}
                  {openReserved && (
                    <View style={styles.listContainer}>
                      <Text style={styles.listTitle}>예약 내역</Text>
                      {tradesData.slice().sort((a, b) => b.createAt - a.createAt).map(item=>(
                        <Pressable
                          key={item.id}
                          style={styles.tradeCard}
                          onPress={()=>tradePage(item.id, item.serviceId)}
                        >
                          <Image source={{ uri: item.photoURL }} style={styles.tradeImage} />
                          <View style={styles.tradeInfo}>
                            <Text style={styles.tradeTitle}>{item.sellerName}</Text>
                            <Text style={styles.tradeDetail}>지역: {item.serviceRegion}</Text>
                            <Text style={styles.tradeDetail}>시간: {item.time}</Text>
                            <Text style={styles.tradePrice}>{item.servicePrice}원</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  )}

          <Pressable style={styles.actionButton} onPress={creditMng}>
            <Ionicons name="card-outline" size={20} color="#4A9EFF" />
            <Text style={styles.actionButtonText}>결제 관리</Text>
          </Pressable>
        </View>



        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={Logout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B9D" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    )
  }

  return(
    <ScrollView style={styles.container}>
      {/* Seller Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>판매자 프로필</Text>
        <Pressable style={styles.switchButton} onPress={()=>setMode(false)}>
          <Ionicons name="swap-horizontal" size={20} color="#4A9EFF" />
          <Text style={styles.switchText}>의뢰인 전환</Text>
        </Pressable>
      </View>

      {/* Seller Profile */}
      <View style={styles.profileSection}>
        <Pressable onPress={pick} style={styles.profileImageContainer}>
          <Image
            source={ sellerUrl ? { uri: sellerUrl } : BasicImg }
            style={styles.profileImage}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        <Text style={styles.userName}>{docUser?.sellerName ?? "로딩 중"}</Text>
        <Text style={styles.userIntro}>{docUser?.sellerSmpIntro ?? "로딩 중"}</Text>
      </View>

      {/* Seller Info */}
      <View style={styles.sellerInfoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={18} color="#6B8CAE" />
          <Text style={styles.infoText}>{docUser?.sellerIntro ?? "로딩 중"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color="#6B8CAE" />
          <Text style={styles.infoText}>{docUser?.sellerCall ?? "로딩 중"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#6B8CAE" />
          <Text style={styles.infoText}>{docUser?.sellerEmail ?? "로딩 중"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={18} color="#6B8CAE" />
          <Text style={styles.infoText}>{docUser?.sellerType ?? "로딩 중"}</Text>
        </View>
      </View>

      {/* Seller Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={styles.actionButton} onPress={editSeller}>
          <Ionicons name="create-outline" size={20} color="#4A9EFF" />
          <Text style={styles.actionButtonText}>프로필 편집</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={serviceAdd}>
          <Ionicons name="add-circle-outline" size={20} color="#4A9EFF" />
          <Text style={styles.actionButtonText}>서비스 등록</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={serviceMng}>
          <Ionicons name="list-outline" size={20} color="#4A9EFF" />
          <Text style={styles.actionButtonText}>서비스 관리</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={()=>setOpenServiceSchedule(!openServiceSchedule)}
        >
          <Ionicons name="calendar-outline" size={20} color="#4A9EFF" />
          <Text style={styles.actionButtonText}>판매 일정</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={revenue}>
          <Ionicons name="trending-up-outline" size={20} color="#4A9EFF" />
          <Text style={styles.actionButtonText}>수익 관리</Text>
        </Pressable>
      </View>

      {/* Seller Schedule */}
      {openServiceSchedule && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>판매 일정</Text>
          {sellerTradesData.slice().sort((a, b) => b.createAt - a.createAt).map(item=>(
            <Pressable
              key={item.id}
              style={styles.tradeCard}
              onPress={()=>selledPage(item.id, item.serviceId)}
            >
              <Image source={{ uri: item.photoURL }} style={styles.tradeImage} />
              <View style={styles.tradeInfo}>
                <Text style={styles.tradeTitle}>{item.buyerName}</Text>
                <Text style={styles.tradeDetail}>지역: {item.serviceRegion}</Text>
                <Text style={styles.tradeDetail}>시간: {item.time}</Text>
                <Text style={styles.tradePrice}>{item.servicePrice}원</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  switchButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0F2138', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1A3A5C' },
  switchText: { fontSize: 13, color: '#4A9EFF', fontWeight: '600' },
  profileSection: { alignItems: 'center', paddingVertical: 24 },
  profileImageContainer: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#4A9EFF' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#4A9EFF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0A1628' },
  userName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  userIntro: { fontSize: 14, color: '#6B8CAE' },
  infoCards: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  infoCard: { flex: 1, backgroundColor: '#0F2138', borderRadius: 12, padding: 16, borderWidth: 2, borderColor: '#1A3A5C', alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#6B8CAE', marginTop: 8, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  actionButtons: { paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0F2138', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2, borderColor: '#1A3A5C' },
  actionButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  listContainer: { paddingHorizontal: 24, marginBottom: 24 },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  tradeCard: { flexDirection: 'row', backgroundColor: '#0F2138', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 2, borderColor: '#1A3A5C' },
  tradeImage: { width: 80, height: 80, borderRadius: 8 },
  tradeInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  tradeTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  tradeDetail: { fontSize: 13, color: '#6B8CAE', marginBottom: 2 },
  tradePrice: { fontSize: 15, fontWeight: '700', color: '#4A9EFF', marginTop: 4 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 24, marginBottom: 40, paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: '#FF6B9D' },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#FF6B9D' },
  sellerInfoSection: { paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0F2138', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1A3A5C' },
  infoText: { flex: 1, fontSize: 14, color: '#8BA8C8' },
});

export default MyPage;