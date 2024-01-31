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
  const [myMarketAddress, setMyMarketAddress] = useState<string>('');

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

      let isRetailer = await factoryContract.isRetailer(account)

      if (isRetailer == true) {
        setIsRegisteredRetailer(true);

        const marketContractAddress = await factoryContract.getRetailerContract(account)
        const marketContract_ = new ethers.Contract(marketContractAddress, Market.abi, signer)
        setMarketContract(marketContract_);
        setMyMarketAddress(marketContractAddress);
      }

    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  useEffect(() => {
    web3Handler();
  }, []); // Run once on component mount

  return (
    <>
      {
        isRegisteredRetailer ?
          (<Routes>
            <Route element={<DefaultLayout val={account} market={myMarketAddress} />}>
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
                />
              ))}
            </Route>
          </Routes>) :
          (
            <div className="flex flex-col items-center justify-center h-screen">
              <button
                className="px-8 py-3 font-medium rounded-md
                 text-dark bg-gradient-to-r from-purple-500"
                onClick={async () => {
                  factoryContract.createMarketPlace("R1", "D1").then((res) => {
                    factoryContract.getRetailerContract(account).then((marketContractAddress) => {
                      const marketContract_ = new ethers.Contract(marketContractAddress, Market.abi, signer)
                      setMarketContract(marketContract_);
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
