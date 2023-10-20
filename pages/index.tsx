import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect } from 'react';
import PocCanvas from '../components/PocCanvas';
import { runSequence } from 'dd-tool-package';
import { MOCK_STEPS } from 'dd-tool-package/mock';

// TODO: Setup Ganache HERE and not via the package
// Run
const RPC_URL = "https://mainnet.infura.io/v3/5b6375646612417cb32cc467e0ef8724";

export default function Home() {
  async function previewSequence() {
    // We need to run it via context imo
    // TODO: Local Component and grind until done
    const g = await runSequence(MOCK_STEPS, RPC_URL, { alwaysFundCaller: true });
    console.log("g", g);
  }

  useEffect(() => {
    previewSequence();
  }, []);

  return (
    <>
      <Head>
        <title>POC Builder</title>
        <meta name="description" content="Build your proof of concept easily with drag and drop interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1 className={styles.gradientText}>Build Your POC</h1>
        </div>

        <div className={styles.description}>
          <PocCanvas />
        </div>
      </main>

      <style jsx>{`
        .${styles.heading} {
          text-align: center;
          margin-bottom: 20px;
        }

        .${styles.gradientText} {
          background: linear-gradient(to right, #bdc3c7, #2c3e50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2.5em;
          margin: 0;
        }
      `}</style>
    </>
  )
}
