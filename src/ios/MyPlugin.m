#import "MyPlugin.h"
#import "MyPluginJavaScriptExpression.h"
#import <GeLoSDK/GeLoSoftwareBeaconManager.h>
#import <GeLoSDK/GeLoSDK.h>


@implementation MyPlugin

-(void)on:(CDVInvokedUrlCommand*)command;
{
    if (!_callbacks)
        _callbacks = [NSMutableDictionary dictionary];

    if (!_constants) {
        NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"MyPluginConstants" ofType:@"plist"];
        _constants = [NSMutableDictionary dictionary];
        _constants = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    }
    
    NSString *arg = [command.arguments objectAtIndex:0];
    NSString *callback = [command.arguments objectAtIndex:1];

    [_callbacks setObject:callback forKey:arg];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(event:) name:arg object:nil];
    [[GeLoBeaconManager sharedInstance] startScanningForBeacons];
}

-(void)event:(NSNotification *)notification {
    NSString *callback = [_callbacks objectForKey:notification.name];
    NSString *jsExpression = [MyPluginJavaScriptExpression jsExpressionForNotification:notification andCallback:callback];

    [self.webView stringByEvaluatingJavaScriptFromString:jsExpression];
}

@end
