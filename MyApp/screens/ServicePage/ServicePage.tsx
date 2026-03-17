import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import { useRoute } from "@react-navigation/native"
import Ionicons from "react-native-vector-icons/Ionicons"

function ServicePage({ navigation }){
    const route = useRoute()
    const { serviceId } = route.params

    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()
    const [serviceData, setServiceData] = useState()

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

    function timeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours   = Math.floor(diff / (1000 * 60 * 60));
        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (seconds < 60) return "방금 전";
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;

        const date = new Date(timestamp);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    function payment(){
        navigation.navigate("Payment", {
            serviceId: serviceId
        })
    }

    return(
        <ScrollView style={styles.container}>
            {/* Service Image */}
            <Image
                source={{ uri: serviceData?.photoURL ?? "로딩 중" }}
                style={styles.serviceImage}
            />

            {/* Main Info Card */}
            <View style={styles.mainCard}>
                <View style={styles.header}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{serviceData?.title ?? "로딩 중"}</Text>
                        <View style={styles.categoryBadge}>
                            <Ionicons name="pricetag" size={14} color="#4A9EFF" />
                            <Text style={styles.categoryText}>{serviceData?.type ?? "로딩 중"}</Text>
                        </View>
                    </View>
                    <Text style={styles.price}>{serviceData?.price ?? "로딩 중"}원</Text>
                </View>

                <View style={styles.divider} />

                {/* Seller Info */}
                <View style={styles.sellerSection}>
                    <View style={styles.infoRow}>
                        <Ionicons name="person" size={18} color="#6B8CAE" />
                        <Text style={styles.infoLabel}>판매자</Text>
                        <Text style={styles.infoValue}>{serviceData?.name ?? "로딩 중"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={18} color="#6B8CAE" />
                        <Text style={styles.infoLabel}>지역</Text>
                        <Text style={styles.infoValue}>{serviceData?.region ?? "로딩 중"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time" size={18} color="#6B8CAE" />
                        <Text style={styles.infoLabel}>등록일</Text>
                        <Text style={styles.infoValue}>
                            {timeAgo(serviceData?.createdAt ?? Date.now())}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Introduction Card */}
            <View style={styles.descriptionCard}>
                <View style={styles.cardHeader}>
                    <Ionicons name="chatbubble-ellipses" size={20} color="#4A9EFF" />
                    <Text style={styles.cardTitle}>한 줄 소개</Text>
                </View>
                <Text style={styles.descriptionText}>
                    {serviceData?.smpIntroduce ?? "로딩 중"}
                </Text>
            </View>

            {/* Detail Card */}
            <View style={styles.descriptionCard}>
                <View style={styles.cardHeader}>
                    <Ionicons name="reader" size={20} color="#4A9EFF" />
                    <Text style={styles.cardTitle}>서비스 설명</Text>
                </View>
                <Text style={styles.descriptionText}>
                    {serviceData?.describe ?? "로딩 중"}
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                <Pressable style={styles.chatButton}>
                    <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                    <Text style={styles.chatButtonText}>채팅 문의</Text>
                </Pressable>

                <Pressable style={styles.paymentButton} onPress={payment}>
                    <Ionicons name="card" size={20} color="#FFFFFF" />
                    <Text style={styles.paymentButtonText}>결제</Text>
                </Pressable>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    serviceImage: { width: '100%', height: 400, backgroundColor: '#1A3A5C' },

    mainCard: { marginHorizontal: 24, marginTop: -40, backgroundColor: '#0F2138', borderRadius: 20, padding: 24, borderWidth: 2, borderColor: '#1A3A5C', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },

    header: { marginBottom: 16 },
    titleSection: { marginBottom: 12 },
    title: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 8, letterSpacing: -0.5 },
    categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A3A5C', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
    categoryText: { fontSize: 13, fontWeight: '600', color: '#4A9EFF' },
    price: { fontSize: 32, fontWeight: '900', color: '#4A9EFF', letterSpacing: -1 },

    divider: { height: 1, backgroundColor: '#1A3A5C', marginVertical: 16 },

    sellerSection: { gap: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoLabel: { fontSize: 14, color: '#6B8CAE', flex: 1 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', flex: 2, textAlign: 'right' },

    descriptionCard: { marginHorizontal: 24, marginTop: 16, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#1A3A5C' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    descriptionText: { fontSize: 15, color: '#8BA8C8', lineHeight: 24 },

    actionSection: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 24 },
    chatButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1A3A5C', paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: '#4A9EFF' },
    chatButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    paymentButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', paddingVertical: 16, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    paymentButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

export default ServicePage