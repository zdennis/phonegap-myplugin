#import "MyPlugin.h"
#import "MyPluginJavaScriptExpression.h"
#import <GeLoSDK/GeLoSDK.h>


@implementation MyPlugin

-(void)startScanningForBeacons:(CDVInvokedUrlCommand*)command {
    [[GeLoBeaconManager sharedInstance] startScanningForBeacons];
}

-(void)stopScanningForBeacons:(CDVInvokedUrlCommand*)command {
    [[GeLoBeaconManager sharedInstance] stopScanningForBeacons];
}

-(void)isScanning:(CDVInvokedUrlCommand*)command {
    BOOL scanningStatus = [[GeLoBeaconManager sharedInstance] isScanning];
    NSString *returnString = scanningStatus ? @"true" : @"false";
    [self.webView stringByEvaluatingJavaScriptFromString:returnString];
}

-(void)setDefaultTimeToLive:(CDVInvokedUrlCommand*)command {
    NSNumber *ttl = [command.arguments objectAtIndex:0];
    [[GeLoBeaconManager sharedInstance] setDefaultTimeToLive:[ttl integerValue]];
}

-(void)setDefaultFalloff:(CDVInvokedUrlCommand*)command {
    NSNumber *falloff = [command.arguments objectAtIndex:0];
    [[GeLoBeaconManager sharedInstance] setDefaultFalloff:[falloff integerValue]];
}

-(void)setDefaultSignalCeiling:(CDVInvokedUrlCommand*)command {
    NSNumber *signalCeiling = [command.arguments objectAtIndex:0];
    [[GeLoBeaconManager sharedInstance] setDefaultSignalCeiling:[signalCeiling integerValue]];
}

-(void)knownBeacons:(CDVInvokedUrlCommand*)command {
    NSArray *beacons = [[GeLoBeaconManager sharedInstance] knownBeacons];
    //get beacon array json and send it
}

-(void)nearestBeacon:(CDVInvokedUrlCommand*)command {
    GeLoBeacon *beacon = [[GeLoBeaconManager sharedInstance] nearestBeacon];
    NSString *jsObject = [MyPluginJavaScriptExpression javascriptForGeLoBeacon:beacon];
    [self.webView stringByEvaluatingJavaScriptFromString:jsObject];
}

-(void)unsetNearestBeacon:(CDVInvokedUrlCommand*)command {
    [[GeLoBeaconManager sharedInstance] unsetNearestBeacon];
}

-(void)on:(CDVInvokedUrlCommand*)command {
    if (!_callbacks)
        _callbacks = [NSMutableDictionary dictionary];

    NSString *notificationName = [command.arguments objectAtIndex:0];
    NSString *callback = [command.arguments objectAtIndex:1];

    [_callbacks setObject:callback forKey:notificationName];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(event:) name:notificationName object:nil];
}

-(void)event:(NSNotification *)notification {
    NSString *callback = [_callbacks objectForKey:notification.name];
    NSString *jsExpression = [MyPluginJavaScriptExpression jsExpressionForNotification:notification andCallback:callback];

    [self.webView stringByEvaluatingJavaScriptFromString:jsExpression];
}

@end