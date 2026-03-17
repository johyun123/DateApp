import { View, Text, Image, ScrollView, TextInput, StyleSheet, Pressable } from "react-native"
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function ServiceMng(){
    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()
    const [serviceData, setServiceData] = useState([])
    const [searchedService, setSearchedService] = useState([])
    const [searchText, setSearchText] = useState("")

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
            setUser(u);
            await loadData(u.uid)
            await loadService(u.uid)
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

    async function loadService(uid){
        const snps = await firestoreDB.getAllServices()
        const list = snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        const filtered = list.filter(item=>item.uid == uid)
        setServiceData(filtered)
        setSearchedService(filtered)
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

    function search(){
        const keyword = searchText.trim().toLowerCase();

        if(!keyword){
            setSearchedService(serviceData);
            return;
        }

        const result = serviceData.filter(item => {
            const title = (item.title ?? "").toLowerCase();
            const type = (item.type ?? "").toLowerCase();
            const region = (item.region ?? "").toLowerCase();
            const smp = (item.smpIntroduce ?? "").toLowerCase();

            return (
                title.includes(keyword) ||
                type.includes(keyword) ||
                region.includes(keyword) ||
                smp.includes(keyword)
            );
        });

        setSearchedService(result);
    }

    return(
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>서비스 관리</Text>
                <Text style={styles.headerSubtitle}>
                    등록된 {serviceData.length}개의 서비스
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#6B8CAE" />
                    <TextInput
                        placeholder="검색할 내용을 입력하세요"
                        placeholderTextColor="#6B8CAE"
                        value={searchText}
                        onChangeText={setSearchText}
                        style={styles.searchInput}
                        onSubmitEditing={search}
                    />
                    {searchText.length > 0 && (
                        <Pressable onPress={() => {
                            setSearchText("")
                            setSearchedService(serviceData)
                        }}>
                            <Ionicons name="close-circle" size={20} color="#6B8CAE" />
                        </Pressable>
                    )}
                </View>
                <Pressable style={styles.searchButton} onPress={search}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </Pressable>
            </View>

            {/* Results */}
            <View style={styles.resultsSection}>
                {searchedService.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="file-tray-outline" size={64} color="#1A3A5C" />
                        <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
                        <Text style={styles.emptyText}>
                            다른 키워드로 검색해보세요
                        </Text>
                    </View>
                ) : (
                    searchedService
                        .slice()
                        .sort((a, b)=> b.createdAt - a.createdAt)
                        .map(item=>(
                            <View key={item.id} style={styles.serviceCard}>
                                <Image
                                    source={{ uri: item.photoURL }}
                                    style={styles.serviceImage}
                                />

                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>

                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="pricetag" size={14} color="#6B8CAE" />
                                            <Text style={styles.metaText}>{item.type}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="location" size={14} color="#6B8CAE" />
                                            <Text style={styles.metaText}>{item.region}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.serviceDescription} numberOfLines={2}>
                                        {item.smpIntroduce}
                                    </Text>

                                    <View style={styles.footer}>
                                        <Text style={styles.price}>{item.price}원</Text>
                                        <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE' },

    searchSection: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F2138', borderRadius: 12, paddingHorizontal: 16, gap: 8, borderWidth: 2, borderColor: '#1A3A5C' },
    searchInput: { flex: 1, fontSize: 15, color: '#FFFFFF', paddingVertical: 14 },
    searchButton: { backgroundColor: '#4A9EFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, justifyContent: 'center' },
    searchButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

    resultsSection: { paddingHorizontal: 24, paddingBottom: 40, gap: 16 },

    emptyState: { alignItems: 'center', paddingVertical: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#6B8CAE' },

    serviceCard: { backgroundColor: '#0F2138', borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#1A3A5C', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
    serviceImage: { width: '100%', height: 200, backgroundColor: '#1A3A5C' },
    serviceInfo: { padding: 16 },
    serviceTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },

    metaRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 13, color: '#6B8CAE', fontWeight: '500' },

    serviceDescription: { fontSize: 14, color: '#8BA8C8', lineHeight: 20, marginBottom: 12 },

    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A3A5C' },
    price: { fontSize: 18, fontWeight: '800', color: '#4A9EFF' },
    timeText: { fontSize: 12, color: '#6B8CAE' },
});

export default ServiceMng