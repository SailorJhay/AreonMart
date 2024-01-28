import { useEffect } from 'react';
import CardFour from '../components/CardFour.tsx';
import CardOne from '../components/CardOne.tsx';
import CardThree from '../components/CardThree.tsx';
import CardTwo from '../components/CardTwo.tsx';
import TableOne from '../components/TableOne.tsx';
import { useState } from 'react';

const Dashboard = (props) => {
  const [mytokenCount, setMytokenCount] = useState(0);
  const [listedTokens, setListedTokens] = useState();
  const [mytoken, setMytoken] = useState([]);
  const [mytokenData, setMytokenData] = useState([]);
  const [marketRevenue, setMarketRevenue] = useState(0);
  const [sfsBalance, setSfsBalance] = useState(0);

  const sfsData = async () => {
    const sfs = props.sfsContract;
    console.log("sfs ", sfs)
    try {
      const sfs_balance = await sfs.balanceOf(props.account);
      setSfsBalance(sfs_balance.toString());
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  }

  const dataProcess = async () => {
    const tokenDataArray = [];

    for (const token of mytoken) {
      try {
        const deployedToken = props.tokenContract.attach(token);
        console.log("deployedToken ", deployedToken)
        const tokenDetails = {
          address: token,
          name: await deployedToken.name(),
          symbol: await deployedToken.symbol(),
          totalSupply: (await deployedToken.totalSupply()).toString(),
          balance: (await deployedToken.balanceOf(props.account)).toString(),
        };
        console.log(tokenDetails)
        tokenDataArray.push(tokenDetails);
      } catch (error) {
        console.error(`Error processing token ${token}:`, error);
      }
    }

    setMytokenData(tokenDataArray);
    console.log("all tokens data ", tokenDataArray);
  };

  const loadContracts = async () => {
    const factoryContract = props.factoryContract;

    try {
      const mytoken = await factoryContract.userData(props.account);
      setMytoken(mytoken);
      setMytokenCount(mytoken.length);
      // No need to call dataProcess here, as useEffect will handle it after the state updates
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const marketplaceData = async () => {
    const marketplace = props.marketplaceContract;
    try {
      const market_tokens = await marketplace.getUserTokens(props.account);
      console.log("market tokens ", market_tokens)
      setListedTokens(market_tokens.length);
      let revenue = 0;
      // for (const token of tokens) {
      //   revenue += token.revenue;
      // }
      setMarketRevenue(revenue);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  }

  useEffect(() => {
    loadContracts();
    marketplaceData();
    sfsData();
  }, []); // Run once on component mount

  useEffect(() => {
    // Trigger data processing when mytoken changes
    dataProcess();
  }, [mytoken]);



  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne val = {mytokenCount}/>
        <CardTwo val= {listedTokens}/>
        <CardThree val={sfsBalance} />
        <CardFour val = {marketRevenue}/>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <TableOne val={mytokenData}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
