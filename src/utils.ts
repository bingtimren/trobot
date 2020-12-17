/**
 * Returns a decorator for decorating a class method, by replacing the method function with
 * a wrapper, which calls a function methodWrapper (provided in first parameter)
 * 
 * The function methodWrapper's signature is:
 * ```
 * (thisArg:TargetType , originalMethod:MethodFuncType, ...args:Parameters<MethodFuncType>)=>ReturnType<MethodFuncType>
 * ```
 * thisArg - the 'this' instance at time of the method invocation
 * originalMethod - the original function of the method
 * ...args - arguments at time of the method invocation
 * 
 * The function methodWrapper should perform some additional work, and can:
 * - returns some result of the same return type of the original method
 * - throws an Error
 * - invokes the original function of the method, and return the results
 * 
 * To act as the original function of the method as if nothing is changed, use this code:
 * ```
 *      return originalMethod.apply(thisArg,args);
 * ```
 * 
 * @param methodWrapper 
 */
export function methodWrapperDecorator<TargetType, MethodFuncType extends (...args:never[])=>unknown>(
    methodWrapper:(thisArg:TargetType , originalMethod:MethodFuncType, ...args:Parameters<MethodFuncType>)=>ReturnType<MethodFuncType>
){
    return function(
        target: TargetType,
        propertyKey: keyof TargetType,
        descriptor: PropertyDescriptor
    ):PropertyDescriptor {
        const originalMethod = target[propertyKey] as unknown as MethodFuncType;
        return Object.assign({}, descriptor,{
            value: function(...args:Parameters<MethodFuncType>){
                return methodWrapper(this as unknown as TargetType, originalMethod, ...args)
            }
        })

    }
}
    