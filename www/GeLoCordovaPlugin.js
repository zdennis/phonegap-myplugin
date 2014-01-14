var GeLoCordovaPlugin = {
  /*
    The set of currently supported constants recognized by the GeLoBeaconManager.
  */
  Constants: {
    GeLoNearestBeaconExpired: "GeLoNearestBeaconExpired",
    GeLoNearestBeaconChanged: "GeLoNearestBeaconChanged",
    GeLoBeaconExpired: "GeLoBeaconExpired",
    GeLoBeaconFound: "GeLoBeaconFound",
    GeLoBeaconAgedGracefully: "GeLoBeaconAgedGracefully",
    GeLoBTLEStateUnknown: "GeLoBTLEStateUnknown",
    GeLoBTLEPoweredOff: "GeLoBTLEPoweredOff",
    GeLoBTLEPoweredOn: "GeLoBTLEPoweredOn",
    GeLoBTLEUnsupported: "GeLoBTLEUnsupported",
    GeLoScanningStarted: "GeLoScanningStarted",
    GeLoScanningStopped: "GeLoScanningStopped"
  },

  /*
    Creates an instance of a GeLoBeacon.

    @constructor
    @param {object} beacon Information about a GeLo beacon.
      Expects beacon to have properties: beaconId, signalStrength, receivedRSSI, timeToLive, and txPower.
  */
  GeLoBeacon: function(beacon) {
    this.beaconId = beacon.beaconId;
    this.signalStrength = beacon.signalStrength;
    this.receivedRSSI = beacon.receivedRSSI;
    this.timeToLive = beacon.timeToLive;
    this.txPower = beacon.txPower;
  },

  /*
    Registers for a notification sent by the GeLoBeaconManager. The GeLoBeaconManager communicates beacon events through
      these notifications.

    @callback callback
    @param {string} sdkConstant The constant used to register for a notification. Use a constant provided by the plugin.
  */
  on: function(sdkConstant, callback){
    if(typeof callback !== "function"){
      throw {
        name:        "ArgumentError",
        message:     "callback should have been a function, but it was: " + callback + " ("  +(typeof callback) + ")",
        toString:    function(){return this.name + ": " + this.message}
      }
    }

    return cordova.exec(
      function(message){
        var jsonObj = $.parseJSON(message);
        callback(jsonObj);
      },
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "on",
      [sdkConstant, callback]
    );
  },

  /*
    Notifies the beacon manager to start scanning for beacons. If you are interested in knowing when
    scanning has actually started then listen for the GeLoScanningStarted event.

    @param {array} args An array of optional arguments.
      If a single argument is given it will be the number of milliseconds to delay before starting the scan.
      If two arguments are supplied, the first is a callback function to call immediately after telling the GeLoBeaconManager
      to start scanning and the second argument is the number of milliseconds to delay before starting the scan.
  */
  startScanningForBeacons: function(delayInMilliseconds){
    if(!delayInMilliseconds) delayInMilliseconds = 0;

    if(typeof delayInMilliseconds !== "number"){
      throw {
        name:        "ArgumentError",
        message:     "delayInMilliseconds should have been a number, but it was: " + delayInMilliseconds + " ("  +(typeof delayInMilliseconds) + ")",
        toString:    function(){return this.name + ": " + this.message}
      }
    }

    var _startScanning = function(){
      var result = cordova.exec(
        function(message){},
        function(){
          console.log("Fail");
        },
        "GeLoCordovaPlugin",
        "startScanningForBeacons",
        []
      );
      return result;
    };

    setTimeout(_startScanning, delayMilliseconds);
  },

  /*
    Notifies the beacon manager to stop scanning for beacons. If you are interested in knowing when
    scanning has actually stopped then listen for the GeLoScanningStopped event.
  */
  stopScanningForBeacons: function(){
    return cordova.exec(
      function(message){},
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "stopScanningForBeacons",
      []
    );
  },

  /*
    Returns whether the beacon manager is currently scanning.

    @callback callback
    @returns {boolean} Scanning status.
  */
  isScanning: function(callback){
    return cordova.exec(
      function(message){
        var jsonObj = $.parseJSON(message);
        callback(jsonObj);
      },
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "isScanning",
      []
    );
  },

  /*
    Sets the time limit for the beacon manager to maintain a reference to a known beacon. If the beacon
    hasn't been seen in the given number of seconds then the beacon manager will expire the beacon
    and will forget about it. If you are interested in this event listen for the GeLoBeaconExpired event.

    @param {number} seconds The time in seconds that the timer starts at.
  */
  setDefaultTimeToLive: function(seconds){
    return cordova.exec(
      function(message){},
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "setDefaultTimeToLive",
      [seconds]
    );
  },


  /*
    Sets the minimum signal strength threshold for beacon recognition. If a beacon's signal is weaker than
    this then the beacon manager will pretend to not have seen it.

    @param {number} arg The signal strength, values are negative and the closer to zero the stronger the signal strenth.
  */
  setDefaultFalloff: function(arg){
    return cordova.exec(
      function(message){},
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "setDefaultFalloff",
      [arg]
    );
  },

  /*
    Sets the maximum signal strength threshold for beacon recognition.

    @param {number} arg The signal strengh, values are negative and the closer to zero the stronger the signal strength.
  */
  setDefaultSignalCeiling: function(arg){
    return cordova.exec(
      function(message){},
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "setDefaultSignalCeiling",
      [arg]
    );
  },

  /*
    Retrieves the current list of known beacons.

    @callback callback
    @returns {array} An array that contains GeLoBeacon objects recorded by the beacon manager.
  */
  knownBeacons: function(callback){
    return cordova.exec(
      function(beacons){
        var jsonObj = $.parseJSON(beacons),
            beaconArray = [];
        $.each(jsonObj, function(idx, beacon) {
          beaconArray.push(new GeLoCordovaPlugin.GeLoBeacon(beacon));
        })
        callback(beaconArray);
      },
      function(){
        callback([]);
      },
      "GeLoCordovaPlugin",
      "knownBeacons",
      []
    );
  },

  /*
    Retrieves the current nearest beacon. If you are interested in being notified of
    when the nearest beacon changes then listen for the GeLoNearestBeaconChanged event.

    @callback callback
    @returns {object} The nearest GeLoBeacon.
  */
  nearestBeacon: function(callback){
    return cordova.exec(
      function(beacon){
        var jsonObj = $.parseJSON(beacon);
        callback(new GeLoCordovaPlugin.GeLoBeacon(jsonObj));
      },
      function(){
        callback({});
      },
      "GeLoCordovaPlugin",
      "nearestBeacon",
      []
    );
  },

  /*
    Unsets the nearest beacon so that the beacon manager is forced to find the nearest beacon again.
  */
  unsetNearestBeacon: function(){
    return cordova.exec(
      function(message){},
      function(){
        console.log("Fail");
      },
      "GeLoCordovaPlugin",
      "unsetNearestBeacon",
      []
    );
  }
};

module.exports = GeLoCordovaPlugin;
