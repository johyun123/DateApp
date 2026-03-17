import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native'
import { firebaseAuth, firestoreDB } from "../../firebase"
import { useEffect, useState } from "react"
import Ionicons from "react-native-vector-icons/Ionicons"

function AdviceDate({ navigation }){
    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()
    const [serviceData, setServiceData] = useState([])
    const [likedIds, setLikedIds] = useState(new Set())

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
          setUser(u);
          await loadData(u.uid)
          await loadService()
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

    async function loadService(){
        const snps = await firestoreDB.getAllServices()
        const list = snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        const filtered = list.filter(item=>item.type == "고민상담")
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

    function ServicePage(id){
        navigation.navigate("ServicePage", { serviceId: id })
    }

    function toggleLike(serviceId){
      setLikedIds(prev => {
        const next = new Set(prev)
        if (next.has(serviceId)) {
          next.delete(serviceId)
        } else {
          next.add(serviceId)
        }
        return next
      })
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Ionicons name="chatbubbles" size={28} color="#69DB7C" />
                    <Text style={styles.headerTitle}>고민상담</Text>
                </View>
                <Text style={styles.headerSubtitle}>{serviceData.length}개의 서비스가 있습니다</Text>
            </View>

            <View style={styles.listContainer}>
                {serviceData.slice().sort((a, b)=> b.createdAt - a.createdAt).map(item => {
                  const liked = likedIds.has(item.id)
                  return (
                    <View key={item.id} style={styles.serviceCard}>
                        <Pressable onPress={()=>toggleLike(item.id)} style={styles.likeButton}>
                            <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? "#FF6B9D" : "#6B8CAE"} />
                        </Pressable>

                        <Pressable onPress={()=>ServicePage(item.id)}>
                            <Image source={{ uri: item.photoURL }} style={styles.serviceImage} />


                        <View style={styles.infoContainer}>
                            <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="person-outline" size={14} color="#6B8CAE" />
                                    <Text style={styles.metaText}>{item.name}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Ionicons name="location-outline" size={14} color="#6B8CAE" />
                                    <Text style={styles.metaText}>{item.region}</Text>
                                </View>
                            </View>

                            <Text style={styles.description} numberOfLines={2}>{item.smpIntroduce}</Text>

                            <View style={styles.footer}>
                                <Text style={styles.price}>{item.price}원</Text>
                                <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
                            </View>
                        </View>
                        </Pressable>
                    </View>
                  )
                })}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE', fontWeight: '400', marginLeft: 40 },
    listContainer: { paddingHorizontal: 24, paddingBottom: 40, gap: 20 },
    serviceCard: { backgroundColor: '#0F2138', borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#1A3A5C', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4, position: 'relative' },
    likeButton: { position: 'absolute', top: 12, right: 12, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(15, 33, 56, 0.9)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1A3A5C' },
    serviceImage: { width: '100%', height: 200, backgroundColor: '#1A3A5C' },
    infoContainer: { padding: 16 },
    serviceTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
    metaRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 13, color: '#6B8CAE', fontWeight: '500' },
    description: { fontSize: 14, color: '#8BA8C8', lineHeight: 20, marginBottom: 12 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A3A5C' },
    price: { fontSize: 18, fontWeight: '800', color: '#4A9EFF' },
    timeText: { fontSize: 12, color: '#6B8CAE' },
});

export default AdviceDate