import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  type: z.enum(['Payment',"Income","Sale","Purchase","Loan"]).default("Purchase").optional(),
  amount: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  },{
    message:"Amount must be a number greater than 0",
  }),  
  note: z.string().optional(),   
  date: z.string(),  
  tags: z.array(z.object({
    label:z.string(),
    value: z.number()
  })).optional(),
  entityId: z.string().min(1, {message:"Please select entity"}),
  interestRate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  loanMonthsSpan: z.string().optional().nullable(),
  remainingBalance: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['Ongoing','Completed']).optional().default("Ongoing"),
})
