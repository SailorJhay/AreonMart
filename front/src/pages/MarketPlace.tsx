import Breadcrumb from '../components/Breadcrumb';
import TableThree from '../components/TableThree';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const MarketPlace = (props) => {
  const factoryContract = props.factoryContract;
  const [tokens, setTokens] = useState([]);
  const [mytoken, setMytoken] = useState([]);

  const [newTokenPrice, setNewTokenPrice] = useState(0);
  const [newTokenSupply, setNewTokenSupply] = useState(0);
  const [newTokenType, setNewTokenType] = useState('Currency / Store of Value');
  const [newTokenAddress, setNewTokenAddress] = useState();
  const [newTokenDesc, setNewTokenDesc] = useState('');


  const listToken = async () => {
    if(!newTokenAddress || newTokenAddress === '') {
      alert("Please select a token to list")
      return
    }
    const token = await props.tokenContract.attach(newTokenAddress);
    const name =  token.name();
    const symbol =  token.symbol();
    const marketplace = props.marketplaceContract;
    
    try {
      await token.approve(marketplace.address, newTokenSupply);
    }
    catch (error) {
      console.error('Error approving token:', error);
    }

    try {
      await marketplace.listToken(
        newTokenAddress,
        newTokenSupply,
        newTokenPrice,
        newTokenType,
        newTokenDesc,
        name,
        symbol
      );
    } catch (error) {
      console.error('Error listing token:', error);
    }
  };

  const loadData = async () => { // for mint token form
    const mytoken = await factoryContract.userData(props.account);
    setMytoken(mytoken);
  };

  const marketData = async () => { // for listed tokens table
    const marketplace = props.marketplaceContract;
    const count = await marketplace.count();
    let tokenarray = [];
    for(let i=1 ; i<=count ; i++) {
      const token = await marketplace.tokens(i);
      tokenarray.push(token);
    }
    setTokens(tokenarray);
    console.log("tokens to show at market ", tokens)
  }

  useEffect(() => {
    loadData();
    marketData();
  }, []); // Add an empty dependency array to run useEffect only once on component mount

  const handleSubmit = (e) => {
    e.preventDefault();
    listToken();
  };

  return ( 
    <>
      <Breadcrumb pageName="List Tokens" />
      
      <div className="p-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Number of Tokens to List
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="number"
                          id="number"
                          placeholder="Tokens to List"
                          onChange={(e) => setNewTokenSupply(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Price per Token
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="Price"
                        id="price"
                        placeholder="Price"
                        onChange={(e) => setNewTokenPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Token To List
                      </label>
                      <div className="relative">
                      <select onChange={(e) => setNewTokenAddress(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                            <option value="">Select Token</option>
                            { mytoken.map((token,_index) => {
                              return <option value={token}>{token}</option>
                            }
                            )}
                         </select>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Token Type (what does the token represent?)
                      </label>
                      <select onChange={(e) => setNewTokenType(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                            <option value="Currency / Store of Value">💱 Currency / Store of Value</option>
                            <option value="Real Estate">🏠 Real Estate</option>
                            <option value="Company Equity">🏢 Company Equity</option>
                            <option value="Reservation Tickets">🎫 Reservation Tickets</option>
                            <option value="Precious Metal Ownership">🪙 Precious Metal Ownership</option>
                            <option value="Membership">👥 Membership</option>
                            <option value="Art">🎨 Art</option>
                            <option value="Other Asset Ownership">🌐 Other Asset Ownership</option>
                            <option value="Others">💼 Others</option>
                         </select>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Listing Description
                      </label>
                      <textarea onChange={(e) => setNewTokenDesc(e.target.value)}
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="desc"
                        id="desc"
                        placeholder="Anthing you want to say about your token to buyers"
                      />
                    </div>

                  <div className="flex justify-end gap-4.5">
                    <button onClick={handleSubmit}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                    >
                      List
                    </button>
                  </div>
                  </div>
                  <br/>

      <div className="flex flex-col ">
      <Breadcrumb pageName="Listed Tokens" />
        <TableThree val={tokens} marketplaceContract={props.marketplaceContract}/>
      </div>
    </>
  );
};

export default MarketPlace;
