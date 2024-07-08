export interface ticketDTOS {
    _id: string;
    ticketName: string;
    ticketDate:string;
    status:string;
    name:string;
    eventName:string;
    description:string;
    price:number,
    photo:{
        key:string,
        location:string
    }
}