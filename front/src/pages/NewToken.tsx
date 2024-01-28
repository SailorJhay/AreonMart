import Breadcrumb from '../components/Breadcrumb';
import fireToast from '../hooks/fireToast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const NewToken = (props) => {
  const factoryContract = props["factoryContract"];
  const [tokenName, setTokenName] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenSupply, setTokenSupply] = useState();

  const mintToken = async (e) => {
    e.preventDefault();

    try {
      // Ensure the factoryContract is available
      if (!factoryContract) {
        throw new Error('Factory contract not available');
      }

      // Call the deployToken function with user-provided parameters
      const tx = await factoryContract.deployToken(tokenName, tokenSymbol, tokenSupply);
      const receipt = await tx.wait();

      // Check the transaction receipt for success or failure
      if (receipt.status === 1) {
        alert('Token Minted Successfully!');
        // You can perform additional actions upon successful minting, if needed
      } else {
        alert('Token Minting Failed');
      }
    } catch (error) {
      console.error('Error minting token:', error);
      alert('Error Minting Token');
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        
        <Breadcrumb pageName="New Areon" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                🚀 Areon Generator
                </h3>
              </div>
              
              <div className="p-7">
                <form action="#">

              <div className="mb-5.5 gap-5.5">
                <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName">
                  Token Standard
                </label>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                    <option value="">ERC20</option>
                    {/* <option value="">ERC 721 (NFT)</option>
                    <option value="">ERC 1151</option> */}
                  </select>
                  </div>
              </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Token Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="Name"
                          id="Name"
                          placeholder="MyToken"
                          onChange={(e) => setTokenName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Token Symbol
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="Symbol"
                        id="symbol"
                        placeholder="Symbol"
                        onChange={(e) => setTokenSymbol(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="number"
                    >
                      Initial Supply
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="supply"
                        id="supply"
                        placeholder="10000"
                        onChange={(e) => setTokenSupply(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Reset
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                      onClick={mintToken}
                    >
                      Mint
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                🗿 ChadPod : never gonna give you up
                </h3>
              </div>
              <div className="p-7">
              😯 Create your own Token on the Mode sidechain <Link to={"https://www.mode.network/"}>(🔗know more)</Link> easily without any coding hassles.
               <br/><br/>
               😍 Mode has implemented Optimism's Bedrock upgrade which has significantly reduced the fees to be over 95% less than Ethereum. 
                <br/><br/>
               🤑 You will earn a share of the network Sequencer fees whenever your token is used in a transaction. <Link to={"https://docs.mode.network/explanation/sequencer-fee-sharing"}>(🔗know more)</Link>
               <br/><br/>
               ✳️ SFS registration NFT will be minted automatically to your address.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewToken;
