import { View, TextInput, Text, Alert, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { firebaseAuth, firestoreDB } from '../../firebase'
import Ionicons from "react-native-vector-icons/Ionicons"

function Register({ navigation }){
    const [email, setEmail] = useState();
    const [pw, setPw] = useState();
    const [name, setName] = useState();
    const [callNum, setCallNum] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const smpIntro = "한 줄 소개가 없습니다."

    function loginMove(){
        navigation.navigate("Login")
    }

    async function submit(){
        try{
            const uid = await firebaseAuth.signUp(email, pw)

            const profileImgURL = null
            const profileImgPath = null
            const credit = 0

            await firestoreDB.addUserData(uid, {
                name,
                callNum,
                email,
                smpIntro,
                credit,
                profileImgURL,
                profileImgPath,
            })
            Alert.alert("알림", "회원가입 성공")
            navigation.navigate("MainAccount")
        } catch(e){
            Alert.alert("경고", e.message)
        }
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>회원가입</Text>
                    <Text style={styles.headerSubtitle}>새로운 계정을 만들어보세요</Text>
                </View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#6B8CAE" style={styles.inputIcon} />
                        <TextInput
                            placeholder="이름 ex) 박주희"
                            placeholderTextColor="#6B8CAE"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#6B8CAE" style={styles.inputIcon} />
                        <TextInput
                            placeholder="연락처 ex) 000-0000-0000"
                            placeholderTextColor="#6B8CAE"
                            value={callNum}
                            onChangeText={setCallNum}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#6B8CAE" style={styles.inputIcon} />
                        <TextInput
                            placeholder="이메일 ex) swngmls3571@naver.com"
                            placeholderTextColor="#6B8CAE"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6B8CAE" style={styles.inputIcon} />
                        <TextInput
                            placeholder="비밀번호 (6자리 이상)"
                            placeholderTextColor="#6B8CAE"
                            value={pw}
                            onChangeText={setPw}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#6B8CAE"
                            />
                        </Pressable>
                    </View>

                    {/* Register Button */}
                    <Pressable style={styles.registerButton} onPress={submit}>
                        <Text style={styles.registerButtonText}>가입하기</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>계정이 이미 있으신가요?</Text>
                    <Pressable onPress={loginMove}>
                        <Text style={styles.loginLink}>로그인</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1628',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingVertical: 60,
    },

    // Header
    header: {
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#6B8CAE',
        fontWeight: '400',
    },

    // Input Section
    inputSection: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F2138',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#1A3A5C',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },

    // Register Button
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A9EFF',
        paddingVertical: 18,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
        shadowColor: '#4A9EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        gap: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#6B8CAE',
    },
    loginLink: {
        fontSize: 14,
        color: '#4A9EFF',
        fontWeight: '700',
    },
});

export default Register;