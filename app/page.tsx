"use client";
import { Footer } from "@/app/components/footer";
import { Logo } from "@/app/components/logo";
import { PresetQuery } from "@/app/components/preset-query";
import { Search } from "@/app/components/search";
import React from "react";

export default function Home() {
  return (
    <div className="absolute inset-0 min-h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col gap-8 px-4 -mt-24">
        <h1 className="text-4xl text-center">Bobtail.DEV</h1>
        <Search></Search>
        <div className="flex gap-2 flex-wrap justify-center">
          <PresetQuery query="How to create a link with query params using React router?"></PresetQuery>
          <PresetQuery query="How to add a layer on top of HuggingFace model in PyTorch?"></PresetQuery>
          <PresetQuery query="How does DPO work, how is it different with PPO?"></PresetQuery>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
