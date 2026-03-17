import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function PayMng({ navigation }){
    const [user, setUser] = useState()
    const [docUser, setDocUser] = useState()

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
          setUser(u);
          await loadData(u.uid)
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

    return(
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>수익 관리</Text>
                <Text style={styles.headerSubtitle}>크레딧과 수익을 관리하세요</Text>
            </View>

            {/* Credit Card */}
            <View style={styles.creditCard}>
                <View style={styles.creditHeader}>
                    <Ionicons name="wallet" size={32} color="#4A9EFF" />
                    <Text style={styles.creditLabel}>보유 크레딧</Text>
                </View>
                <Text style={styles.creditAmount}>
                    {(docUser?.credit ?? 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                </Text>
                <View style={styles.creditFooter}>
                    <Ionicons name="information-circle-outline" size={16} color="#6B8CAE" />
                    <Text style={styles.creditFooterText}>
                        1 크레딧 = 1원
                    </Text>
                </View>
            </View>

            {/* Action Button */}
            <View style={styles.actionSection}>
                <Pressable style={styles.primaryButton}>
                    <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>수익 전환</Text>
                </Pressable>
            </View>

            {/* Sections */}
            <View style={styles.sections}>
                {/* Conversion History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="repeat-outline" size={24} color="#4A9EFF" />
                        <Text style={styles.sectionTitle}>전환 내역</Text>
                    </View>
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={48} color="#1A3A5C" />
                        <Text style={styles.emptyText}>전환 내역이 없습니다</Text>
                    </View>
                </View>

                {/* Transaction History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="cash-outline" size={24} color="#69DB7C" />
                        <Text style={styles.sectionTitle}>입출금 내역</Text>
                    </View>
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#1A3A5C" />
                        <Text style={styles.emptyText}>입출금 내역이 없습니다</Text>
                    </View>
                </View>

                {/* Statistics */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="arrow-down-circle-outline" size={24} color="#69DB7C" />
                        <Text style={styles.statLabel}>이번 달 수익</Text>
                        <Text style={styles.statValue}>0원</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="arrow-up-circle-outline" size={24} color="#FF6B9D" />
                        <Text style={styles.statLabel}>이번 달 지출</Text>
                        <Text style={styles.statValue}>0원</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1628',
    },

    // Header
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B8CAE',
    },

    // Credit Card
    creditCard: {
        marginHorizontal: 24,
        backgroundColor: '#0F2138',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#1A3A5C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    creditHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    creditLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8BA8C8',
    },
    creditAmount: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: -1,
    },
    creditFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#1A3A5C',
    },
    creditFooterText: {
        fontSize: 12,
        color: '#6B8CAE',
    },

    // Action Section
    actionSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#4A9EFF',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#4A9EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Sections
    sections: {
        paddingHorizontal: 24,
        gap: 24,
        paddingBottom: 40,
    },
    section: {
        backgroundColor: '#0F2138',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: '#1A3A5C',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B8CAE',
        marginTop: 12,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#0F2138',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#1A3A5C',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B8CAE',
        marginTop: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});

export default PayMng