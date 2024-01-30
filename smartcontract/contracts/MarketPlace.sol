// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is Ownable{

    // Product
    struct Product {
        string name;
        uint price;
        uint quantity;
        string ipfsLink;
        uint sold;
    }

    Product[] public products;
    string public marketPlaceName; 
    string public marketPlaceDescription;

    constructor(string memory _name, string memory _description) Ownable(msg.sender) {
        marketPlaceName = _name;
        marketPlaceDescription = _description;
    }

    event ProductAdded(string name, uint price, uint quantity, string ipfsLink);

    function addProduct(string memory _name, uint _price, uint _quantity, string memory _ipfsLink) public {
        require(bytes(_name).length > 0, "Name required");
        require(_price > 0, "Price required");
        require(_quantity > 0, "Quantity required");
        require(bytes(_ipfsLink).length > 0, "IPFS Link required");

        products.push(Product( _name, _price, _quantity, _ipfsLink, 0));
        emit ProductAdded( _name, _price, _quantity, _ipfsLink);
    }

    function getProducts() public view returns (Product[] memory) {
        return products;
    }

    function deleteProduct(uint _id) public {
        require(_id > 0 && _id <= products.length, "Invalid product id");

        products[_id] = products[products.length-1];
        products.pop();
    }

    function editProduct(uint _id, string memory _name, uint _price, uint _quantity, string memory _ipfsLink) public {
        require(_id > 0 && _id <= products.length, "Invalid product id");
        require(bytes(_name).length > 0, "Name required");
        require(_price > 0, "Price required");
        require(_quantity > 0, "Quantity required");
        require(bytes(_ipfsLink).length > 0, "IPFS Link required");

        products[_id].name = _name;
        products[_id].price = _price;
        products[_id].quantity = _quantity;
        products[_id].ipfsLink = _ipfsLink;
    }

    // function buyProduct(uint _id) public payable {
    //     require(_id > 0 && _id <= products.length, "Invalid product id");
    //     require(products[_id].quantity > 0, "Product out of stock");
    //     require(msg.value >= products[_id].price, "Insufficient funds");

    //     products[_id].quantity--;
    //     products[_id].sold++;
       
    //    // transfer the product price to the owner
    //     payable(owner()).transfer(products[_id].price);

    //     // mint the NFT to the buyer
    

    // } 

}

