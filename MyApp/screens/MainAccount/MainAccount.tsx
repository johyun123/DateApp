// MainAccount.tsx 수정 예시
// 기존 기능은 그대로 두고 스타일만 변경

import { View, TextInput, Text, Button, Image, ScrollView, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { firebaseAuth, firestoreDB } from '../../firebase'
import Ionicons from "react-native-vector-icons/Ionicons"

import xamA from "../../imgSource/girls/xamA.jpg"
import xamB from "../../imgSource/girls/xamB.jpg"
import xamC from "../../imgSource/girls/xamC.jpg"

function MainAccount({ navigation }){
    const [user, setUser] = useState(null)

    useEffect(()=>{
        firebaseAuth.onChange((u)=>{
            if (!u) {
                setUser(null)
            }
            setUser(u);
        });
    }, [])

    useEffect(()=>{
        if(user != null) {
            navigation.navigate("TabRoot")
        }
    }, [])

    function LoginMove(){
        navigation.navigate("Login")
    }

    function RegisterMove(){
        navigation.navigate("Register")
    }

    return(
        <ScrollView style={styles.container}>
            {/* 프로모션 배너 섹션 */}
            <View style={styles.promoHeader}>
                <View style={styles.promoTitleContainer}>
                    <Text style={styles.promoTitle}>새로운 사랑이</Text>
                </View>
                <Text style={styles.promoTitle}>싹트는 그곳</Text>

            </View>

            {/* 기존 이미지 갤러리 */}
            <ScrollView horizontal={true} style={styles.imageGallery}>
                <Image source={xamA} style={styles.galleryImage}/>
                <Image source={xamB} style={styles.galleryImage}/>
                <Image source={xamC} style={styles.galleryImage}/>
            </ScrollView>
            {/* 기능 아이콘 섹션 */}
            <View style={styles.featuresRow}>
                <View style={styles.featureItem}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="heart-outline" size={24} color="#4A9EFF" />
                    </View>
                    <Text style={styles.featureText}>매칭</Text>
                </View>

                <View style={styles.featureItem}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="calendar-outline" size={24} color="#4A9EFF" />
                    </View>
                    <Text style={styles.featureText}>데이트</Text>
                </View>

                <View style={styles.featureItem}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="people-outline" size={24} color="#4A9EFF" />
                    </View>
                    <Text style={styles.featureText}>소셜</Text>
                </View>
            </View>

            {/* 버튼 섹션 */}
            <View style={styles.buttonContainer}>
                <View style={styles.customButton}>
                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText} onPress={LoginMove}>로그인</Text>
                </View>

                <View style={styles.customButtonSecondary}>
                    <Ionicons name="person-add-outline" size={20} color="#4A9EFF" />
                    <Text style={styles.buttonTextSecondary} onPress={RegisterMove}>회원가입</Text>
                </View>
            </View>
        </ScrollView>
    )
}

// ============================================
// STYLES - 복붙하세요!
// ============================================
const styles = StyleSheet.create({
    // 컨테이너
    container: {
        flex: 1,
        backgroundColor: '#0A1628',
    },

    // 프로모션 헤더
    promoHeader: {
        padding: 24,
        paddingTop: 60,
    },
    promoSubtitle: {
        fontSize: 13,
        color: '#6B8CAE',
        marginBottom: 2,
        fontWeight: '400',
    },
    promoTitleContainer: {
        marginTop: 16,
        marginBottom: 4,
    },
    promoTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        lineHeight: 44,
        letterSpacing: -0.5,
    },

    // 이미지 갤러리
    imageGallery: {
        marginTop: 20,
        marginBottom: 10,
    },
    galleryImage: {
        width: 300,
        height: 300,
        marginHorizontal: 8,
        borderRadius: 16,
    },

    // 기능 아이콘
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#0F2138',
        marginHorizontal: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    featureItem: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1A3A5C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#2A4A6C',
    },
    featureText: {
        fontSize: 12,
        color: '#8BA8C8',
        fontWeight: '500',
        textAlign: 'center',
    },

    // 버튼 섹션
    buttonContainer: {
        paddingHorizontal: 24,
        paddingVertical: 32,
        gap: 12,
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A9EFF',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#4A9EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    customButtonSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 2,
        borderColor: '#4A9EFF',
    },
    buttonTextSecondary: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A9EFF',
    },
});

export default MainAccount;