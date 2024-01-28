import Breadcrumb from '../components/Breadcrumb';
import TableFour from '../components/TableFour';
import { useEffect, useState } from 'react';

const SFSManager = (props) => {
  const factoryContract = props.factoryContract;
  const [tokens, setTokens] = useState([]);
  const [mytoken, setMytoken] = useState([]); 
  const [userBalance, setUserBalance] = useState(0);
  const [SFSarray, setSFSarray] = useState([]); 

  const sfsdata = async () => {
    const sfs = props.sfsContract;
    setUserBalance(await sfs.balanceOf(props.account));
    const sfsarray = [];
    for(var i=0;i<mytoken.length;i++){
      // mytoken[i] gives the address of the token
      const sfs_id = await sfs.getTokenId(mytoken[i]);
      const sfs_income = await sfs.balances(sfs_id);
      sfsarray.push({ "address": mytoken[i] ,"sfs_id":sfs_id.toString(),"sfs_income":sfs_income.toString()});
    }
    setSFSarray(sfsarray);
  }

  const loadData = async () => { 
    const mytoken = await factoryContract.userData(props.account);
    setMytoken(mytoken); // list of all the user tokens
  };


  useEffect(() => {
    loadData();
  }, []); // Add an empty dependency array to run useEffect only once on component mount

  useEffect(() => {
    sfsdata();
  }, [mytoken]); // Add an empty dependency array to run useEffect only once on component mount
  return ( 
    <>
      <div className="flex flex-col ">
      <Breadcrumb pageName="SFS Manager" />
      <div className='text-title-md py-5'>
        Total Balance : {userBalance.toString()} wei
        </div>
        <TableFour val={SFSarray} total={userBalance} sfs={props.sfsContract} account={props.account} />
      </div>
    </>
  );
};

export default SFSManager;
