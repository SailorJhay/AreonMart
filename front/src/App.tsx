// @ts-nocheck: Ignore type checking for the entire file

import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import Factory from './contracts/MarketPlaceFactory.json';
import Market from './contracts/MarketPlace.json';
import ContractAddress from './contracts/contract-address.json';

import Loader from './common/Loader';
import routes from './routes';
import Dashboard from './pages/Dashboard';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [account, setAccount] = useState<string>('');
  const [factoryContract, setFactoryContract] = useState<any>(null);
  const [isRegisteredRetailer, setIsRegisteredRetailer] = useState<boolean>(false);
  const [marketContract, setMarketContract] = useState<any>(null);

  const web3Handler = async () => {
    // Use Mist/MetaMask's provider
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setAccount(accounts[0]);

    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])

      await web3Handler()
    })
    loadContracts(signer, accounts[0])

  };

  const loadContracts = async (signer, account) => {
    try {
      // Get deployed copies of contracts
      const factoryContract = new ethers.Contract(ContractAddress.MarketPlaceFactory, Factory.abi, signer)
      setFactoryContract(factoryContract);

      console.log("Factory Contract ", factoryContract)
      console.log("Factory: isRetailer ", factoryContract.isRetailer(account))
      console.log(await factoryContract.isRetailer(account))

      let isRetailer = await factoryContract.isRetailer(account)
      console.log("isRetailer ", isRetailer, isRetailer == false ? "false" : "true")

      if (isRetailer == true) {
        console.log("is retailer", account)
        setIsRegisteredRetailer(true);

        const marketContractAddress = await factoryContract.getRetailerContract(account)
        const marketContract_ = new ethers.Contract(marketContractAddress, Market.abi, signer)
        setMarketContract(marketContract_);

        console.log("marketContractAddress ", marketContractAddress)
      }

    } catch (error) {
      console.error('Error loading contracts:', error);
      // Handle the error (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    web3Handler();
    // retailerContract.addRetailer(account);
    // console.log("retailerContract.getRetailerCount() ", retailerContract.getRetailerCount());
  }, []); // Run once on component mount

  // console.log("account ", account)
  // console.log("factoryContract ", factoryContract)
  // console.log("retailerContract ", retailerContract)
  return (
    <>
      {
        isRegisteredRetailer ?
          (<Routes>
            <Route element={<DefaultLayout val={account} />}>
              {account && <Route index element={<Dashboard {...{
                'factoryContract': factoryContract,
                'account': account,
                'marketContract': marketContract,
              }} />} />}
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <route.component {...{
                        'factoryContract': factoryContract,
                        'account': account,
                        'marketContract': marketContract,

                      }} />
                    </Suspense>
                  }
                // pass props
                // element={<route.component {...props} />}
                />
              ))}
            </Route>
          </Routes>) :
          (
            // Create a button a the center of the page to register as a retailer

            <div className="flex flex-col items-center justify-center h-screen">
              <button
                className="px-8 py-3 font-medium rounded-md
                 text-dark bg-gradient-to-r from-purple-500"
                onClick={async () => {
                  factoryContract.createMarketPlace("R1", "D1").then((res) => {
                    factoryContract.getRetailerContract(account).then((marketContractAddress) => {
                      const marketContract_ = new ethers.Contract(marketContractAddress, Market.abi, signer)
                      setMarketContract(marketContract_);

                      console.log("marketContractAddress ", marketContractAddress)
                    })
                    setIsRegisteredRetailer(true);
                  })
                }}
              >
                Register As Retailer 🏪
              </button>
            </div>
          )
      }
    </>
  );
}

export default App;
