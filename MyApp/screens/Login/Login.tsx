import { View, Text, TextInput, Alert, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { firebaseAuth, firestoreDB } from "../../firebase"
import { useState, useEffect } from "react"
import Ionicons from "react-native-vector-icons/Ionicons"

function Login({ navigation }){
    const [email, setEmail] = useState();
    const [pw, setPw] = useState();
    const [showPassword, setShowPassword] = useState(false);

    function RegisterMove(){
        navigation.navigate("Register")
    }

    async function handleLogin(){
        try{
            await firebaseAuth.login(email, pw)
            Alert.alert("알림", "로그인 성공")
            navigation.navigate("TabRoot")
        } catch(e){
            Alert.alert("경고", e.message)
        }
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>환영합니다</Text>
                    <Text style={styles.headerSubtitle}>로그인하고 새로운 만남을 시작하세요</Text>
                </View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#6B8CAE" style={styles.inputIcon} />
                        <TextInput
                            placeholder="이메일"
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
                            placeholder="비밀번호"
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

                    {/* Login Button */}
                    <Pressable style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>계정이 없으신가요?</Text>
                    <Pressable onPress={RegisterMove}>
                        <Text style={styles.registerLink}>회원가입</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1628',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },

    // Header
    header: {
        marginBottom: 48,
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

    // Login Button
    loginButton: {
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
    loginButtonText: {
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
    registerLink: {
        fontSize: 14,
        color: '#4A9EFF',
        fontWeight: '700',
    },
});

export default Login;