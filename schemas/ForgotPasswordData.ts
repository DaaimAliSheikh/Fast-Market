import { z } from "zod";
const ForgotPasswordDataSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});
type ForgotPasswordDataType = z.infer<typeof ForgotPasswordDataSchema>;

export { ForgotPasswordDataSchema, ForgotPasswordDataType };
