import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function TradePage(){
    const route = useRoute()
    const { tradeId, serviceId } = route.params ?? {}

    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()
    const [serviceData, setServiceData] = useState()
    const [tradeData, setTradeData] = useState()
    const [createAt, setCreateAt] = useState("")
    const [ed, setEd] = useState("서비스 이용 전입니다.")

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
            setUser(u);
            await loadData(u.uid)
            await loadTrades(tradeId)
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

    async function loadTrades(id){
        const snps = await firestoreDB.getAllTrades()
        const list = snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        const filtered = list.find(item=>item.id == id)
        setTradeData(filtered)
        timeTransfer(filtered)
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

    function timeParseInt(str){
        const strTime = str.match(/\d+/g)
        const [year, month, day, hour, min] = strTime.map(Number)
        return new Date(year, month -1, day, hour, min)
    }

    function timeTransfer(trade){
        if(!trade?.createAt) return;

        const time = timeParseInt(trade.time)
        if(time < Date.now()){
            setEd("서비스 이용이 완료되었습니다.")
        }

        const ms = trade.createAt
        const d = new Date(ms)

        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const day = d.getDate()
        const hour = d.getHours()
        const min = d.getMinutes()

        const date = `${year}년 ${month}월 ${day}일 ${hour}시 ${min}분`
        setCreateAt(date)
    }

    const isCompleted = ed === "서비스 이용이 완료되었습니다.";

    return(
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>예약 상세</Text>
                <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted]}>
                    <Ionicons
                        name={isCompleted ? "checkmark-circle" : "time"}
                        size={16}
                        color={isCompleted ? "#69DB7C" : "#FFA94D"}
                    />
                    <Text style={[styles.statusText, isCompleted && styles.statusTextCompleted]}>
                        {ed}
                    </Text>
                </View>
            </View>

            {/* Service Image */}
            {tradeData?.photoURL && (
                <Image
                    source={{ uri: tradeData.photoURL }}
                    style={styles.serviceImage}
                />
            )}

            {/* Service Info Card */}
            <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>서비스 정보</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="person" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>판매자</Text>
                    <Text style={styles.infoValue}>{serviceData?.name ?? "로딩 중"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="cube" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>서비스명</Text>
                    <Text style={styles.infoValue}>{serviceData?.title ?? "로딩 중"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="pricetag" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>분야</Text>
                    <Text style={styles.infoValue}>{serviceData?.type ?? "로딩 중"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="location" size={18} color="#6B8CAE" />
                    <Text style={styles.infoLabel}>지역</Text>
                    <Text style={styles.infoValue}>{serviceData?.region ?? "로딩 중"}</Text>
                </View>
            </View>

            {/* Description Card */}
            <View style={styles.descriptionCard}>
                <Text style={styles.cardTitle}>서비스 설명</Text>
                <Text style={styles.descriptionText}>
                    {serviceData?.smpIntroduce ?? "로딩 중"}
                </Text>
                {serviceData?.describe && (
                    <Text style={styles.descriptionDetail}>
                        {serviceData.describe}
                    </Text>
                )}
            </View>

            {/* Schedule Card */}
            <View style={styles.scheduleCard}>
                <Text style={styles.cardTitle}>예약 정보</Text>

                <View style={styles.scheduleRow}>
                    <Ionicons name="calendar" size={20} color="#4A9EFF" />
                    <View style={styles.scheduleContent}>
                        <Text style={styles.scheduleLabel}>이용 시간</Text>
                        <Text style={styles.scheduleValue}>{tradeData?.time ?? "로딩 중"}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.scheduleRow}>
                    <Ionicons name="cash" size={20} color="#69DB7C" />
                    <View style={styles.scheduleContent}>
                        <Text style={styles.scheduleLabel}>결제 금액</Text>
                        <Text style={styles.priceValue}>{serviceData?.price ?? "로딩 중"}원</Text>
                    </View>
                </View>
            </View>

            {/* Transaction Details */}
            <View style={styles.transactionCard}>
                <Text style={styles.cardTitle}>거래 정보</Text>

                <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>거래 코드</Text>
                    <Text style={styles.transactionValue} numberOfLines={1}>
                        {tradeData?.id ?? "로딩 중"}
                    </Text>
                </View>

                <View style={styles.transactionRow}>
                    <Text style={styles.transactionLabel}>거래 일시</Text>
                    <Text style={styles.transactionValue}>{createAt ?? "로딩 중"}</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 12, letterSpacing: -0.5 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A3A5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FFA94D' },
    statusBadgeCompleted: { borderColor: '#69DB7C' },
    statusText: { fontSize: 13, fontWeight: '600', color: '#FFA94D' },
    statusTextCompleted: { color: '#69DB7C' },

    serviceImage: { width: '100%', height: 300, backgroundColor: '#1A3A5C', marginBottom: 24 },

    infoCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    infoLabel: { fontSize: 14, color: '#6B8CAE', flex: 1 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', flex: 2, textAlign: 'right' },

    descriptionCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    descriptionText: { fontSize: 15, color: '#8BA8C8', lineHeight: 22 },
    descriptionDetail: { fontSize: 14, color: '#6B8CAE', lineHeight: 20, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A3A5C' },

    scheduleCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    scheduleContent: { flex: 1 },
    scheduleLabel: { fontSize: 13, color: '#6B8CAE', marginBottom: 4 },
    scheduleValue: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    priceValue: { fontSize: 20, fontWeight: '800', color: '#69DB7C' },
    divider: { height: 1, backgroundColor: '#1A3A5C', marginVertical: 16 },

    transactionCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: '#1A3A5C' },
    transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    transactionLabel: { fontSize: 14, color: '#6B8CAE' },
    transactionValue: { fontSize: 14, fontWeight: '600', color: '#8BA8C8', flex: 1, textAlign: 'right', marginLeft: 12 },
});

export default TradePage