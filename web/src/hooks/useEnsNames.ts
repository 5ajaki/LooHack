// import { ENS } from '@ensdomains/ensjs'
// import { useEffect, useState } from 'react'

// import { jsonProvider } from '../providers'
// import { breakIntoChunks, truncateAddress } from '../utils'

// const ENSInstance = new ENS()

// export function useEnsNames(addresses?: string[]) {
//   const [names, setNames] = useState<string[]>([])
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   useEffect(() => {
//     async function fetchEnsNames() {
//       if (!addresses || addresses.length === 0) return
//       await ENSInstance.setProvider(jsonProvider)
//       setIsLoading(true)

//       const batches = breakIntoChunks(150, addresses)

//       const results = []
//       for (const batch of batches) {
//         const batched = await ENSInstance.batch(
//           ...batch.map((address) => ENSInstance.getName.batch(address))
//         )

//         if (!batched) {
//           results.push(batch.map(() => undefined))
//           continue
//         }

//         results.push(batched)
//       }

//       const flattened = results.flat()
//       const names = flattened.map(
//         (name, i) => name?.name || truncateAddress(addresses[i])
//       )
//       setNames(names)
//       setIsLoading(false)
//     }

//     fetchEnsNames()

//     return () => {
//       setNames([])
//       setIsLoading(false)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [addresses])

//   return { names, isLoading }
// }
