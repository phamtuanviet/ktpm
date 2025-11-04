"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import { verifyEmail, verifyResetOtp } from "@/redux/features/authSlice";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 characters")
    .max(6, "OTP must be 6 characters"),
});

export default function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const type = searchParams.get("type") || "verify-email";
  const email = searchParams.get("email") || "";

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(otpSchema),
  });

  const { user, isLoading, error, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (data) => {
    if (type === "verify-email") {
      dispatch(verifyEmail({ id: user.id, otp: data.otp }));
    } else if (type === "reset") {
      dispatch(verifyResetOtp({ email, otp: data.otp }));
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("OTP verified successfully!");
      // Chuyển hướng tùy thuộc vào luồng
      if (type === "verify-email") {
        router.push("/"); // ví dụ: sau OTP đăng ký chuyển về trang chủ
      } else if (type === "reset") {
        router.push("/auth/forget-password?type=new-password"); // chuyển đến trang reset mật khẩu
      }
    }
  }, [isAuthenticated, router, type]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message && !error) {
      toast.success(message);
    }
  }, [error, message]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
          <CardTitle className="text-center text-2xl font-bold text-white">
            Verify OTP
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">OTP</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} className="mt-2">
                        <InputOTPGroup className="flex justify-between space-x-2">
                          <InputOTPSlot
                            index={0}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                          <InputOTPSlot
                            index={1}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                          <InputOTPSlot
                            index={2}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                          <InputOTPSlot
                            index={3}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                          <InputOTPSlot
                            index={4}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                          <InputOTPSlot
                            index={5}
                            className="border border-gray-300 rounded-md p-2 w-10 text-center focus:ring-2 focus:ring-indigo-500"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="mt-1 text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white rounded-md transition duration-200"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-gray-100 p-4 text-center text-sm text-gray-600">
          Please check your email for the OTP code.
        </CardFooter>
      </Card>
    </div>
  );
}
