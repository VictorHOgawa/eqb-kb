export interface TicketSlots {
  created_at: Date;
  end_date: Date;
  event_id: string;
  name: string;
  start_date: Date;
  status: string;
  ticket: {
    created_at: Date;
    description: any;
    id: string;
    name: string;
    ticket_slot_id: string;
    user_ticket: any[];
    value: number;
  }[];
}
