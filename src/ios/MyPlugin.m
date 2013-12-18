#import "MyPlugin.h"
#import <GeLoSDK/GeLoSoftwareBeaconManager.h>
#import <GeLoSDK/GeLoSDK.h>


@implementation MyPlugin

-(void)on:(CDVInvokedUrlCommand*)command;
{
    if (!_callbackDictionary)
        _callbackDictionary = [NSMutableDictionary dictionary];

    NSString *arg = [command.arguments objectAtIndex:0];
    NSString *callback = [command.arguments objectAtIndex:1];

    [_callbackDictionary setObject:callback forKey:arg];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(nearestBeaconChanged:) name:arg object:nil];
    [[GeLoBeaconManager sharedInstance] startScanningForBeacons];
}

-(void)nearestBeaconChanged:(NSNotification *)notification {
    GeLoBeacon *beacon = notification.userInfo[@"beacon"];
    NSError *error;
    NSData *beaconJson = [NSJSONSerialization dataWithJSONObject:[beacon dictionary] options:NSJSONWritingPrettyPrinted error:&error];
    if (!beaconJson) {
        NSLog(@"%@", error);
    }else{
        NSString *jsonBeaconString = [[NSString alloc] initWithData:beaconJson encoding:NSUTF8StringEncoding];
        NSString *callback = [_callbackDictionary objectForKey:notification.name];
        NSString *jsCallBack = [NSString stringWithFormat:@"%@(%@);", callback,jsonBeaconString];
        [self.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
    }
}

@end