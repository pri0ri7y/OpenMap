/**
 *  GOOGLE_MAPS_API : AUTHOR ~ Pri0ri7y!!
 *  TYPE : GOOGLE_COMONS_UTILITY
 */

define([
    'dojo/_base/declare',
    'dojo/text!baseconfig/voicecommand.json'     
], function (declare,voicecommand) {
    return declare(null, {        
        constructor: function (options) {
           
        /*
        *   Options will internally load all the data necessary for fuzzy logic
        */

        this.package = options.package;
        this.config = JSON.parse(voicecommand);
        
        },        
        _testmethod: function(a,b){           
            return {
                'parameter_b':b,
                'parameter_a':a,
                'type':'testresult'
                };
        },
        
        _d_l_distance_calculation: function(txt){
            
            for(var i = 0; i < this.config['places']; i++){
               
               var d = damerau_levenshtein_distance(txt,this.config['places'][i]);
               console.log(d)

            }                   
        }

    });
});