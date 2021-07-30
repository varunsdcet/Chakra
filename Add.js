import {
    SafeAreaView,
    Platform,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Alert,
    TouchableOpacity,
    TextInput,
    Image,
    ImageBackground,
    Linking,
    FlatList,
    Dimensions,
    AsyncStorage,
    PermissionsAndroid,
    NativeModules,
    BackHandler,
    Modal,



} from 'react-native';
const GLOBAL = require('./Global');
import {globalStyle, headerStyle} from '../styles/styles';
import LinearGradient from 'react-native-linear-gradient';
import React, { Component, } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import store from '../redux/store';
import {AddAdress} from '../backend/Api';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
location:'',
            add: '',
            lat: 0,
            long: 0,
            height:40,
            imageget: 0,
            modalVisible:false,
            selected:[],
            name:'',
            mobile:'',
            visible:false,
            city:[],
            selectedcity:'',
            area:'',
            visibles:false,
            arearray:[],
            pincode:'',

        }
    }

    onSelect = data => {
      console.log(JSON.stringify(data))
       //this.setState(data);
     };

unsubscribe;
     componentWillUnmount () {
       this.unsubscribe()
         BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
     }
     handleBackButtonClick =() => {

      this.setState({visibles:false})
      this.setState({modalVisible:false})
          this.setState({visible:false})
          //return true
     }
    componentDidMount () {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      const granted =  PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

if (granted) {
  console.log( "You can use the ACCESS_FINE_LOCATION" )
}
else {
alert("Location Permisson not granted")
}

      // GetLocations({name: ''})
      //   .then((data) => {
      //
      //     if (data.status) {
      //   //  alert(JSON.stringify(data))
      //     this.setState({city:data.data})
      //
      //     } else {
      //       alert(data)
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('error', error);
      //   });


    //  alert(this.props.route.params.rahi)
        this.unsubscribe = store.subscribe(() => {
          //this.setState({lat:store.getState().location.geometry.location.lat})
          //this.setState({add:store.getState().location.address_components[0].long_name})
                  //  this.setState({lon:store.getState().location.geometry.location.lng})


      // console.log(JSON.stringify(store.getState().location));
     })
       this.props.navigation.addListener ('willFocus', async () =>{
     alert("willFocus runs") // calling it here to make sure it is logged at every time screen is focused after initial start
   });
   this.props.navigation.addListener('willFocus', payload  => {
  console.debug('focused A!'); // calling it here to make sure it is logged at every time screen is focused after initial start
  });
         this.props.navigation.addListener('willFocus',this._handleStateChange);
      this.currentLocation()
    }

    setModalVisible=()=> {
if (this.state.name.length == 0){
  alert('Please Enter Name')
}
else if (this.state.mobile.length == 0){
  alert('Please Enter Mobile Number')
}
else if (this.state.mobile.length < 10){
  alert('Please Enter Valid Mobile Number')
}

else if (this.state.location.length == 0){
  alert('Please Enter Address')
}
else if (this.state.selectedcity.length == 0){
  alert('Please Enter Location')
}

else{

  AddAdress({name: this.state.name,phone:this.state.mobile,flat:this.state.location,latitude:this.state.lat.toString(),longitude:this.state.long.toString(),location:this.state.selectedcity})
    .then((data) => {

      if (data.status) {
      console.log(JSON.stringify(data))


      this.props.navigation.goBack()
      } else {
        alert(JSON.stringify(data.data))
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
}
}




      setModalVisible2=()=> {

      }


    currentLocation = () => {
      Geolocation.getCurrentPosition(info => {
      //  alert(info.coords.longitude)

        this.setState({lat:info.coords.latitude})
        this.setState({long:info.coords.longitude})



var k = {lat: info.coords.latitude.toString(),lon:info.coords.longitude.toString()}

console.log(k)
        // Pincode({lat: info.coords.latitude.toString(),lon:info.coords.longitude.toString()})
        //   .then((data) => {
        //
        //     if (data.status) {
        //     //  alert(JSON.stringify(data))
        //       this.setState({selectedcity:data.data.location})
        //       this.navigates(data.data,0)
        //
        //       //this.props.navigation.state.params.onSelect({ selected: true });
        //
        //     //  this.props.navigation.state.params.selected =  details
        //     } else {
        //       alert(data.message)
        //     }
        //   })
        //   .catch((error) => {
        //     console.log('error', error);
        //   });



        });














    }

// componentDidUpdate (){
// alert('hh')
// }
navigatess = (item,index) =>{
  let tempCoords = {
          latitude: Number(item.lat),
          longitude: Number(item.lon)
      }
      this._map.animateToCoordinate(tempCoords, 1);

  this.setState({lat:parseFloat(item.lat)})
  this.setState({long:parseFloat(item.lon)})




  this.setState({area:item.name})
  this.setState({visibles:false})
  this.setState({pincode:item.pincode})


}
navigates = (item,index) =>{

  this.setState({lat:parseFloat(item.lat)})
  this.setState({long:parseFloat(item.lon)})


  let tempCoords = {
          latitude: Number(item.lat),
          longitude: Number(item.lon)
      }
      this._map.animateToCoordinate(tempCoords, 1);
  //alert(item.name)
  this.setState({area:''})
  this.setState({selectedcity:item.name})
  this.setState({visible:false})

  GetSociety({location_id:item.id })
    .then((data) => {

      if (data.status) {
    //  alert(JSON.stringify(data))
      this.setState({arearray:data.data})
    //  this.setState({city:data.data})

      } else {
        alert(data)
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
}
renderItemProduct = ({ item, index }) => {
    // alert(JSON.stringify(item))
    return (

      <TouchableOpacity onPress={() => this.navigates(item,index)} >
      <View style = {{backgroundColor:'white'}}>
<View style = {{backgroundColor:'white',flexDirection:'row',justifyContent:'space-between'}}>

<Text style = {{color:'#000521',fontSize:17,fontFamily:'AvenirLTStd-Medium',marginTop:7,marginLeft:20}}>
{item.name}

</Text>



</View>
<View style = {{width:'100%',margin:10,height:1,backgroundColor:'#D8D8D8',height:1}}>

</View>
</View>
</TouchableOpacity>

    )
}

 onChanged (text) {
    this.setState({
        mobile: text.replace(/[^0-9]/g, ''),
    });
}
renderItemProducts = ({ item, index }) => {
    // alert(JSON.stringify(item))
    return (

      <TouchableOpacity onPress={() => this.navigatess(item,index)} >
      <View style = {{backgroundColor:'white'}}>
<View style = {{backgroundColor:'white',flexDirection:'row',justifyContent:'space-between'}}>

<Text style = {{color:'#000521',fontSize:17,fontFamily:'AvenirLTStd-Medium',marginTop:7,marginLeft:20}}>
{item.name}

</Text>



</View>
<View style = {{width:'100%',margin:10,height:1,backgroundColor:'#D8D8D8',height:1}}>

</View>
</View>
</TouchableOpacity>

    )
}

    render() {
        return (

            <SafeAreaProvider style={{ backgroundColor: 'white' }}>
                <StatusBar
                    backgroundColor={GLOBAL.tsecondcolor}


                />

                <LinearGradient
                  style={headerStyle.view}
                  colors={[GLOBAL.apptype =="neel"?GLOBAL.tfirstcolor:GLOBAL.bfirstcolor, GLOBAL.apptype=="neel"?GLOBAL.tsecondcolor:GLOBAL.bsecondcolor]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <TouchableOpacity
                    style={headerStyle.backTouch}
                    onPress={this.props.navigation.goBack}>

                    <Image
                      source={require('../resources/whiteback.png')}
                      style={headerStyle.backImage}
                    />
                  </TouchableOpacity>

                  <Text style={headerStyle.title}>Add</Text>
</LinearGradient>

                <KeyboardAwareScrollView keyboardShouldPersistTaps = "always" style={{ width: Dimensions.get('window').width, backgroundColor: 'white' }}>



                        <MapView

                            style={{ width: '100%', height: 230 }}
                            ref={component => this._map = component}
                            initialRegion={{
                                latitude: this.state.lat,
                                longitude: this.state.long,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}>


                            <Marker
                                coordinate={{
                                    latitude: this.state.lat,
                                    longitude: this.state.long,
                                }}
                                image={require('../resources/mark.png')}

                            />
                        </MapView>








<View>
                    <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Medium', fontWeight:'bold',color: '#69707F', marginTop: 22, marginLeft: '6%', width: '88%' }}>Select City</Text>


                    <View style={{  height: 40, width: '88%', alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: '#EAECEF', marginTop: 16 }}>
                        <TextInput
                            style={{ height: 40, width: '100%', fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#1D1E2C' }}
                            placeholder="Enter Location"
                            placeholderTextColor="#1D1E2C"


                            onChangeText={(text) => this.setState({ selectedcity: text })}
                            value={this.state.selectedcity}
                        />


                    </View>

</View>








                    <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Medium', fontWeight:'bold',color: '#69707F', marginTop: 22, marginLeft: '6%', width: '88%' }}>Flat / Building / Street</Text>


                    <View style={{  height: 40, width: '88%', alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: '#EAECEF', marginTop: 16 }}>
                        <TextInput
                            style={{ height: 40, width: '100%', fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#1D1E2C' }}
                            placeholder="Enter Locality"
                            placeholderTextColor="#1D1E2C"

                            onChangeText={(text) => this.setState({ location: text })}
                            value={this.state.location}
                        />


                    </View>

                    <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Medium', fontWeight:'bold',color: '#69707F', marginTop: 22, marginLeft: '6%', width: '88%' }}>Name</Text>


                    <View style={{  height: 40, width: '88%', alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: '#EAECEF', marginTop: 16 }}>
                        <TextInput
                            style={{ height: 40, width: '100%', fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#1D1E2C' }}
                            placeholder="Name"
                            placeholderTextColor="#1D1E2C"
                            onChangeText={(text) => this.setState({ name: text })}
                            value={this.state.name}
                        />


                    </View>

                    <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Medium', fontWeight:'bold',color: '#69707F', marginTop: 22, marginLeft: '6%', width: '88%' }}>Mobile</Text>


                    <View style={{  height: 40, width: '88%', alignSelf: 'center', borderBottomWidth: 1, borderBottomColor: '#EAECEF', marginTop: 16 }}>
                        <TextInput
                            style={{ height: 40, width: '100%', fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#1D1E2C' }}
                            placeholder="Mobile"
                            placeholderTextColor="#1D1E2C"
                            onChangeText={(text) => this.onChanged(text)}
                            value={this.state.mobile}
                                  maxLength={10}
                                keyboardType={'numeric'}
                        />


                    </View>

                    <TouchableOpacity style={{ height: 50, width: '86%', borderRadius: 25, alignSelf: 'center', marginTop: 10, justifyContent: 'center', backgroundColor: GLOBAL.tsecondcolor }} onPress={() => this.setModalVisible()}>
                        <Text style={{ fontSize: 16, fontFamily: 'Nunito-SemiBold', color: 'white', alignSelf: 'center' }}>SUBMIT</Text>
                    </TouchableOpacity>



                    <Dialog
              visible={this.state.visibles}
              onTouchOutside={() => {
              this.setState({visibles:false})
              }}
              >
              <DialogContent>
              <View style = {{width:300}}>
              <FlatList style = {{marginTop:20}}
                        data={this.state.arearray}


                        renderItem={this.renderItemProducts}
                    />
                    </View>
              </DialogContent>
              </Dialog>

                                      <Dialog
                        visible={this.state.visible}
                        onTouchOutside={() => {
                        this.setState({visible:false})
                        }}
                      >
                        <DialogContent>
                        <View style = {{width:300}}>
                        <FlatList style = {{marginTop:20}}
                                          data={this.state.city}


                                          renderItem={this.renderItemProduct}
                                      />
                                      </View>
                        </DialogContent>
                      </Dialog>
                </KeyboardAwareScrollView>




            </SafeAreaProvider>

        );
    }
}

export default Add;
