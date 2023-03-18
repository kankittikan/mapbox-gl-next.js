import Head from 'next/head'
import Image from 'next/image'
import { Inter, Margarine } from 'next/font/google'
import Map from "./map"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Test Mapbox</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Map/>
    </>
  )
}
