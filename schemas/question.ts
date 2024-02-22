
import {z} from 'zod';

export const QuestionType = z.object({
    // id: z.string(),
    title: z.string().min(5,{message: 'Title must be at least 5 characters long'}),
    description: z.string().min(10,{message: 'Description must be at least 10 characters long'}),
    questionImageURL: z.string().optional(),
    // createdAt: z.string(),
    // updatedAt: z.string(),
    // profilePic: z.string(),
    // postImage: z.string(),
    // likes: z.number(),
    // comments: z.number(),
    // shares: z.number(),
});