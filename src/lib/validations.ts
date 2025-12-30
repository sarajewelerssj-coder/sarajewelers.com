import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
})

export const OrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(5, "Full address is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
  items: z.array(z.object({
    id: z.union([z.string(), z.number()]).transform(val => val.toString()),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().optional(),
  })).min(1, "Cart cannot be empty"),
  subtotal: z.number().min(0),
  paymentScreenshot: z.string().url("Valid payment screenshot URL is required"),
})

export const MarketingSendSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one recipient is required"),
  subject: z.string().optional(),
  body: z.string().optional(),
  templateId: z.string(),
})
