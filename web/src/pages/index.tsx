import Head from 'next/head'
import { useState } from 'react'
import { useEnsName } from 'wagmi'

import { useFetch } from '@/hooks/useFetch'

const numberOfRowsToShow = 10

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

    delegateVotesChangeds(orderBy: blockTimestamp, orderDirection: desc) {
      newBalance
      previousBalance
      transactionHash
      delegate
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
    delegateVotesChangeds: {
      newBalance: string
      previousBalance: string
      transactionHash: string
      delegate: string
    }[]
  }
}

// New component
function EnsDataRow({
  change,
  votesChangeds,
}: {
  change: GraphResponse['data']['delegateChangeds'][number]
  votesChangeds: GraphResponse['data']['delegateVotesChangeds']
}) {
  let delegatorEns, fromDelegateEns, toDelegateEns

  if (change.delegator === '0x0000000000000000000000000000000000000000') {
    delegatorEns = { isLoading: false, data: '0x0000' }
  } else {
    delegatorEns = useEnsName({
      address: change.delegator as `0x${string}`,
    })
  }

  if (change.fromDelegate === '0x0000000000000000000000000000000000000000') {
    fromDelegateEns = { isLoading: false, data: '0x0000' }
  } else {
    fromDelegateEns = useEnsName({
      address: change.fromDelegate as `0x${string}`,
    })
  }

  if (change.toDelegate === '0x0000000000000000000000000000000000000000') {
    toDelegateEns = { isLoading: false, data: '0x0000' }
  } else {
    toDelegateEns = useEnsName({
      address: change.toDelegate as `0x${string}`,
    })
  }

  // Find the corresponding votesChanged for the current delegateChanged
  const correspondingVotesChanged = votesChangeds.find(
    (vc) => vc.transactionHash === change.transactionHash
  )

  // Calculate the amount delegated
  const amountDelegated = correspondingVotesChanged
    ? Number(correspondingVotesChanged.newBalance) -
      Number(correspondingVotesChanged.previousBalance)
    : 'N/A' // Default value in case there is no corresponding votesChanged

  const date = new Date(Number(change.blockTimestamp) * 1000)

  return (
    <tr>
      <td>{date.toLocaleString()}</td>
      <td>
        {delegatorEns.isLoading
          ? 'Loading...'
          : delegatorEns.data || change.delegator}
      </td>
      <td>{amountDelegated}</td>
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
  const delegateVotesChangeds = data?.data?.delegateVotesChangeds

  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(10)
  const [inputValue, setInputValue] = useState('10') // start with default value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleButtonClick = () => {
    setNumberOfRowsToShow(Number(inputValue))
  }

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
        <div style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px' }}>
            Enter the number of Txs to display:
          </p>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={handleButtonClick} style={{ padding: '5px' }}>
            Update
          </button>
        </div>

        {delegateChangeds && delegateVotesChangeds && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Delegator</th>
                  <th>Amount delegated</th>
                  <th>From Delegate</th>
                  <th>To Delegate</th>
                  <th>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {delegateChangeds
                  .slice(0, numberOfRowsToShow)
                  .map((change, index) => (
                    <EnsDataRow
                      key={index}
                      change={change}
                      votesChangeds={delegateVotesChangeds}
                    />
                  ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  )
}
