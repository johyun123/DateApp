import { View, Text, TextInput, Alert, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import RNPickerSelect from 'react-native-picker-select'
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function SellerJoin({ navigation }){
    const [sellerName, setSellerName] = useState("")
    const [sellerEmail, setSellerEmail] = useState("")
    const [sellerCall, setSellerCall] = useState("")
    const [sellerSmpIntro, setSellerSmpIntro] = useState("")
    const [sellerIntro, setSellerIntro] = useState("")
    const [sellerType, setSellerType] = useState("")
    const [docUser, setDocUser] = useState()
    const [user, setUser] = useState()

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
            setUser(u)
            await loadData(u.uid)
        })
    }, [])

    async function loadData(u){
        const snps = await firestoreDB.getAllUsers()
        const list = await snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }))
        const userData = await list.find(item=>item.uid == u)
        setDocUser(userData)
    }

    async function sellerSubmit(){
        if (!sellerName || !sellerEmail || !sellerCall || !sellerSmpIntro || !sellerIntro || !sellerType) {
            Alert.alert("알림", "모든 항목을 입력해주세요.")
            return;
        }

        const docId = docUser.id
        const sellerImgURL = null
        const sellerImgPath = null
        const sellerCredit = 0

        try{
            await firestoreDB.updateUserData(docId, {
                sellerName,
                sellerCall,
                sellerEmail,
                sellerSmpIntro,
                sellerIntro,
                sellerType,
                sellerCredit,
                sellerImgURL,
                sellerImgPath,
            })
            Alert.alert("알림", "판매자 등록이 완료되었습니다.")
            navigation.navigate("TabRoot", {
                screen: "MyPage"
                }
                )

        } catch(e) {
            Alert.alert("경고", e.message)
        }
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="storefront" size={48} color="#4A9EFF" />
                    <Text style={styles.headerTitle}>판매자 등록</Text>
                    <Text style={styles.headerSubtitle}>
                        서비스를 판매하기 위한 정보를 입력해주세요
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="person" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>판매자명</Text>
                        </View>
                        <TextInput
                            placeholder="판매자명을 입력하세요"
                            placeholderTextColor="#6B8CAE"
                            value={sellerName}
                            onChangeText={setSellerName}
                            style={styles.input}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="mail" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>이메일</Text>
                        </View>
                        <TextInput
                            placeholder="이메일을 입력하세요"
                            placeholderTextColor="#6B8CAE"
                            value={sellerEmail}
                            onChangeText={setSellerEmail}
                            style={styles.input}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="call" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>연락처</Text>
                        </View>
                        <TextInput
                            placeholder="연락처를 입력하세요"
                            placeholderTextColor="#6B8CAE"
                            value={sellerCall}
                            onChangeText={setSellerCall}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Simple Intro */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="chatbubble" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>한 줄 소개</Text>
                        </View>
                        <TextInput
                            placeholder="간단한 소개를 입력하세요"
                            placeholderTextColor="#6B8CAE"
                            value={sellerSmpIntro}
                            onChangeText={setSellerSmpIntro}
                            style={styles.input}
                        />
                    </View>

                    {/* Full Intro */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="document-text" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>자세한 소개</Text>
                        </View>
                        <TextInput
                            placeholder="자세한 소개를 입력하세요"
                            placeholderTextColor="#6B8CAE"
                            value={sellerIntro}
                            onChangeText={setSellerIntro}
                            style={[styles.input, styles.textArea]}
                            multiline
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="briefcase" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>주 활동 분야</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <RNPickerSelect
                                placeholder={{
                                    label: "주 활동분야를 선택해주세요",
                                    value: null,
                                }}
                                onValueChange={(value)=> setSellerType(value)}
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
                        {sellerType && (
                            <View style={styles.selectedBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#4A9EFF" />
                                <Text style={styles.selectedText}>{sellerType}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable style={styles.submitButton} onPress={sellerSubmit}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>등록하기</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    scrollView: { flex: 1 },

    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginTop: 16, marginBottom: 8, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE', textAlign: 'center' },

    form: { paddingHorizontal: 24, gap: 20 },
    inputGroup: { backgroundColor: '#0F2138', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#1A3A5C' },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    label: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    input: { backgroundColor: '#1A3A5C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#FFFFFF' },
    textArea: { minHeight: 100, textAlignVertical: 'top', paddingTop: 14 },

    pickerContainer: { backgroundColor: '#1A3A5C', borderRadius: 8, overflow: 'hidden' },
    selectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A3A5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 12, alignSelf: 'flex-start' },
    selectedText: { fontSize: 13, fontWeight: '600', color: '#4A9EFF' },

    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', marginHorizontal: 24, marginTop: 32, paddingVertical: 18, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 15,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: '#FFFFFF',
    },
    inputAndroid: {
        fontSize: 15,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: '#FFFFFF',
    },
    placeholder: {
        color: '#6B8CAE',
    },
};

export default SellerJoin