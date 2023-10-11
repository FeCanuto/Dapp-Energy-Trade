// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

interface IERC20 {
  //Quando chamada por um usuário, a função acima retorna o fornecimento total de tokens do contrato.
  function totalSupply() external view returns(uint256);

  //Quando chamada, ela retorna o saldo de tokens dos endereços correspondentes. 
  //Lembre-se, as contas da rede Ethereum são públicas, portanto você pode consultar o saldo de qualquer usuário desde que saiba o endereço.
  function balanceOf(address account) external view returns(uint256);

  //A função transfer transfere tokens de um usuário a outro. Você fornece o valor e o endereço para o qual deseja transferir.
  //Quando chamada, a função transfer executa o que chamamos de event (neste caso, um evento de transferência), 
  //que basicamente diz à blockchain para incluir uma referência a ele no registro.
  function transfer(address to, uint256 quantity) external returns(bool);

  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function allowance(address _owner, address _spender) external view returns (uint256 remaining);

  event Transfer(address from, address to, uint256 value);
  event Approval(address owner, address spender, uint256 value);
}

contract RenewableEnergyToken is IERC20 {

  //Properties
  string public constant name = "RenewableEnergyToken";
  string public constant symbol = "RET";
  uint8 public constant decimals = 2;  //Padrão do Ether é 18
  uint256 private totalsupply;

  mapping(address => uint256) private addressToBalance;

  //Constructor
  constructor() {
    totalsupply = 500000;
    addressToBalance[msg.sender] = totalsupply;
  }

  //Public Functions
  function totalSupply() public override view returns(uint256) {
    return totalsupply;
  }

  function balanceOf(address account) public override view returns(uint256) {
    return addressToBalance[account];
  }

  function transfer(address to, uint256 quantity) public override returns(bool) {
    require(addressToBalance[msg.sender] >= quantity, "Saldo insuficiente para transferir");

    addressToBalance[msg.sender] = addressToBalance[msg.sender] - quantity;
    addressToBalance[to] = addressToBalance[to] + quantity;

    emit Transfer(msg.sender, to, quantity);
    return true;
  }

  // Owner de conta aprova transferência de valor para outra conta
  mapping(address => mapping (address => uint256)) private allowed;

  // Permita que 'spender' saque sua conta, várias vezes, até o valor 'value'.
  function approve(address spender, uint256 value) public override returns (bool) {
    allowed[msg.sender][spender] = value;

    emit Approval(msg.sender, spender, value);
    return true;
  }

  // Envie a quantidade de tokens 'value' do endereço 'to' para endereço 'from'
  function transferFrom(address from, address to, uint value) public override returns (bool) {
    addressToBalance[from] = addressToBalance[from] - value;
    allowed[from][msg.sender] = allowed[from][msg.sender] - value;
    addressToBalance[to] = addressToBalance[to] + value;

    emit Transfer(from, to, value);
    return true;
  }

  function allowance(address owner, address spender) public override view returns (uint256 remaining){
    return allowed[owner][spender];
  }
}