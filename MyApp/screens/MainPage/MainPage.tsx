import { ScrollView, View, Text, Alert, Image, StyleSheet, Pressable } from "react-native"
import { firebaseAuth } from "../../firebase"
import { useState, useEffect } from "react"
import Ionicons from "react-native-vector-icons/Ionicons"

function MainPage({ navigation }){
    const [xamImg, setXamImg] = useState("")

    useEffect(()=>{
        fetch("https://api.thecatapi.com/v1/images/search")
        .then(res=>res.json())
        .then(data=>setXamImg(data[0].url))
    }, [])

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>인기 서비스</Text>
                <Text style={styles.headerSubtitle}>지금 가장 핫한 매칭을 만나보세요</Text>
            </View>

            {/* Section 1: 인기 연애매칭 */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="heart" size={24} color="#4A9EFF" />
                    <Text style={styles.sectionTitle}>인기 연애매칭</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={styles.scrollContent}
                >
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Image
                                source={{ uri: xamImg }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardOverlay}>
                                <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Section 2: 인기 일일 데이트 */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="calendar" size={24} color="#4A9EFF" />
                    <Text style={styles.sectionTitle}>인기 일일 데이트</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={styles.scrollContent}
                >
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Image
                                source={{ uri: xamImg }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardOverlay}>
                                <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Section 3: 인기 청소부 */}
            <View style={[styles.section, { marginBottom: 40 }]}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="people" size={24} color="#4A9EFF" />
                    <Text style={styles.sectionTitle}>인기 청소부</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={styles.scrollContent}
                >
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Image
                                source={{ uri: xamImg }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardOverlay}>
                                <Ionicons name="star-outline" size={20} color="#FFFFFF" />
                            </View>
                        </View>
                    ))}
                </ScrollView>
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
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B8CAE',
        fontWeight: '400',
    },

    // Section
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Horizontal Scroll
    horizontalScroll: {
        paddingLeft: 24,
    },
    scrollContent: {
        paddingRight: 24,
        gap: 16,
    },

    // Card
    card: {
        width: 250,
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#0F2138',
        borderWidth: 2,
        borderColor: '#1A3A5C',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(74, 158, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default MainPage;