export interface patient
{
    name:string  //姓名
    address:string  //地址
    checkType:string //  混/单管
    quarantine:boolean// 是否隔离
    needSecond:boolean// 是否需二采
    secondResult?:string// 二采结果
}

export interface streetQuery
{
    positive:number//老阳人数
    waiting:number//待转运人数
    abnormal:number//核酸异常人数
    abnormalList:patient[] //核酸异常明细

}

// export interface streetQuery
// {
//     positive:patient[]//老阳人数
//     waiting:patient[]//待转运人数
//     abnormal:patient[]//核酸异常人数
// }
