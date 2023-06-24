import Head from 'next/head'
import { useEnsName } from 'wagmi'

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
      blockTimestamp
      blockNumber
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
      blockTimestamp: string
      blockNumber: string
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

  // create an array of addresses from delegateChangeds.delegator
  const delegators = delegateChangeds?.map((change) => change.delegator)
  const fromDelegates = delegateChangeds?.map((change) => change.fromDelegate)
  const toDelegates = delegateChangeds?.map((change) => change.toDelegate)

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
        <p>here is the ENS name for the first address: </p>

        {delegateChangeds && (
          <>
            <p>my data loaded yay!</p>
            <table>
              <thead>
                <tr>
                  <th>Delegator</th>
                  <th>From Delegate</th>
                  <th>To Delegate</th>
                  <th>Transaction Hash</th>
                  <th>Block Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {delegateChangeds.slice(0, 5).map((change, index) => (
                  <tr key={index}>
                    <td>
                      {/* useEnsName on this */}
                      {change.delegator}
                    </td>
                    <td>{change.fromDelegate}</td>
                    <td>{change.toDelegate}</td>
                    <td>{change.transactionHash}</td>
                    <td>{change.blockTimestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  )
}
