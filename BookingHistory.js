import React ,{ useEffect,useState ,useRef} from 'react';
import {SafeAreaView, Text,ImageBackground,Image,View,TouchableOpacity,Dimensions,AsyncStorage,FlatList,Linking} from 'react-native';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyle, headerStyle} from '../styles/styles';
import SearchBar from 'react-native-search-bar';
import MaterialTabs from 'react-native-material-tabs';
import { EventRegister } from 'react-native-event-listeners';
import store from '../redux/store';
import {LoginOtpApi,SignInApi,Explore,Fetch,FetchAstrologerList,SeaechAstro,SearchAstrologerFilter,Reals} from '../backend/Api';

import { useNavigation } from '@react-navigation/native'
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
let data = [{
     value: 'English',
   }, {
     value: 'Hindi',
   }];
const window = Dimensions.get('window');
const BookingHistory = ({navigation}) => {
  const nav = useNavigation()
  const [entries, setEntries] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [index,selectedIndex] =  useState(0);
  const [pujas,setPuja] =  useState([]);
  const [yogas,setyoga] = useState([]);
  const [posts,setpost] = useState([]);
  const [online_ofline,setonline_ofline] = useState('');
    const [price_max,setprice_max] = useState('');
    const [price_min,setprice_min] = useState('');
    const [service,setservice] = useState('');
    const [sort_by,setsort_by] = useState('');
      const [speciality,setspeciality] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
    const [value,setvalue] = useState([]);
        const ref = useRef()
        const refs = useRef()



  const renderItem = ({item, index}) => {
        return (
              <ImageBackground resizeMode = 'cover' imageStyle={{borderRadius:5}} style={{height:160,width:window.width -100}} source={{uri:item.imageUrl}} >

<Text style = {{fontSize:28,marginLeft:13,marginTop:20,fontFamily:'DMSans-Bold',color:'white',width:140}}>
{item.name}
</Text>
              </ImageBackground>
        );
    }


    const apna = () =>{
       setPuja([])
      setLoading(true)
      var e = {speciality:speciality,service:service,online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max}
      //alert(e)
      SearchAstrologerFilter({speciality:speciality,service:service,online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max})
           .then((data) => {
             console.log(JSON.stringify(data))
             if (data.status) {
               setLoading(false)
               // setEntries(data.banners)
               // setImage(data.settings.explorehome_topbg_url)
             setPuja(data.data)
               // setyoga(data.yogas)
               // setpost(data.posts)


             } else {
                setLoading(false)
     setPuja([])
             }
           })
           .catch((error) => {
             console.log('error', error);
              setLoading(false)
           });
    }

  useEffect (() =>{

    // speciality:speciality,service:service,online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max

if (speciality == "" && service == "" && online_ofline == "" && sort_by == "" && price_min == "" && price_max == ""){

}else{
  apna()
}


},[sort_by,speciality])


const filters = (data) =>{
  console.log(data)
    setsort_by(data.sort_by)

 //    setTimeout( () => {
 //    apna()
 // },2000)
}
    const filter = (data) =>{
      console.log(data)
      setonline_ofline(data.online_ofline)
      setprice_max(data.price_max)
      setprice_min(data.price_min)
      setservice(data.service)
      setsort_by(data.sort_by)
      setspeciality(data.speciality)
    //apna()

    }
  useEffect (() =>{
    categorySelect(0)




  //  alert('hi')
  },[])

const pujaopens = (item) =>{
  console.log(item.horoscopeUrl)
  Linking.openURL(`https://docs.google.com/gview?embedded=true&url=${item.horoscopeUrl}`)
}

  const pujaopen = (item) =>{
    GLOBAL.bookingid = item.bridge_id
    GLOBAL.user_id = store.getState().user.id
    //alert(JSON.stringify(item.bridge_id))
    navigation.navigate('MyChat')
  }
  const renderItemTvs=({item}) => {
         console.log(JSON.stringify(item))
      return(


    <  View style={{flexDirection:'column',marginTop:20}}>


    {index != 3 && (
      <View>
      <Text style={{fontSize:12,fontWeight:'bold',lineHeight:18,fontFamily:'Nunito-Regular',color:'#949494',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:5,alignSelf:'center'}}>OrderId:{item.orderID}</Text>
     <View style = {{flexDirection:'row',justifyContent:'space-between'}}>


     <View>
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>{item.astrologer.name} </Text>
     {item.status == "0" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'green',marginTop:1}}>Status :Pending </Text>
     )}
     {item.status == "1" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'green',marginTop:1}}>Status :Confirmed </Text>
     )}
     {item.status == "2" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'green',marginTop:1}}>Status :Completed </Text>
     )}
     {item.status == "3" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'red',marginTop:1}}>Status :Cancelled </Text>
     )}
     {item.status == "4" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'green',marginTop:1}}>Status :Refund </Text>
     )}
     {item.status == "5" && (
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'green',marginTop:1}}>Status :Missing </Text>
     )}
     {index != 3 && (
     <View>
     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'black',marginTop:1}}>{item.schedule_date}- {item.schedule_time}</Text>

     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>Duration :{item.total_minutes} min</Text>
     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>Consult With {item.astrologer.name} </Text>
     {index != 4 && (
     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>Price : ₹ {parseInt(item.total_minutes) * parseInt(item.price_per_mint)} </Text>
     )}
     {index == 4 && (
     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>Price : ₹ {parseInt(item.price_per_mint)} </Text>
     )}


     </View>
     )}

     {index == 3 && (
     <View>

     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>{item.horoscope_name } </Text>

     <Text style={{fontSize:13,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>Price : ₹ {parseInt(item.subtotal) } </Text>

     </View>
     )}
     </View>

     <View>

     <Image style = {{width:60,height:60,resizeMode:'contain',borderRadius:30,marginRight:12,resizeMode:'contain'}}
     source = {{uri:item.astrologer.imageUrl}}/>

     {index == 2 && (
     <TouchableOpacity onPress={()=>pujaopen(item)} >
     <View style = {{borderWidth:1,height:40,width:90,borderColor:'#FFD00D',marginRight:12,borderRadius:12,marginTop:4}}>
     <Text style={{fontSize:12,fontWeight:'bold',lineHeight:18,fontFamily:'Nunito-Regular',color:'#FFD00D',borderRadius:5,padding:2,color:'#FFD00D',marginTop:6,textAlign:'center',borderRadius:12}}>CHAT</Text>
     </View>
     </TouchableOpacity>
     )}
     {index == 3 && item.status == "2" && (
     <TouchableOpacity onPress={()=>pujaopens(item)} >
     <View style = {{borderWidth:1,height:40,width:90,borderColor:'#FFD00D',marginRight:12,borderRadius:12,marginTop:4}}>
     <Text style={{fontSize:12,fontWeight:'bold',lineHeight:18,fontFamily:'Nunito-Regular',color:'#949494',borderRadius:5,padding:2,color:'#FFD00D',marginTop:6,textAlign:'center',borderRadius:12}}>DOWNLOAD</Text>
     </View>
     </TouchableOpacity>
     )}

     <TouchableOpacity onPress={()=>Linking.openURL(item.invoiceURL)} >
     <View style = {{borderWidth:1,height:40,width:90,borderColor:'#FFD00D',marginRight:12,borderRadius:12,marginTop:4}}>
     <Text style={{fontSize:12,fontWeight:'bold',lineHeight:18,fontFamily:'Nunito-Regular',color:'#949494',borderRadius:5,padding:2,color:'#FFD00D',marginTop:6,textAlign:'center',borderRadius:12}}>INVOICE</Text>
     </View>
     </TouchableOpacity>


     </View>

     </View>


      </View>
    )}


    {index == 3 && (
      <View>
      <Text style={{fontSize:14,fontWeight:'bold',lineHeight:18,fontFamily:'Nunito-Regular',color:'#949494',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:5}}>OrderId:{item.orderID}</Text>
     <View style = {{}}>


     <View style = {{flexDirection:'row',justifyContent:'space-between'}}>

     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>{item.horoscope_name } </Text>

     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Regular',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1,marginRight:12}}>Price : ₹ {parseInt(item.subtotal) } </Text>

     </View>
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',marginLeft:20,borderRadius:5,padding:2,color:'#505050',marginTop:1}}>{item.astrologer.name} </Text>

     <View style = {{flexDirection:'row',justifyContent:'space-between'}}>

     { item.status == "2" && (
     <TouchableOpacity onPress={()=>pujaopens(item)} >
     <View style = {{borderWidth:0,height:40,width:window.width/2 - 30,borderColor:'#FFD00D',marginRight:12,borderRadius:12,marginTop:4,backgroundColor:'#FFAF00',marginLeft:20}}>
      <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,marginTop:10}}>View Report</Text>
     </View>
     </TouchableOpacity>
     )}


     <View style = {{borderWidth:0,height:40,width:window.width/2 - 30,borderColor:'#FFD00D',marginRight:12,borderRadius:12,marginTop:4,backgroundColor:'#FFBF1D',marginLeft:20}}>

 {item.status == "0" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,marginTop:10}}>Pending </Text>
 )}
 {item.status == "1" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,marginTop:10}}>Confirmed </Text>
 )}
 {item.status == "2" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,marginTop:10}}>Completed </Text>
 )}
 {item.status == "3" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,color:'white',marginTop:10}}>Cancelled </Text>
 )}
 {item.status == "4" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,color:'white',marginTop:10}}>Refund </Text>
 )}
 {item.status == "5" && (
 <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,color:'white',marginTop:10}}>Missing </Text>
 )}



 </View>

     </View>




     <View>






     <TouchableOpacity onPress={()=>  Linking.openURL(`https://docs.google.com/gview?embedded=true&url=${item.invoiceURL}`)} >
     <View style = {{borderWidth:0,height:40,width:90,backgroundColor:'#ffdb00',marginRight:12,borderRadius:12,marginTop:9,margin:20,width:window.width - 30}}>
     <Text style={{fontSize:15,lineHeight:18,fontFamily:'Nunito-Bold',color:'black',textAlign:'center',borderRadius:5,padding:2,marginTop:10}}>View Invoice</Text>
     </View>
     </TouchableOpacity>


     </View>

     </View>


      </View>
    )}


    <View style = {{height:1,backgroundColor:'grey',width:window.width,marginTop:8}}>

    </View>


             </View>






  )
  }

const renderItemTv=({item, index}) => {
        // alert(JSON.stringify(item))
    return(



  <View style={{flexDirection:'column'}}>

  <Image
               style={{marginLeft:10,alignSelf:'center',width:200,resizeMode:'cover',height:180,borderRadius:12}}
               source={{uri:item.imageUrl}}
           />

               <Text style={{marginLeft:10,fontSize:18,fontFamily:'DMSans-Regular',color:'#505050',marginTop:12,fontWeight:'bold'}}>{item.name}</Text>
     </View>




)
}

const searchFilterFunction = (text) =>{
  if (text == ""){
    return
  }
  setvalue(text)

  SeaechAstro({search:text})
       .then((data) => {
         console.log(JSON.stringify(data))
         if (data.status) {
           // setEntries(data.banners)
           // setImage(data.settings.explorehome_topbg_url)
         setPuja(data.data)
           // setyoga(data.yogas)
           // setpost(data.posts)


         } else {
 setPuja([])
         }
       })
       .catch((error) => {
         console.log('error', error);
       });

}

const open = (event) =>{
  selectedIndex(event.nativeEvent.selectedSegmentIndex)
  categorySelect(event.nativeEvent.selectedSegmentIndex)
//  this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
}

const categorySelect = (index) =>{



var types = parseInt(index) + 1

var k = {type:types,limit:50,offset:0}


  Reals({type:types,limit:50,offset:0})
       .then((data) => {
      //   alert(JSON.stringify(data))
         if (data.status) {
           // setEntries(data.banners)
           // setImagse(data.settings.explorehome_topbg_url)
         setPuja(data.data)
           // setyoga(data.yogas)
           // setpost(data.posts)

setSelectedTab(index)
         } else {

         }
       })
       .catch((error) => {
         console.log('error', error);
       });
}

  return (
    <SafeAreaView style = {{flex:1}}>
    <View
      style={headerStyle.view}
  >
      <TouchableOpacity
        style={headerStyle.backTouch}
        onPress={navigation.goBack}>
        <Image
          source={require('../assets/icons/back.png')}
          style={headerStyle.backImage}
        />
      </TouchableOpacity>
      <Text style={headerStyle.title}>Booking History</Text>
    </View>
<KeyboardAwareScrollView style = {{backgroundColor:'white'}}>



<SegmentedControl
   values={['Video', 'Audio',"Chat","Report","Live"]}
   selectedIndex={index}
   onChange={(events) => {
     open(events)
   }}
 />


{pujas.length == 0 && (
                 <Text style={{marginLeft:10,fontSize:18,fontFamily:'DMSans-Regular',color:'#505050',marginTop:130,fontWeight:'bold',textAlign:'center'}}>No Booking Yet</Text>
)}

                         <FlatList  style={{width:'100%',marginTop:3}}
                   data={pujas}

                   showsHorizontalScrollIndicator={false}

                   renderItem={renderItemTvs}
                />













</KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BookingHistory;
