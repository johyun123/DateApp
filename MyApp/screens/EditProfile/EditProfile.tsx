import { View, Text, Alert, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from "react"
import { firebaseAuth, firestoreDB } from "../../firebase"
import Ionicons from "react-native-vector-icons/Ionicons"

function EditProfile({ navigation }){
    const [user, setUser] = useState()
    const [userData, setUserData] = useState()

    const [nameOnOff, setNameOnOff] = useState(false)
    const [smpIntOnOff, setSmpIntOnOff] = useState(false)
    const [callNumOnOff, setCallNumOnOff] = useState(false)

    const [newName, setNewName] = useState("")
    const [newSimpleIntro, setNewSimpleIntro] = useState("")
    const [newCallNum, setNewCallNum] = useState("")

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

        const name = newName != "" ? newName : userData.name
        const callNum = newCallNum != "" ? newCallNum : userData.callNum
        const smpIntro = newSimpleIntro != "" ? newSimpleIntro : userData.smpIntro

        try{
            await firestoreDB.updateUserData(userData.id, {name, callNum, smpIntro})
            Alert.alert("알림", "프로필이 변경되었습니다.")
            setNewName("")
            setNewSimpleIntro("")
            setNewCallNum("")
            loadData(user.uid)
        } catch(e){
            Alert.alert("경고", e.message)
        }
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>프로필 편집</Text>
                    <Text style={styles.headerSubtitle}>정보를 수정하세요</Text>
                </View>

                {/* Edit Sections */}
                <View style={styles.editSections}>
                    {/* Name */}
                    <View style={styles.editSection}>
                        <View style={styles.labelRow}>
                            <Ionicons name="person-outline" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>이름</Text>
                        </View>
                        <Text style={styles.currentValue}>{userData?.name ?? ""}</Text>

                        {newName && (
                            <View style={styles.previewBox}>
                                <Text style={styles.previewLabel}>새 이름</Text>
                                <Text style={styles.previewValue}>{newName}</Text>
                            </View>
                        )}

                        {nameOnOff ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="새 이름"
                                    placeholderTextColor="#6B8CAE"
                                    value={newName}
                                    onChangeText={setNewName}
                                    style={styles.input}
                                />
                                <Pressable
                                    style={styles.doneButton}
                                    onPress={()=>setNameOnOff(false)}
                                >
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                style={styles.editButton}
                                onPress={()=>setNameOnOff(true)}
                            >
                                <Text style={styles.editButtonText}>변경</Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Simple Intro */}
                    <View style={styles.editSection}>
                        <View style={styles.labelRow}>
                            <Ionicons name="chatbubble-outline" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>한 줄 소개</Text>
                        </View>
                        <Text style={styles.currentValue}>{userData?.smpIntro ?? "로딩 중"}</Text>

                        {newSimpleIntro && (
                            <View style={styles.previewBox}>
                                <Text style={styles.previewLabel}>새 한 줄 소개</Text>
                                <Text style={styles.previewValue}>{newSimpleIntro}</Text>
                            </View>
                        )}

                        {smpIntOnOff ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="새 한 줄 소개"
                                    placeholderTextColor="#6B8CAE"
                                    value={newSimpleIntro}
                                    onChangeText={setNewSimpleIntro}
                                    style={styles.input}
                                    multiline
                                />
                                <Pressable
                                    style={styles.doneButton}
                                    onPress={()=>setSmpIntOnOff(false)}
                                >
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                style={styles.editButton}
                                onPress={()=>setSmpIntOnOff(true)}
                            >
                                <Text style={styles.editButtonText}>변경</Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Call Number */}
                    <View style={styles.editSection}>
                        <View style={styles.labelRow}>
                            <Ionicons name="call-outline" size={20} color="#6B8CAE" />
                            <Text style={styles.label}>연락처</Text>
                        </View>
                        <Text style={styles.currentValue}>{userData?.callNum ?? ""}</Text>

                        {newCallNum && (
                            <View style={styles.previewBox}>
                                <Text style={styles.previewLabel}>새 연락처</Text>
                                <Text style={styles.previewValue}>{newCallNum}</Text>
                            </View>
                        )}

                        {callNumOnOff ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="새 연락처"
                                    placeholderTextColor="#6B8CAE"
                                    value={newCallNum}
                                    onChangeText={setNewCallNum}
                                    style={styles.input}
                                    keyboardType="phone-pad"
                                />
                                <Pressable
                                    style={styles.doneButton}
                                    onPress={()=>setCallNumOnOff(false)}
                                >
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                </Pressable>
                            </View>
                        ) : (
                            <Pressable
                                style={styles.editButton}
                                onPress={()=>setCallNumOnOff(true)}
                            >
                                <Text style={styles.editButtonText}>변경</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable
                    style={styles.submitButton}
                    onPress={newUserDataSubmit}
                >
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
    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4A9EFF', paddingVertical: 18, borderRadius: 12, shadowColor: '#4A9EFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

export default EditProfile