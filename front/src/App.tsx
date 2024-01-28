import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import Factory from './contracts/Factory.json';
import Token from './contracts/Token.json';
import MarketPlaceContract from './contracts/Market.json';
import ContractAddress from './contracts/contract-address.json';
import SFS from './contracts/SFS.json';

import Loader from './common/Loader';
import routes from './routes';
import Dashboard from './pages/Dashboard';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [account, setAccount] = useState<string>('');
  const [factoryContract, setFactoryContract] = useState<any>(null);
  const [tokenContract, setTokenContract] = useState<any>(null);
  const [marketplaceContract, setMaretplaceContract] = useState<any>(null);
  const [sfsContract, setSfsContract] = useState<any>(null);

  const web3Handler = async () => {
        // Use Mist/MetaMask's provider
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);
        setAccount(accounts[0]);

        const signer = provider.getSigner();

        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        })
    
        window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0])
          await web3Handler()
        })
        loadContracts(signer)
     
  };
  
  const loadContracts = async (signer) => {
    try {
      // Get deployed copies of contracts
      const factoryContract =  new ethers.Contract( ContractAddress.Factory , Factory.abi, signer)
      setFactoryContract(factoryContract);
      const tokenContract =  new ethers.Contract( ContractAddress.Token , Token.abi, signer)
      setTokenContract(tokenContract);
      const marketplace =  new ethers.Contract( ContractAddress.Marketplace , MarketPlaceContract.abi, signer)
      setMaretplaceContract(marketplace);
      const sfs = new ethers.Contract( "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" , SFS, signer)
      setSfsContract(sfs);
      
    } catch (error) {
      console.error('Error loading contracts:', error);
      // Handle the error (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    web3Handler();
  }, []); // Run once on component mount

  return (
    <>
      <Routes>
        <Route element={<DefaultLayout val={account}/>}>
          {account && <Route index element={<Dashboard {...{
            'factoryContract': factoryContract,
            'account': account,
            'tokenContract': tokenContract,
            'marketplaceContract': marketplaceContract,
            'sfsContract': sfsContract
          }} />} />}
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Suspense fallback={<Loader/>}>
                  <route.component {...{'factoryContract': factoryContract,
            'account': account,
            'marketplaceContract': marketplaceContract,
            'tokenContract': tokenContract,
            'sfsContract': sfsContract
             }}/>
                </Suspense>
              }
              // pass props
              // element={<route.component {...props} />}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
