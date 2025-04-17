export interface configImagePropModel
{
    ComName:string
    Attributes:Array<configImagePropModelAttribute>
}

export interface configImagePropModelAttribute
{
    index:number
    path:string
}


export interface exportImageListModel
{
    comId:string
    attrIndex:number
    fromInternet:boolean
    imageId:string | null
    imageUrl:string | null
    newId:string | null
}
