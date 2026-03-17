import { View, Text, Alert, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import RNPickerSelect from "react-native-picker-select"
import Ionicons from "react-native-vector-icons/Ionicons"

function EditSeller({ navigation }){
    const [user, setUser] = useState()
    const [userData, setUserData] = useState()

    const [nameOnOff, setNameOnOff] = useState(false)
    const [smpIntOnOff, setSmpIntOnOff] = useState(false)
    const [intOnOff, setIntOnOff]  = useState(false)
    const [emailOnOff, setEmailOnOff] = useState(false)
    const [callOnOff, setCallOnOff] = useState(false)

    const [newName, setNewName] = useState("")
    const [newSmpIntro, setNewSmpIntro] = useState("")
    const [newIntro, setNewIntro] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newCall, setNewCall] = useState("")
    const [newType, setNewType] = useState("")

    useEffect(()=>{
        firebaseAuth.onChange(async (u)=>{
            setUser(u);
            await loadData(u.uid)
        });
    }, [])

    async function loadData(u){
        const snps = await firestoreDB.getAllUsers()
        const list = await snps.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
        const user = await list.find(item=>item.uid == u)
        setUserData(user)
    }

    async function newUserDataSubmit(){
        if(!userData) return

        const sellerName = newName != "" ? newName : userData.sellerName
        const sellerSmpIntro = newSmpIntro != "" ? newSmpIntro : userData.sellerSmpIntro
        const sellerIntro = newIntro != "" ? newIntro : userData.sellerIntro
        const sellerCall = newCall != "" ? newCall : userData.sellerCall
        const sellerEmail = newEmail != "" ? newEmail : userData.sellerEmail
        const sellerType = newType != "" ? newType : userData.sellerType

        try{
            await firestoreDB.updateUserData(userData.id, {
                sellerName, sellerSmpIntro, sellerIntro,
                sellerCall, sellerEmail, sellerType
            })
            Alert.alert("알림", "변경되었습니다.")
            setNewName("")
            setNewSmpIntro("")
            setNewIntro("")
            setNewEmail("")
            setNewCall("")
            setNewType("")
            loadData(user.uid)
        } catch(e){
            Alert.alert("경고", e.message)
        }
    }

    const EditField = ({ icon, label, value, newValue, isEditing, onToggle, onChange, placeholder, multiline = false }) => (
        <View style={styles.editSection}>
            <View style={styles.labelRow}>
                <Ionicons name={icon} size={20} color="#6B8CAE" />
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.currentValue}>{value || "없음"}</Text>

            {newValue && (
                <View style={styles.previewBox}>
                    <Text style={styles.previewLabel}>새 {label}</Text>
                    <Text style={styles.previewValue}>{newValue}</Text>
                </View>
            )}

            {isEditing ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor="#6B8CAE"
                        value={newValue}
                        onChangeText={onChange}
                        style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
                        multiline={multiline}
                    />
                    <Pressable style={styles.doneButton} onPress={() => onToggle(false)}>
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>
            ) : (
                <Pressable style={styles.editButton} onPress={() => onToggle(true)}>
                    <Text style={styles.editButtonText}>변경</Text>
                </Pressable>
            )}
        </View>
    );

    return(
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>판매자 프로필 편집</Text>
                    <Text style={styles.headerSubtitle}>판매자 정보를 수정하세요</Text>
                </View>

                {/* Edit Sections */}
                <View style={styles.editSections}>
                    <EditField
                        icon="person-outline"
                        label="판매자명"
                        value={userData?.sellerName}
                        newValue={newName}
                        isEditing={nameOnOff}
                        onToggle={setNameOnOff}
                        onChange={setNewName}
                        placeholder="새 판매자명"
                    />

                    <EditField
                        icon="chatbubble-outline"
                        label="한 줄 소개"
                        value={userData?.sellerSmpIntro}
                        newValue={newSmpIntro}
                        isEditing={smpIntOnOff}
                        onToggle={setSmpIntOnOff}
                        onChange={setNewSmpIntro}
                        placeholder="새 한 줄 소개"
                    />

                    <EditField
                        icon="document-text-outline"
                        label="소개"
                        value={userData?.sellerIntro}
                        newValue={newIntro}
                        isEditing={intOnOff}
                        onToggle={setIntOnOff}
                        onChange={setNewIntro}
                        placeholder="새 소개"
                        multiline
                    />

                    <EditField
                        icon="call-outline"
                        label="연락처"
                        value={userData?.sellerCall}
                        newValue={newCall}
                        isEditing={callOnOff}
                        onToggle={setCallOnOff}
                        onChange={setNewCall}
                        placeholder="새 연락처"
                    />

                    <EditField
                        icon="mail-outline"
                        label="이메일"
                        value={userData?.sellerEmail}
                        newValue={newEmail}
                        isEditing={emailOnOff}
                        onToggle={setEmailOnOff}
                        onChange={setNewEmail}
                        placeholder="새 이메일"
                    />

                    {/* Category Picker */}
                    <View style={styles.editSection}>
                        <View style={styles.labelRow}>
                            <Ionicons name="briefcase-outline" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>활동 분야</Text>
                        </View>
                        <Text style={styles.currentValue}>{userData?.sellerType ?? "로딩 중"}</Text>

                        <View style={styles.pickerContainer}>
                            <RNPickerSelect
                                placeholder={{
                                    label: "활동 분야 선택",
                                    value: null,
                                }}
                                onValueChange={(value)=> setNewType(value)}
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

                        {newType && (
                            <View style={styles.previewBox}>
                                <Text style={styles.previewLabel}>선택된 분야</Text>
                                <Text style={styles.previewValue}>{newType}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable style={styles.submitButton} onPress={newUserDataSubmit}>
                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>변경사항 적용</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    header: { marginBottom: 32 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: '#6B8CAE' },
    editSections: { gap: 24, marginBottom: 32 },
    editSection: { backgroundColor: '#0F2138', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#1A3A5C' },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    label: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    currentValue: { fontSize: 15, color: '#8BA8C8', marginBottom: 16 },
    previewBox: { backgroundColor: '#1A3A5C', borderRadius: 8, padding: 12, marginBottom: 12 },
    previewLabel: { fontSize: 12, color: '#6B8CAE', marginBottom: 4 },
    previewValue: { fontSize: 14, fontWeight: '600', color: '#4A9EFF' },
    inputContainer: { flexDirection: 'row', gap: 8 },
    input: { flex: 1, backgroundColor: '#1A3A5C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#FFFFFF' },
    doneButton: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#4A9EFF', justifyContent: 'center', alignItems: 'center' },
    editButton: { backgroundColor: '#1A3A5C', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    editButtonText: { fontSize: 14, fontWeight: '600', color: '#4A9EFF' },
    pickerContainer: { backgroundColor: '#1A3A5C', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', paddingVertical: 18, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#FFFFFF',
    },
    inputAndroid: {
        fontSize: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#FFFFFF',
    },
    placeholder: {
        color: '#6B8CAE',
    },
};

export default EditSeller