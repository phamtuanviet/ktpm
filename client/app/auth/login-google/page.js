"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authenticateWithGoogle } from "@/redux/features/authSlice";

export default function LoginSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const userJson = params.get("user");

      if (!accessToken || !userJson) {
        router.push("/auth");
        return;
      }

      try {
        const user = JSON.parse(decodeURIComponent(userJson));

        localStorage.setItem("accessToken", accessToken);

        const resultAction = await dispatch(authenticateWithGoogle({ user }));

        if (authenticateWithGoogle.fulfilled.match(resultAction)) {
          router.push("/");
        } else {
          localStorage.removeItem("accessToken");
          router.push("/auth");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        router.push("/auth");
      }
    };

    handleGoogleLogin();
  }, [dispatch, router]);

  return <div>Đang đăng nhập, chờ chút...</div>;
}
