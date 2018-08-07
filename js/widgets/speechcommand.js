/**
 *  ChatBot : Author ~ Pri0ri7y !
 *  Safemode : Directly executes the command without cross confirmation
 *             
 *  Dependencies:
 *      1. Google Maps API
 *      2. jarvis-reply widget
 *      3. 
 
 *     this._safemode => executes commands only after confirmation
 *     this._tracker  => Yes/No tracker for verbal confirmation on methods to be executed 
 *     __RB-ZONE__ => Reply Back zone of J.A.R.V.I.S [If user enables smart mode]
 * 
 */


define([
    'dojo/_base/declare',
    'dojo/_base/lang',    
    'dojo/topic',   
    "dojo/query",
    "dojo/on",
    "js/class/googlemaps.js"
], function (declare, lang, topic, query, on, googleMapsUtils) {
    return declare(null, {
        buttonShowStyle: 'display: block;',
        buttonNoShowStyle: 'display: none;',       
        constructor: function (options, node) {
            this.options = options;            
            this._safemode = true;         
            this._trackerintel = {};    
            this.googleMapsUtils = new googleMapsUtils({'package':'mmrc-ug'});
            this.startup(); 
        },
        
        /**
         *  Add All the Commands here for Jarvis to respond
         *  Accessing global_Jarvis from jarvis.js
         */

        /**

        LIST OF PROPOSED COMMANDS
        --------------------------
        1. GREETINGS
        2. GO TO MY LOCATION / **PLACE_NAME** _REVERSE-GEOCODE_ _SAFE_SEARCH_ (RESTRICT TO AREA BASED __ GOOGLE APIs) 
        3. OPEN ITOOL -> REPLY BACK BY ASKING ID -> GET ID AND OPEN ITOOL
        4. SEARCH FOR **PLACE** (RESTRICT TO AREA BASED __ GOOGLE APIs) 
        5. SHOW ME / OPEN / GET ME / S-CURVE ; NCR ; _THEN_  PARAMS _THEN_ DISPLAY [OTHER CHARTS AND ANALYSIS]
        6. UPDATE I-TOOL [ SEARCH WITH UPDATE OPTIONS ]
        7. OPEN MY PROFILE / PERSONAL PROFILE / PREFERENCES [USER PAGE]
        8. SHOW HELP/ HELP/ ASSISTANCE        
        9. _GLOBAL_YES_NO_HANDLER

        **/

        addcommands: function(){
            var t = this;
            t.options._jarvis.when("NOT_COMMAND_MATCHED",function(){
                console.log("Fucker can't speak english ?! hablo espanol ??");
                console.log("Trigger happens for pumping the recognized command into bigdata XD");
            });
 
            t.commands = [   
                {
                    /** GLOBAL_YES_HANDLER */
                    indexes: ["yes","yeah","yup"],
                    smart: false,
                    action: function(i){                         
                      t._GLOBAL_YES_HANDLER_();                    
                    }
                },               
                {
                    /** GLOBAL_YES_HANDLER */
                    indexes: ["no","nah","nope"],
                    smart: false,
                    action: function(i){                         
                      t._GLOBAL_NO_HANDLER_();                    
                    }

                },
                {
                    /** 1. GREETINGS */
                    indexes: ["hi","hello","hey","good morning","good afternoon","good evening"],
                    smart: false,
                    action: function(i){                         
                      t._SPEECH_GREETINGS_(i);                    
                    }
                },
                {
                    /** 2. GO TO MY LOCATION **/
                    indexes: ["go to *", "navigate to *", "zoom to *", "search for *"],
                    smart: true,
                    action: function(i,w){                         
                      t._SPEECH_GO_TO_(i,w);                    
                    }
                },
                {
                    /** 3. HELP **/
                    indexes: ["help","help me","help options"],
                    smart: false,
                    action: function(i,w){                         
                      t._SPEECH_HELP_(i,w);                    
                    }
                },
                {
                    /** 3. DASHBOARDS / REPORTS **/
                    indexes: ["open *", "show me *"],
                    smart: true,
                    action: function(i,w){                         
                      t._SPEECH_DASHBOARD_REPORT_(i,w);   
                      
                      //if i == 1 && * is not in the list of executables THEN trigger _SPEECH_GO_TO_
                      


                    }


                }         

             ];

            t.options._jarvis.addCommands(t.commands);
          
        },

        startup: function () {
            var t = this;            
            
            //Initialize the toggle buttons
            $(t.options._safemodetoggle).bootstrapToggle({
                onstyle: 'success',
                offstyle: 'danger',
                on: 'Safe',
                off: 'Not Safe',
                size: 'mini'
            });
            $(t.options._recordsound).bootstrapToggle({
                on: 'Recording',
                off: 'Want to chat?',
                size: 'mini',
                width: 98                
            });
            
            
            $(t.options._safemodetoggle).change( lang.hitch(this,function() {
                if( $(t.options._safemodetoggle).prop('checked') )
                { this._safemode = true; }
                else{ this._safemode = false; }
            }));

            $(t.options._recordsound).change( lang.hitch(this,function() {
                if( $(t.options._recordsound).prop('checked') )
                {  this._startrecording(); }
                else{ this.options._jarvis.fatality(); }                
            }));                          
           
        },         

        _startrecording: function () {
             
            this.options._jarvis.initialize({
                lang:"en-US",
                continuous:true,
                listen:true, 
                debug:true, // Show everything in the console
                speed:1  //  , // talk normally
               // name: 'Jarvis'
            }).then(() => {
                console.log("Artyom succesfully initialized");
            }).catch((err) => {
                console.log("Artyom couldn't be initialized, please check the console for errors");
                console.log(err);
            });                 
             
            this.addcommands();
        },      
        /**      __SPEECH_METHODS_SECTION         **/
        
        // 0.0 GLOABL_YES
        _GLOBAL_YES_HANDLER_: function(){
          
          var _case_ = this._trackerintel['_case_'];
          switch(_case_){
            
            case '_SPEECH_GREETINGS_':
                console.log('_SPEECH_GREETINGS_');
                this._SPEECH_GREETINGS_YES_NO('y');
            


            default:
                console.log('default condition');
                break;
          }            
        },
        // 0.1 GLOBAL_NO
        _GLOBAL_NO_HANDLER_: function(){
         
          var _case_ = this._trackerintel['_case_'];
          switch(_case_){
            
            case '_SPEECH_GREETINGS_':
                console.log('_SPEECH_GREETINGS_');
                this._SPEECH_GREETINGS_YES_NO('n');
            
            default:
                console.log('default condition');
                break;
          }
        },        

        // 1. GREETINGS
        _SPEECH_GREETINGS_: function(i){
            console.log("Hey yo !! Warm greetings bruh ! Roll me a joint !");
            /** reply back part of jarvis, if the user enables smart mode  */
            $(this.options._jarviscontentNode).html('<p>Hey! Do you need help with our app?</p><p>say <b>yes</b> or <b>no</b><p/>');
            $(this.options._jarvisreplyTrigger).click();  
            this._trackerintel['_case_'] = '_SPEECH_GREETINGS_';
        },
        
        _SPEECH_GREETINGS_YES_NO:function(e){
              
              if(e == 'y') {
                  console.log("Help options started");
                  this._trackerintel = {};
              }              
              
              if(e == 'n'){
                  console.log("You can call for help at any point in time by saying 'help' ");      
                  this._trackerintel = {};  
              }

        },

        // 2. GO TO MY LOCATION **PLACE_NAME** [ _AREA_BOUND_SEARCH ]
        _SPEECH_GO_TO_: function(i,w){
            
            /**
             * GLOB_VARS_DECLARATION 
            **/

            var trigger_reference = ["go to ", "navigate to ", "zoom to ", "search for "];
            
            /**  
             *  => FUZZY ALGORITHM COMES HERE FOR CROSS VERIFYING THE VOICE COMMAND'S *VARIABLE*
             * 
             *  _1.0  GOOGLE_SEARCH_RESULTS
            **/
            
            var d_l_distance = this.googleMapsUtils._d_l_distance_calculation(w);
            console.log(d_l_distance);
             

        },
 

        /** **/
       _otherutils: function(){


       }
        
    });
});

 