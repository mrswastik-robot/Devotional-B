

import {z} from 'zod';

export const EventType = z.object({
    // id: z.string(),
    title: z.string().min(5,{message: 'Title must be at least 5 characters long'}),
    description: z.string().optional(),
    eventImageURL: z.string().optional(),
    dateOfEvent: z.date({
        required_error: 'Date of event is required',
    }),
    locationOfEvent: z.string(),
    durationOfEvent: z.number().min(1).max(24),
    registrationLink: z.string(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    // profilePic: z.string(),
    // postImage: z.string(),
    // likes: z.number(),
    // comments: z.number(),
    // shares: z.number(),
});