import { View, Text, Alert, StyleSheet, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function CreditMng(){
    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
             if (!u) {
                  setUser(null)
                  setDocUser(null)
                  return
                }
          setUser(u);
          await loadData(u.uid)
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
    }

    async function addCredit(){
        if(!docUser) return;
        try{
            const credit = docUser.credit + 10000000;
            await firestoreDB.updateUserData(docUser.id, {credit})
            Alert.alert("알림", "정상적으로 충전되었습니다.")
        } catch(e){
            Alert.alert("경고", e.message)
        }
        loadData(user.uid)
    }

    return(
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>결제 관리</Text>
                <Text style={styles.headerSubtitle}>크레딧을 충전하고 관리하세요</Text>
            </View>

            {/* User Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#6B8CAE" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>이메일</Text>
                        <Text style={styles.infoValue}>{docUser?.email ?? "로딩 중"}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#6B8CAE" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>계정 코드</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {docUser?.uid ?? "로딩 중"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Credit Balance Card */}
            <View style={styles.creditCard}>
                <View style={styles.creditHeader}>
                    <Ionicons name="wallet" size={32} color="#4A9EFF" />
                    <Text style={styles.creditLabel}>보유 크레딧</Text>
                </View>

                <Text style={styles.creditAmount}>
                    {(docUser?.credit ?? 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>

                <Text style={styles.creditUnit}>원</Text>

                <View style={styles.creditFooter}>
                    <Ionicons name="information-circle-outline" size={16} color="#6B8CAE" />
                    <Text style={styles.creditFooterText}>
                        1 크레딧 = 1원으로 사용됩니다
                    </Text>
                </View>
            </View>

            {/* Quick Charge Card */}
            <View style={styles.chargeCard}>
                <View style={styles.chargeHeader}>
                    <Ionicons name="flash" size={24} color="#FFA94D" />
                    <Text style={styles.chargeTitle}>빠른 충전</Text>
                </View>

                <Text style={styles.chargeDescription}>
                    테스트용 크레딧을 즉시 충전할 수 있습니다
                </Text>

                <Pressable style={styles.chargeButton} onPress={addCredit}>
                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.chargeButtonText}>1000만 크레딧 충전</Text>
                </Pressable>

                <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={18} color="#FFA94D" />
                    <Text style={styles.warningText}>
                        이 기능은 개발/테스트 용도입니다
                    </Text>
                </View>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>결제 수단</Text>

                <Pressable style={styles.methodCard}>
                    <View style={styles.methodIcon}>
                        <Ionicons name="card-outline" size={24} color="#4A9EFF" />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>신용/체크 카드</Text>
                        <Text style={styles.methodDescription}>등록된 카드가 없습니다</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B8CAE" />
                </Pressable>

                <Pressable style={styles.methodCard}>
                    <View style={styles.methodIcon}>
                        <Ionicons name="phone-portrait-outline" size={24} color="#69DB7C" />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>간편결제</Text>
                        <Text style={styles.methodDescription}>카카오페이, 네이버페이 등</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B8CAE" />
                </Pressable>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE' },

    infoCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 12, color: '#6B8CAE', marginBottom: 4 },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    divider: { height: 1, backgroundColor: '#1A3A5C', marginVertical: 16 },

    creditCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 2, borderColor: '#1A3A5C', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
    creditHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    creditLabel: { fontSize: 16, fontWeight: '600', color: '#8BA8C8' },
    creditAmount: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2 },
    creditUnit: { fontSize: 24, fontWeight: '700', color: '#6B8CAE', marginTop: -8, marginBottom: 16 },
    creditFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1A3A5C' },
    creditFooterText: { fontSize: 12, color: '#6B8CAE' },

    chargeCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: '#1A3A5C' },
    chargeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    chargeTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    chargeDescription: { fontSize: 14, color: '#8BA8C8', marginBottom: 16 },
    chargeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', paddingVertical: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    chargeButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A3A5C', padding: 12, borderRadius: 8 },
    warningText: { fontSize: 12, color: '#FFA94D', flex: 1 },

    section: { paddingHorizontal: 24, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
    methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F2138', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#1A3A5C' },
    methodIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A3A5C', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    methodInfo: { flex: 1 },
    methodTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
    methodDescription: { fontSize: 13, color: '#6B8CAE' },
});

export default CreditMng