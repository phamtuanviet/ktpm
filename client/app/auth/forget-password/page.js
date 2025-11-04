"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, sendResetOtp } from "@/redux/features/authSlice";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .nonempty("Email không được để trống"),
});

// Schema for new password
const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must have at least 6 characters"),
    reEnterPassword: z.string(),
  })
  .refine((data) => data.password === data.reEnterPassword, {
    message: "Passwords do not match",
    path: ["reEnterPassword"],
  });
export default function ForgetPasswordForm() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const form = useForm({
    resolver: zodResolver(
      type === "new-password" ? passwordSchema : formSchema
    ),
    defaultValues:
      type === "new-password"
        ? { password: "", reEnterPassword: "" }
        : { email: "" },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const { error, message } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    try {
      if (type !== "new-password") {
        await dispatch(sendResetOtp(values)).unwrap();
        router.push(`/auth/verify?type=reset&email=${values.email}`);
      } else {
        console.log(values.password);
        await dispatch(
          resetPassword({ newPassword: values.password })
        ).unwrap();
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message && !error) {
      toast.success(message);
    }
  }, [error, message]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Quên mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {type === "" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email của bạn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {type === "new-password" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu mới của bạn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {type === "new-password" && (
                <FormField
                  control={form.control}
                  name="reEnterPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Re-enter Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu của bạn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <CardFooter>
                <Button type="submit" className="w-full">
                  {type === "" ? "Gửi OTP" : "Xác nhận"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
