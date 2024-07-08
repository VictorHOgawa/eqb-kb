export interface productDTOS {
    _id: string;
    name:string;
    productName: string;
    status:string;
    photo: {
        location:string,
        key:string
    }; 
    description:string;
    price:number;
}