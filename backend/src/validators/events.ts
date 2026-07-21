import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    data: z.object({
      title: z.string().min(1),
      category: z.string(),
      locationType: z.string(),
      location: z.string(),
      locationCoordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }).nullable().optional(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      coverImage: z.string().optional(),
      votingEndDate: z.string().optional(),
      ticketTiers: z.array(z.any()),
      votingCategories: z.array(z.any()),
    }),
    status: z.string(),
    organizerEmail: z.string().email(),
    organizerName: z.string(),
    votePrice: z.number().optional(),
  }),
});

export const purchaseTicketSchema = z.object({
  body: z.object({
    eventId: z.string().min(1),
    tierId: z.string().min(1),
    qty: z.number().min(1),
    attendeeNames: z.array(z.string()).optional(),
  }),
});

export const castVoteSchema = z.object({
  body: z.object({
    eventId: z.string().min(1),
    categoryId: z.string().min(1),
    nomineeId: z.string().min(1),
    qty: z.number().min(1),
    voterId: z.string().min(1),
  }),
});

export const broadcastSchema = z.object({
  body: z.object({
    eventId: z.string().min(1),
    subject: z.string().min(1),
    message: z.string().min(1),
    targetAudience: z.string(),
  }),
});
