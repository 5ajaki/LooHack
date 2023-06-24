import Head from 'next/head'
import { useEnsName } from 'wagmi'

import { useFetch } from '@/hooks/useFetch'

const endpoint =
  'https://api.studio.thegraph.com/query/48901/loo-hack-fo-ens-token/v0.0.5'

const query = `
  {
    delegateChangeds (orderBy: blockTimestamp, orderDirection: desc) {
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

// New component
function EnsDataRow({
  change,
}: {
  change: GraphResponse['data']['delegateChangeds'][number]
}) {
  const delegatorEns = useEnsName({
    address: change.delegator as `0x${string}`,
  })
  const fromDelegateEns = useEnsName({
    address: change.fromDelegate as `0x${string}`,
  })
  const toDelegateEns = useEnsName({
    address: change.toDelegate as `0x${string}`,
  })

  return (
    <tr>
      <td>
        {delegatorEns.isLoading
          ? 'Loading...'
          : delegatorEns.data || change.delegator}
      </td>
      <td>
        {fromDelegateEns.isLoading
          ? 'Loading...'
          : fromDelegateEns.data || change.fromDelegate}
      </td>
      <td>
        {toDelegateEns.isLoading
          ? 'Loading...'
          : toDelegateEns.data || change.toDelegate}
      </td>
      <td>{change.transactionHash}</td>
      <td>{change.blockTimestamp}</td>
    </tr>
  )
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
        <p>Here are the ENS names for the addresses: </p>

        {delegateChangeds && (
          <>
            <p>My data loaded yay!</p>
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
                  <EnsDataRow key={index} change={change} />
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  )
}
