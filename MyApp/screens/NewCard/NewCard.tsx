import { View, TextInput, Text, Button } from "react-native"

function NewCard(){
    return (
        <View>
            <TextInput placeholder="카드명" />
            <TextInput placeholder="카드사" />
            <TextInput placeholder="성명" />
            <TextInput placeholder="카드 번호" />
            <TextInput placeholder="카드 비밀번호" />
            <TextInput placeholder="사용 기한" />
            <TextInput placeholder="CVC" />

            <Button title="카드 등록"/>
        </View>


        )
    }

export default NewCard