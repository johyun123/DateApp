import { View, Text, Alert, StyleSheet, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function Revenue(){
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

    async function creditTransfer(){
        if(docUser.sellerCredit <= 0){
            Alert.alert("경고", "전환 가능한 크레딧이 없습니다.")
            return;
            }
        try{
            const credit = docUser.credit + docUser.sellerCredit;
            const sellerCredit = 0;
            await firestoreDB.updateUserData(docUser.id, {
                credit,
                sellerCredit
            })
            Alert.alert("알림", "크레딧 전환이 완료되었습니다.")
            loadData(docUser.uid)
        } catch (e){
            Alert.alert("경고", e.message)
        }
    }

    const totalCredit = (docUser?.credit ?? 0) + (docUser?.sellerCredit ?? 0);

    return(
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>수익 관리</Text>
                <Text style={styles.headerSubtitle}>판매 수익을 관리하세요</Text>
            </View>

            {/* Total Balance Card */}
            <View style={styles.totalCard}>
                <View style={styles.totalHeader}>
                    <Ionicons name="trending-up" size={32} color="#69DB7C" />
                    <Text style={styles.totalLabel}>총 잔액</Text>
                </View>
                <Text style={styles.totalAmount}>
                    {totalCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text style={styles.totalUnit}>원</Text>
            </View>

            {/* Balance Cards */}
            <View style={styles.balanceCards}>
                {/* Seller Credit */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Ionicons name="cash" size={24} color="#4A9EFF" />
                        <Text style={styles.balanceLabel}>판매 수익</Text>
                    </View>
                    <Text style={styles.balanceAmount}>
                        {(docUser?.sellerCredit ?? 0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                    <Text style={styles.balanceUnit}>원</Text>
                    <View style={styles.balanceFooter}>
                        <Ionicons name="information-circle-outline" size={14} color="#6B8CAE" />
                        <Text style={styles.balanceFooterText}>
                            전환 가능한 판매 수익
                        </Text>
                    </View>
                </View>

                {/* User Credit */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Ionicons name="wallet" size={24} color="#FFA94D" />
                        <Text style={styles.balanceLabel}>보유 크레딧</Text>
                    </View>
                    <Text style={styles.balanceAmount}>
                        {(docUser?.credit ?? 0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                    <Text style={styles.balanceUnit}>원</Text>
                    <View style={styles.balanceFooter}>
                        <Ionicons name="information-circle-outline" size={14} color="#6B8CAE" />
                        <Text style={styles.balanceFooterText}>
                            사용 가능한 크레딧
                        </Text>
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>수익 관리</Text>

                {/* Transfer Button */}
                <Pressable
                    style={styles.actionButton}
                    onPress={()=>creditTransfer()}
                >
                    <View style={styles.actionIcon}>
                        <Ionicons name="swap-horizontal" size={24} color="#4A9EFF" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>크레딧 전환</Text>
                        <Text style={styles.actionDescription}>
                            판매 수익을 크레딧으로 전환
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B8CAE" />
                </Pressable>

                {/* Withdraw Button */}
                <Pressable style={styles.actionButton}>
                    <View style={styles.actionIcon}>
                        <Ionicons name="card-outline" size={24} color="#69DB7C" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>현금 인출</Text>
                        <Text style={styles.actionDescription}>
                            크레딧을 현금으로 인출
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B8CAE" />
                </Pressable>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#4A9EFF" />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>크레딧 전환 안내</Text>
                    <Text style={styles.infoText}>
                        • 판매 수익은 크레딧으로 전환 후 사용 가능합니다{'\n'}
                        • 크레딧은 현금 인출 또는 서비스 구매에 사용할 수 있습니다{'\n'}
                        • 전환은 즉시 처리됩니다
                    </Text>
                </View>
            </View>

            {/* History Section */}
            <View style={styles.historySection}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="time-outline" size={24} color="#6B8CAE" />
                    <Text style={styles.sectionTitle}>최근 거래 내역</Text>
                </View>

                <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={48} color="#1A3A5C" />
                    <Text style={styles.emptyText}>거래 내역이 없습니다</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },

    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE' },

    totalCard: { marginHorizontal: 24, backgroundColor: '#0F2138', borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 2, borderColor: '#1A3A5C', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
    totalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    totalLabel: { fontSize: 16, fontWeight: '600', color: '#8BA8C8' },
    totalAmount: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2 },
    totalUnit: { fontSize: 24, fontWeight: '700', color: '#6B8CAE', marginTop: -8 },

    balanceCards: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
    balanceCard: { flex: 1, backgroundColor: '#0F2138', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#1A3A5C' },
    balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    balanceLabel: { fontSize: 13, fontWeight: '600', color: '#8BA8C8' },
    balanceAmount: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
    balanceUnit: { fontSize: 14, fontWeight: '600', color: '#6B8CAE', marginBottom: 8 },
    balanceFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1A3A5C' },
    balanceFooterText: { fontSize: 11, color: '#6B8CAE', flex: 1 },

    actionsSection: { paddingHorizontal: 24, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F2138', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#1A3A5C' },
    actionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A3A5C', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    actionContent: { flex: 1 },
    actionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
    actionDescription: { fontSize: 13, color: '#6B8CAE' },

    infoBox: { flexDirection: 'row', marginHorizontal: 24, backgroundColor: '#0F2138', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 2, borderColor: '#1A3A5C', gap: 12 },
    infoContent: { flex: 1 },
    infoTitle: { fontSize: 14, fontWeight: '700', color: '#4A9EFF', marginBottom: 8 },
    infoText: { fontSize: 12, color: '#8BA8C8', lineHeight: 18 },

    historySection: { paddingHorizontal: 24, marginBottom: 40 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    emptyState: { backgroundColor: '#0F2138', borderRadius: 12, padding: 40, alignItems: 'center', borderWidth: 2, borderColor: '#1A3A5C' },
    emptyText: { fontSize: 14, color: '#6B8CAE', marginTop: 12 },
});

export default Revenue