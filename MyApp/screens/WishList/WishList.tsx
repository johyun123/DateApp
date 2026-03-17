import { View, Text, Image, Button } from "react-native"
import { useState, useEffect } from "react"

function WishList(){
    const [xamImg, setXamImg] = useState("")

    useEffect(()=>{
        fetch("https://api.thecatapi.com/v1/images/search")
        .then(res=>res.json())
        .then(data=>setXamImg(data[0].url))
        }, [])


    return(
        <View>

        <Text>찜</Text>
        <Text>서비스명</Text>
        <Image source={{ uri : xamImg }}
         style={{
             width: 250,
             height: 250
             }}
         />
         <Text>서비스 일시 : </Text>
         <Text>서비스 분야 : </Text>
         <Button title="상세보기" />

        </View>


        )

    }

export default WishList