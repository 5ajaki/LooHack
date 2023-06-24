import Head from 'next/head'

import { useFetch } from '@/hooks/useFetch'

const endpoint =
  'https://api.studio.thegraph.com/query/48901/loo-hack-fo-ens-token/v0.0.5'

const query = `
  {
    delegateChangeds {
      id
      delegator
      fromDelegate
      toDelegate
      transactionHash
    }
  }
`

type GraphResponse = {
  data: {
    delegateChangeds: {
      id: string
      delegator: string
      fromDelegate: string
      toDelegate: string
      transactionHash: string
    }[]
  }
}

export default function Home() {
  const { data, error } = useFetch<GraphResponse>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const delegateChangeds = data?.data?.delegateChangeds

  return (
    <>
      <Head>
        <title>ENS Token Delegation Changes</title>
        <meta name="description" content="" />

        <meta property="og:image" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>

      <main>
        <p>hello world</p>

        {delegateChangeds && (
          <>
            <p>my data loaded yay!</p>
            {JSON.stringify(delegateChangeds[0])}
          </>
        )}
      </main>
    </>
  )
}
