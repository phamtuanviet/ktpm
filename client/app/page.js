import { Button } from "@/components/ui/button";
import { Bacasime_Antique } from "next/font/google";
import Image from "next/image";
import Header from "./_components/Header";
import Body from "./_components/Body";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="w-full pb-0 mb-0">
      <Header />
      <Body />
      <Footer />
    </div>
  );
}
