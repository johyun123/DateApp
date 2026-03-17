import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"

function Category({ navigation }){

    function dailyDate(){
        navigation.navigate("DailyDate")
    }

    function gameDate(){
        navigation.navigate("GameDate")
    }

    function callDate(){
        navigation.navigate("CallDate")
    }

    function adviceDate(){
        navigation.navigate("AdviceDate")
    }

    function snsModel(){
        navigation.navigate("SnsModel")
    }

    function fassionModel(){
        navigation.navigate("FassionModel")
    }

    function matching(){
        navigation.navigate("Matching")
    }

    const categories = [
        {
            title: "일일 데이트",
            icon: "calendar",
            color: "#4A9EFF",
            onPress: dailyDate
        },
        {
            title: "게임 데이트",
            icon: "game-controller",
            color: "#FF6B9D",
            onPress: gameDate
        },
        {
            title: "전화 데이트",
            icon: "call",
            color: "#FFA94D",
            onPress: callDate
        },
        {
            title: "고민상담",
            icon: "chatbubbles",
            color: "#69DB7C",
            onPress: adviceDate
        },
        {
            title: "SNS 사진 모델",
            icon: "camera",
            color: "#CC5DE8",
            onPress: snsModel
        },
        {
            title: "패션 모델",
            icon: "shirt",
            color: "#FF8787",
            onPress: fassionModel
        },
        {
            title: "매칭 서비스",
            icon: "heart",
            color: "#FF6B9D",
            onPress: matching
        },
    ];

    return(
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>카테고리</Text>
                    <Text style={styles.headerSubtitle}>원하는 서비스를 선택하세요</Text>
                </View>

                {/* Category Grid */}
                <View style={styles.grid}>
                    {categories.map((category, index) => (
                        <Pressable
                            key={index}
                            style={styles.categoryCard}
                            onPress={category.onPress}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                                <Ionicons
                                    name={category.icon}
                                    size={32}
                                    color={category.color}
                                />
                            </View>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                        </Pressable>
                    ))}
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
    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },

    // Header
    header: {
        marginBottom: 32,
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

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },

    // Category Card
    categoryCard: {
        width: '47%',
        backgroundColor: '#0F2138',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1A3A5C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default Category