import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
import PocCanvas from "../components/PocCanvas";
import { runSequence } from "dd-tool-package";
import { MOCK_STEPS } from "dd-tool-package/mock";
import { AppH1 } from "@/components/AppTypography";
import logo from "./logo.png";
import Image from "next/image";

// TODO: Setup Ganache HERE and not via the package
// Run
const RPC_URL = "https://mainnet.infura.io/v3/5b6375646612417cb32cc467e0ef8724";

export default function Home() {
  async function previewSequence() {
    // We need to run it via context imo
    // TODO: Local Component and grind until done
    const g = await runSequence(MOCK_STEPS, RPC_URL, {
      alwaysFundCaller: true,
    });
    console.log("g", g);
  }

  useEffect(() => {
    previewSequence();
  }, []);

  return (
    <>
      <Head>
        <title>POC Builder</title>
        <meta
          name="description"
          content="Build your proof of concept easily with drag and drop interface"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-[#e0f2fe] min-h-screen flex flex-col items-center">
        <div className="flex gap-2 mt-[50px] mb-[50px] items-center">
          <AppH1>Build Your POC</AppH1>
          <Image src={logo} alt="" width={50} height={30} />
        </div>
        <PocCanvas />
      </main>
    </>
  );
}
