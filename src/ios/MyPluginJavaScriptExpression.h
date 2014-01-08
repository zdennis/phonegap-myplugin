#import <Foundation/Foundation.h>
#import <GeLoSDK/GeLoSDK.h>

@interface MyPluginJavaScriptExpression : NSObject

+(NSString *) jsExpressionForNotification:(NSNotification *) notification
              andCallback:(NSString *) callback;
+(NSString *) javascriptForGeLoBeacon:(GeLoBeacon *)beacon;

@property (readonly) NSNotification *notification;
@property (readonly) NSString *callback;
@property (readonly) GeLoBeacon *beacon;

-(id) initWithNotification:(NSNotification *) notification 
      andCallback:(NSString *) callback;
-(id) initWithGeLoBeacon:(GeLoBeacon *) beacon;

-(NSString *) jsExpression;
-(NSString *) javaScriptForBeacon:(GeLoBeacon *)beacon;

@end
