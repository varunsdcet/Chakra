import firebase from "firebase";
const GLOBAL = require('./Global');
class Backend {
    uid = GLOBAL.user_id;
    messagesRef = null;
    messagesRefs = null;
    messagesRefss = null;
    // initialize Firebase Backend
    constructor() {
        firebase.initializeApp({
          apiKey: "AIzaSyCclp8O4gDizbZFvRBxVlTRp1Slyf8LFig",
        authDomain: "astrohelp24-75109.firebaseapp.com",
        databaseURL: "https://astrohelp24-75109-default-rtdb.firebaseio.com",
    projectId: "astrohelp24-75109",
     storageBucket: "astrohelp24-75109.appspot.com",
     messagingSenderId: "318372956157",
     appId: "1:318372956157:web:0ef9dafee9ed0dc9357b94",
     measurementId: "G-QR0RJBJ6L0"
        });

    }
    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }





    // retrieve the messages from the Backend

    loadMessagess(callbacks) {
       // alert(JSON.stringify(callbacks))

          this.messagesRefs =  firebase.database().ref().child("chat/" + GLOBAL.bookingid + 'type');
        if (this.messagesRefs.length == 0) {
            this.messagesRefs.push({
                typinguser: false,
                typinganother: false,
                name :'harshit',

            });


        }


        const onReceives = data => {
           // alert(JSON.stringify(data))
          this.messagesRefs.once("value").then(function(snapshot) {
              const message = snapshot.val();
             // alert(message.typinganother)

          //    alert(JSON.stringify(message))

              // snapshot.forEach(function(childSnapshot) {
              //     var key = childSnapshot.name;
              //     var childData = childSnapshot.val();
              //   //  alert(JSON.stringify(childSnapshot))
              //
              // });



             if (message.userid == GLOBAL.user_id){
                 callbacks({
                     name: message.name,
                     typinganother: message.typinganother,

                 })
             }else{
                 callbacks({
                     name: message.name,
                     typinganother: message.typinguser,

                 })
             }

          //    alert(JSON.stringify(callbacks))
            //  this.loadMessagess(callbacks)

            })

         //   alert(data.typinganother)
         //    this.messagesRefs.then(snapshot => {
         //        alert(JSON.stringify(snapshot.value))
         //    })
           // alert(JSON.stringify(data))


            // const message = data.val();
            // callbacks({
            //     _id: '',
            //     text: '',
            //     //createdAt: new Date(message.createdAt),
            //     createdAt: '',
            //     user: {
            //         _id: '',
            //         name: ''
            //     }
            // });
        };

        this.messagesRefs
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_changed", onReceives);

    }



    updateMessage(callbacks) {

        this.messagesRefss =  firebase.database().ref().child("chat/" + GLOBAL.bookingid);

       this.messagesRefss.off(); //Detaches a callback previously attached with on()


        // this.messagesRef.upd
        var query =  this.messagesRefss.orderByChild('anotherid').equalTo(GLOBAL.user_id)
        query.on('value', function(snapshot) {
            snapshot.forEach(function(weekSnapshot) {
                console.log(weekSnapshot.val());
                weekSnapshot.ref.update({ status: true });
            });
        });

        const onReceives = data => {
            alert(JSON.stringify(data))
            const message = data.val();





           //  alert(JSON.stringify(message))

            callbacks({
                _id: data.key,
                text: message.text,
                //createdAt: new Date(message.createdAt),
                createdAt: message.createdAt,
                status:message.status,
                user_id:message.user_id,
                anotherid:message.another,
                image:message.image,

                user: {
                    _id: message.user._id,
                    name: message.user.name
                }
            });
        };



        var d = this.getLimit();
        //  console.log(d);
        //   Generates a new Query object limited to the last specific number of children.
        //    this.messagesRef.limitToLast(10).on("child_added", onReceive);
        // this.messagesRef
        //     .orderByChild("createdAt")
        //     //.startAt(d)
        //     //.endAt("2017-11-27T06:51:47.851Z")
        //     .on("child_added", onReceive);



        this.messagesRefss
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_changed", onReceives);


    }


    loadMessages(callback) {
        this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.bookingid);
        this.messagesRef.off();

        const url = GLOBAL.BASE_URL +  'chat_read'


            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_group_id :GLOBAL.bookingid,
                user_id : GLOBAL.user_id,


              }),
            }).then((response) => response.json())
                .then((responseJson) => {


                })
                .catch((error) => {
                  console.error(error);
                });



        var query =  this.messagesRef.orderByChild('anotherid').equalTo(GLOBAL.user_id)
        query.on('value', function(snapshot) {
            snapshot.forEach(function(weekSnapshot) {
                console.log(weekSnapshot.val());
               // alert(JSON.stringify(weekSnapshot))
                weekSnapshot.ref.update({ status: true });
            });
        });

        const onReceives = data => {

            const message = data.val();





            // alert(JSON.stringify(message))

            callback({
                 _id: data.key,
                 text: '',
                // //createdAt: new Date(message.createdAt),
                // createdAt: message.createdAt,
                status:message.status,
                // user_id:message.user_id,
                // anotherid:message.anotherid,
                //
                // user: {
                //     _id: message.user._id,
                //     name: message.user.name
                // }
            });
        };

        const onReceive = data => {
            // alert(JSON.stringify(data))
            const message = data.val();





            // alert(JSON.stringify(message))

            callback({
                _id: data.key,
                text: message.text,
                //createdAt: new Date(message.createdAt),
                createdAt: message.createdAt,
                status:message.status,
                user_id:message.user_id,
                anotherid:message.another,
                image:message.image,

                user: {
                    _id: message.user._id,
                    name: message.user.name
                }
            });
        };



        var d = this.getLimit();
        //  console.log(d);
        //   Generates a new Query object limited to the last specific number of children.
        //    this.messagesRef.limitToLast(10).on("child_added", onReceive);
        this.messagesRef
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_added", onReceive);



        this.messagesRef
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_changed", onReceives);


    }



    sendImage(image){
      //  const ext = image.split('.').pop(); // Extract image extension
        const filename = `${1}.png`; // Generate unique name

        firebase.storage().ref().bucket

        firebase
            .storage()
            .ref(`tutorials/images/${filename}`)
            .putFile(image)
            .on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                    let state = {};
                    state = {
                        ...state,
                        progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
                    };
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                        const allImages = this.state.images;
                        allImages.push(snapshot.downloadURL);
                        state = {
                            ...state,
                            uploading: false,
                            imgSource: '',
                            imageUri: '',
                            progress: 0,
                            images: allImages
                        };

                    }
                    this.setState(state);
                },
                error => {
                    unsubscribe();
                    alert('Sorry, Try again.');
                }
            );
    }

    // send the message to the Backend

    seen(callback){
        //alert('dd')
        this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.bookingid);
        this.messagesRef.update({ status: true});
        //this.messagesRef.off(); //Detaches a callback previously attached with on()
        const onRece = data => {

            const message = data.val();
          //  alert(JSON.stringify(message))

            for (let i = 0; i < message.length; i++) {



                this.messagesRef.update({ status: true});
            }

            // this.messagesRef
            //     .orderByChild("createdAt")
            //     //.startAt(d)
            //     //.endAt("2017-11-27T06:51:47.851Z")
            //     .on("child_changed", onRece);
        };



        var d = this.getLimit();
        console.log(d);
        //Generates a new Query object limited to the last specific number of children.
        //this.messagesRef.limitToLast(10).on("child_added", onReceive);
        this.messagesRef
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_changed", onRece);
    }
    updateTyping(text){
        this.messagesRefs =  firebase.database().ref().child("chat/" + GLOBAL.bookingid + 'type');
        if (text.length == 0){
            this.messagesRefs.update({ typinguser: false, typinganother: false,name :GLOBAL.myname,userid:GLOBAL.user_id });
          //  this.messagesRefs[0].typinguser = false

        }else{
            this.messagesRefs.update({ typinguser: true, typinganother: false,name :GLOBAL.myname ,userid:GLOBAL.user_id});
          //  this.messagesRefs[0].typinguser = true
        }
    }

    sendMessage(message) {
      //  this.messagesRef.update({ status: true});
// alert(GLOBAL.chatstatus)
//         if (GLOBAL.chatstatus == true) {
            //console.log(new Date(firebase.database.ServerValue.TIMESTAMP));
            var today = new Date();
            /* today.setDate(today.getDate() - 30);
            var timestamp = new Date(today).toISOString(); */
            var timestamp = today.toISOString();
            //this.messagesRef = [];
            for (let i = 0; i < message.length; i++) {
var z = "";
              var k = message[i].hasOwnProperty('image')
                   if (k == true){
                     z = message[i].image;


                   } else {
                     z = "";

                   }
                   if (message[i].text != ""){
                this.messagesRef.push({

                    text: message[i].text,
                    user: message[i].user,
                    createdAt: timestamp,
                    user_id:GLOBAL.user_id,
                    anotherid:GLOBAL.another,
                    status: false,
                    image:z,
                });
              }
              //  this.messagesRefs.update({ typinguser: false, typinganother: false ,name :GLOBAL.myname,userid:GLOBAL.user_id});
            }
    //    }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }

    getLimit() {
        var today = new Date();
        //var milliseconds = Date.parse(today);
        //var changed = milliseconds - 86400000; //10 minutes (- 900000) -  86400000 1 day
        today.setDate(today.getDate() - 31); // last 30 Days
        //console.log(today);
        var changedISODate = new Date(today).toISOString();
        //var changedISODate = today.toISOString();
        console.log(changedISODate);
        return changedISODate;
    }
}

export default new Backend();
