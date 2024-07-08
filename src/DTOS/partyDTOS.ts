export interface partyDTO {
    _id: string;
    name: string;
    age: string
    city: {
        name: string
        state: string
    };
    genre: string;
    date: {
        date: Date,
        time: string
    },
    openTime?: any,
    address: string,
    local: string
    photo: {
        location: string,
        key: string
    }
    category: {
        photo: string,
        name: string
    }
    gift: boolean
    tax: boolean
    sell: boolean
    sellLink: string
    partners:[]
    instagram:string
    whatsapp:string
    googleLink:string
    product:boolean
    buttonTitle:string
    description:string
    localPhoto:[{
        location: string,
        key: string
    }]
    score:{
        score:number,
    },
    clientPhoto:any
    schedule:any
}