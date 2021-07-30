import React, {useState,useEffect} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import store from '../redux/store';
import { EventRegister } from 'react-native-event-listeners';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyle, headerStyle} from '../styles/styles';
import {StatusBarLight} from '../utils/CustomStatusBar';
import {LoginOtpApi,SignInApi,Explore,FetchHomeWallet,PujaStart,GetProfileApi,FetchHoroscope,SearchAstrologerFilter,FetchAstrologer,Favorite,Proe} from '../backend/Api';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const ReportAstrologerd = ({navigation,route}) => {
  const [state, steState] = useState({
    modalVisible: false,
    sortType: '',
    wallet:''
  });
   const [selectedId, setSelectedId] = useState(true);
  const [speciality,setspeciality] = useState([]);
    const [wallet,setWallet] = useState('');
    const [online_ofline,setonline_ofline] = useState('');
  const [price_max,setprice_max] = useState('');
  const [price_min,setprice_min] = useState('');
  const [service,setservice] = useState('');
  const [sort_by,setsort_by] = useState('');
    const [language,setlanguage] = useState('');
      const [rating,setRating] = useState('');
    const [specialitys,setspecialitys] = useState('');
  const sortList = [
    {
      sortType: '1',
      title: 'Experience - High to Low',
      value:'exhightolow',
    },
    {
      sortType: '2',
      title: 'Experience - Low to High',
      value:"exlowtohigh",
    },
    {
      sortType: '3',
      title: 'Rating - High to Low',
      value:"ratinghightolow",

    },
    {
      sortType: '4',
      title: 'Rating - Low to High',
      value:"ratinglowtohigh",
    },
    {
      sortType: '5',
      title: 'Price - High to Low',
      value:"pricehightolow",
    },
    {
      sortType: '6',
      title: 'Price - Low to High',
      value:"pricelowtohigh",
    },
  ];

  const apna = () =>{

        setspeciality([])

       var e = {speciality:specialitys ? specialitys :"",service:"",online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max,language:language,rating:rating,mode:route.params.item.nav}
      // alert(JSON.stringify(e))
      console.log(e)

       SearchAstrologerFilter({speciality:specialitys ? specialitys :"",service:"",online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max,language:language,rating:rating,mode:route.params.item.nav})
            .then((data) => {
            //  alert(JSON.stringify(data))
              if (data.status) {

                // setEntries(data.banners)
                // setImage(data.settings.explorehome_topbg_url)
              setspeciality(data.data)
                // setyoga(data.yogas)
                // setpost(data.posts)


              } else {

      setspeciality([])
              }
            })
            .catch((error) => {
              console.log('error', error);

            });
     }
  useEffect (() =>{

  // speciality:speciality,service:service,online_ofline:online_ofline,sort_by:sort_by,price_min:price_min,price_max:price_max

if (sort_by == "" ){

}else{
apna()
}


},[sort_by])

  const astrologer = () =>{



  //  alert(JSON.stringify(route.params.item))
    Proe({astrologer_id:route.params.item.id})
             .then((data) => {
              //  alert(JSON.stringify(data))
                // setLoading(false)
               if (data.status) {

              setspeciality(data.data)


                // alert(JSON.stringify(data))
            //   navigation.navigate('Otp',{otp:+data.otp,status:true,mobile:+mobile})

               } else {
                   setspeciality([])
              //   navigation.navigate('Otp',{otp:+data.otp,status:false,mobile:+mobile})
               }
             })
             .catch((error) => {
            //   setLoading(false)
               console.log('error', error);
             });
  }


  const editcarts = (item,index) =>{
  //  alert(JSON.stringify(item))

  Favorite({astrologer_id:item.id})
           .then((data) => {
              // setLoading(false)
             if (data.status) {
               var edit = speciality[index]
               if (item.is_favourite == false){
                 edit.is_favourite  = true
               }else{
                 edit.is_favourite  = false
               }
               speciality[index] = edit
               //alert(JSON.stringify(edit))
                setspeciality(speciality)
                setSelectedId(!selectedId)


              // alert(JSON.stringify(data))
          //   navigation.navigate('Otp',{otp:+data.otp,status:true,mobile:+mobile})

             } else {
                 setspeciality([])
            //   navigation.navigate('Otp',{otp:+data.otp,status:false,mobile:+mobile})
             }
           })
           .catch((error) => {
          //   setLoading(false)
             console.log('error', error);
           });



  // var gty =  parseInt(item.cart_data.qty) + 1
  // if (gty <= parseInt(item.stock)){
  //   EditCart({cart_id: item.cart_data.cart_id,qty:gty.toString()})
  //     .then((data) => {
  //
  //       if (data.status) {
  //          var getcart = product[index]
  //          getcart = data.product
  //          product[index] = getcart
  //          console.log('edit ',getcart.cart_data.qty)
  //         // alert(JSON.stringify(product))
  //         setSelectedId(!selectedId)
  //          setProduct(product)
  //          //
  //       } else {
  //       //  alert(data)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     });
  // }else{
  //   alert('Stock not Available')
  // }

}

  const  wallets = () =>{
    FetchHomeWallet({user_id:store.getState().user.id})
         .then((data) => {
          // alert(JSON.stringify(data))
           if (data.status) {
            //alert(typeof data.wallet)
setWallet(data.wallet)
// setstate({...state,wallet:data.wallet})
//setnotification(data.notification_count)


           } else {

           }
         })
         .catch((error) => {
           console.log('error', error);
         });
  }

  const filter = (data) =>{
     console.log(data)
     setonline_ofline(data.online_ofline)
     setprice_max(data.price_max)
     setprice_min(data.price_min)
     setservice(data.service)

     setspeciality(data.speciality)
     setlanguage(data.language)
     setRating(data.rating)
   apna()

   }


   const ddf = (data) =>{
    // alert(JSON.stringify(data))


     SearchAstrologerFilter({speciality:data.speciality,service:data.service,online_ofline:data.online_ofline,sort_by:sort_by,price_min:data.price_min,price_max:data.price_max,language:data.language,rating:data.rating,mode:route.params.item.nav})
          .then((data) => {
          //  alert(JSON.stringify(data))
            if (data.status) {

              // setEntries(data.banners)
              // setImage(data.settings.explorehome_topbg_url)
            setspeciality(data.data)
              // setyoga(data.yogas)
              // setpost(data.posts)


            } else {

    setspeciality([])
            }
          })
          .catch((error) => {
            console.log('error', error);

          });
  //filter(data)
  //alert(data)
   }

   const typed = (item) =>{
       navigation.navigate('CreateKundliForm',{item:item,type:route.params.item.id})

 // setstate({...state,wallet:data.wallet})
 //setnotification(data.notification_count)



   }

  useEffect (() =>{

    setSelectedId(!selectedId)
    const unsubscribew =   navigation.addListener('focus', () => {



   })
astrologer()


  },[])
  return (
    <SafeAreaView style={globalStyle.container_2}>
      <StatusBarLight />
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
        <Text style={headerStyle.title}>{route.params.item.name}</Text>

      </View>


      <FlatList style ={{marginBottom:20,height:height-20}}
        showsHorizontalScrollIndicator={false}
        data={speciality}
        extraData={selectedId}
        style={{flexGrow: 0, paddingVertical: 10,}}
        renderItem={({item,index}) => (
          <TouchableOpacity
            onPress={() => typed(item)}>
            <View style={{width:'97%',elevation:5,alignSelf:'center',backgroundColor:'white',marginTop:10,marginBottom:10}}>
            <Image
              source={{uri:item.imageUrl}}
              style={{width:'97%',height:200,alignSelf:'center'}}
            />

            <View   style={{marginLeft:10,justifyContent:'space-between',marginBottom:10}}>
<Text style={styles.dt_name}>{item.name}</Text>
<Text style={{fontFamily:'Nunito-Regular',fontSize:12}}>{item.description}</Text>

<Text style={{fontFamily:'Nunito-Bold',fontSize:22}}>₹{item.horoscope_price}/Report</Text>

            </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />



    </SafeAreaView>
  );
};

export default ReportAstrologerd;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    margin: 5,
  },
  searchTouch: {
    marginLeft: 'auto',
  },
  filterTouch: {
    marginHorizontal: 10,
  },
  balView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  balText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  rchTouch: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#00C327',
    borderRadius: 5,
  },
  rchText: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#00C327',
  },
  ex_view: {
    flexDirection: 'row',
    margin: 7,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 7,
  },
  ex_proView: {
    padding: 5,
  },
  ex_proImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ex_starView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 8,
    borderColor: '#DD2476',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  ex_starImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  ex_starText: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
  textAlign:'center'
  },
  dt_view: {
    flex: 1,
  },
  dt_view_1: {
    flexDirection: 'row',
  },
  dt_view_11: {
    flex: 0.9,
  },

  dt_likeView: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dt_likeImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  dt_name: {
    fontFamily: 'Nunito-Bold',
    marginTop:7,

    fontSize: 22,
    color: '#000000',
  },
  dt_viewOpt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dt_viewOptImage: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  dt_viewOptText: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '400',
    fontSize: 14,
    color: 'grey',
    paddingHorizontal: 5,

  },
  dt_viewOptTexts: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '400',
    fontSize: 16,
    color: 'blue',
    paddingHorizontal: 5,

  },
  dt_viewOptTextss: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '400',
    fontSize: 16,
    color: 'red',
    paddingHorizontal: 5,
    textDecorationLine: 'line-through', textDecorationStyle: 'solid'

  },
  dt_view_2: {
    flexDirection: 'row',
    flex: 1,
  },
  dt_view_21: {
    flex: 0.4,
  },
  dt_view_22: {
    flexDirection: 'row',
    flex: 0.6,
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  dt_callTouch: {
    padding: 5,
    alignItems: 'center',
  },
  dt_callImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  dt_callText: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 10,
    color: '#00C327',
  },
  dt_callTexts: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 10,
    color: 'red',
  },
  md_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000b3',
  },
  md_dialogView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width - 40,
    paddingVertical: 20,
  },
  md_title: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 28,
    color: '#1B202B',
    alignSelf: 'center',
    marginBottom: 10,
  },
  md_optText: {
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    color: '#6F6F7B',
    padding: 10,
    paddingHorizontal: 20,
  },
  md_optTouch: {
    backgroundColor: 'white',
  },
  md_optTouch_T: {
    backgroundColor: '#FFD00D14',
  },
});
