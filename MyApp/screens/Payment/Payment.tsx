import { View, Text, Alert, StyleSheet, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from 'react'
import { firebaseAuth, firestoreDB } from "../../firebase"
import { useRoute } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import Ionicons from "react-native-vector-icons/Ionicons"

function Payment({ navigation }){
    const route = useRoute()
    const { serviceId } = route.params

    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()
    const [sellerDoc, setSellerDoc] = useState()
    const [serviceData, setServiceData] = useState()
    const [payed, setPayed] = useState()
    const [date, setDate] = useState(new Date())
    const [isPicked, setIsPicked] = useState(false)
    const [show, setShow] = useState(false)
    const [pickerMode, setPickerMode] = useState<"date" | "time">("date")

    const onChange = (event:any, selectedDate?: Date) => {
      if (event?.type === "dismissed" || !selectedDate) {
        setShow(false)
        return
      }

      if (pickerMode === "date") {
        setDate(prev => {
          const next = new Date(selectedDate)
          next.setHours(prev.getHours(), prev.getMinutes(), 0, 0)
          return next
        })
        setIsPicked(true)
        setShow(false)
        setPickerMode("time")
        setShow(true)
      } else {
        setDate(prev => {
          const next = new Date(prev)
          next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0)
          return next
        })
        setIsPicked(true)
        setShow(false)
      }
    }

    function formatDate(date) {
      const year  = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day   = String(date.getDate()).padStart(2, "0");
      const hour  = String(date.getHours()).padStart(2, "0");
      const minute  = String(date.getMinutes()).padStart(2, "0");

      return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    }

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
          setUser(u);
          await loadData(u.uid)
          await loadService(serviceId)
        });
    }, [])

    async function loadData(uid){
        const snps = await firestoreDB.getAllUsers()
        const list = snps.docs.map((doc)=>({
          id: doc.id,
          ...doc.data()
        }));
        const userData = list.find(item=>item.uid == uid)
        setDocUser(userData)
    }

    async function loadService(id){
        const snps = await firestoreDB.getAllServices()
        const list = snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        const filtered = list.find(item=>item.id == id)
        setServiceData(filtered)
    }

    useEffect(() => {
        if (!docUser || !serviceData) return

        const price = (Number)(serviceData.price.replaceAll(",", ""))
        const payed = docUser.credit - price

        if (payed > 0){
            setPayed(payed)
        } else{
            setPayed("크레딧이 부족합니다.")
        }
        sellerLoadData(serviceData.uid)
    }, [docUser, serviceData])

    async function sellerLoadData(uid){
        const snps = await firestoreDB.getAllUsers()
        const list = snps.docs.map((doc)=>({
          id: doc.id,
          ...doc.data()
        }));
        const userData = list.find(item=>item.uid == uid)
        setSellerDoc(userData)
    }

    async function payment(){
        if (payed == "크레딧이 부족합니다.") return;
        if (!isPicked) {
            Alert.alert("알림", "날짜를 선택해주세요.")
            return;
        }
        try{
            const credit = payed
            const price = (Number)(serviceData.price.replaceAll(",", ""))
            const sellerCredit = sellerDoc.sellerCredit + price

            const sellerUid = serviceData.uid
            const sellerName = serviceData.name
            const time = formatDate(date)

            const buyerName = docUser.name
            const serviceRegion = serviceData.region
            const serviceType = serviceData.type
            const servicePrice = serviceData.price
            const createAt = Date.now()
            const photoURL = serviceData.photoURL

            await firestoreDB.updateUserData(docUser.id, { credit })
            await firestoreDB.updateUserData(sellerDoc.id, { sellerCredit })
            await firestoreDB.addTrades(docUser.id, {
                buyerName, serviceId, time, sellerUid, sellerName,
                serviceRegion, serviceType, servicePrice, createAt, photoURL
            })
            Alert.alert("알림", "결제가 성공적으로 완료되었습니다.")
            navigation.navigate("TabRoot", {
                screen: "MyPage"
                })
        } catch (e) {
            Alert.alert("경고", e.message)
        }
    }

    const isInsufficient = typeof payed === 'string';

    return(
        <ScrollView style={styles.container}>
            {/* Warning Banner */}
            <View style={styles.warningBanner}>
                <Ionicons name="warning" size={20} color="#FFA94D" />
                <Text style={styles.warningText}>
                    결제 전에 착오 없도록 판매자 문의를 꼭 거쳐주세요!
                </Text>
            </View>

            {/* Service Info Card */}
            <View style={styles.serviceCard}>
                <Text style={styles.sectionTitle}>서비스 정보</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="cube-outline" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>서비스명</Text>
                    <Text style={styles.infoValue}>{serviceData?.title ?? "로딩 중"}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>판매자명</Text>
                    <Text style={styles.infoValue}>{serviceData?.name ?? "로딩 중"}</Text>
                </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>결제 요약</Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>보유 크레딧</Text>
                    <Text style={styles.summaryValue}>
                        {(docUser?.credit ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>결제 금액</Text>
                    <Text style={[styles.summaryValue, styles.priceHighlight]}>
                        -{serviceData?.price ?? "로딩 중"}원
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>결제 후 잔여 크레딧</Text>
                    <Text style={[styles.totalValue, isInsufficient && styles.insufficientText]}>
                        {typeof payed === 'number'
                            ? `${payed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`
                            : payed}
                    </Text>
                </View>

                {isInsufficient && (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color="#FF6B9D" />
                        <Text style={styles.errorText}>크레딧이 부족합니다. 충전 후 이용해주세요.</Text>
                    </View>
                )}
            </View>

            {/* Date Picker */}
            <View style={styles.dateCard}>
                <Text style={styles.sectionTitle}>예약 일시</Text>

                <View style={styles.selectedDateBox}>
                    <Ionicons name="calendar" size={24} color={isPicked ? "#4A9EFF" : "#6B8CAE"} />
                    <Text style={[styles.selectedDateText, !isPicked && styles.placeholderText]}>
                        {isPicked ? formatDate(date) : "날짜를 선택해주세요"}
                    </Text>
                </View>

                <Pressable
                    style={styles.dateButton}
                    onPress={() => {
                        setPickerMode("date")
                        setShow(true)
                    }}
                >
                    <Ionicons name="calendar-outline" size={20} color="#4A9EFF" />
                    <Text style={styles.dateButtonText}>날짜 선택</Text>
                </Pressable>

                {show && (
                    <DateTimePicker
                        value={date}
                        mode={pickerMode}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>

            {/* Payment Button */}
            <Pressable
                style={[styles.paymentButton, isInsufficient && styles.disabledButton]}
                onPress={payment}
                disabled={isInsufficient}
            >
                <Ionicons name="card" size={20} color="#FFFFFF" />
                <Text style={styles.paymentButtonText}>빠른 결제</Text>
            </Pressable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1A3A5C', marginHorizontal: 24, marginTop: 60, marginBottom: 24, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#FFA94D' },
    warningText: { flex: 1, fontSize: 13, color: '#FFA94D', fontWeight: '600' },

    serviceCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },

    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },

    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    infoLabel: { fontSize: 14, color: '#6B8CAE', flex: 1 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

    summaryCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    summaryLabel: { fontSize: 15, color: '#8BA8C8' },
    summaryValue: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    priceHighlight: { color: '#FF6B9D' },

    divider: { height: 1, backgroundColor: '#1A3A5C', marginVertical: 12 },

    totalLabel: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    totalValue: { fontSize: 20, fontWeight: '800', color: '#4A9EFF' },
    insufficientText: { color: '#FF6B9D' },

    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A3A5C', padding: 12, borderRadius: 8, marginTop: 12 },
    errorText: { flex: 1, fontSize: 13, color: '#FF6B9D', fontWeight: '600' },

    dateCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    selectedDateBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1A3A5C', padding: 16, borderRadius: 8, marginBottom: 12 },
    selectedDateText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    placeholderText: { color: '#6B8CAE' },

    dateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1A3A5C', paddingVertical: 14, borderRadius: 8 },
    dateButtonText: { fontSize: 15, fontWeight: '600', color: '#4A9EFF' },

    paymentButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', marginHorizontal: 24, marginBottom: 40, paddingVertical: 18, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    paymentButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    disabledButton: { backgroundColor: '#1A3A5C', shadowOpacity: 0 },
});

export default Payment