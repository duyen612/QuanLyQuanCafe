export class Reservation {
    id?: number;                
    userId?: number;           
    fullName?: string;          
    phoneNumber?: string;       
    tableId?: number;           
    numberOfGuests: number = 1;
    reservationTime!: Date;     
    note?: string;              
    status?: string;            
    createdAt?: Date;           
  }
  