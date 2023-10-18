// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EnergyTrade {
    IERC20 private _token;
    address public owner;
    address[] public prosumer;
    uint256 public prosumerCount;
    mapping(address => Prosumer) addressToProsumer;

    struct Prosumer {
        address prosumerAddress;
        uint16 uc; //Unidade consumidora
        uint16 energiaConsumida; //Energia consumida em Kwh
        uint16 energiaInjetada; //Energia injetada em Kwh
    }

    constructor(IERC20 token) {
        owner = msg.sender;
        _token = token;
    }

    //São trechos de códigos que serão executados antes das funções.
    //Uma das aplicações mais conhecidas é a de controle de acesso
    //para que somente endereços específicos possam executar uma função
    modifier isOwner() {
        require(msg.sender == owner, "Remetente invalido!");
        _;
    }

    function setProsumer(
        address endereco,
        uint16 unidadeConsumidora,
        uint16 consumida,
        uint16 injetada
    ) public isOwner {
        if (addressToProsumer[endereco].uc != unidadeConsumidora) {
            Prosumer memory newprosumer = Prosumer({
                prosumerAddress: endereco,
                uc: unidadeConsumidora,
                energiaConsumida: consumida,
                energiaInjetada: injetada
            });

            addressToProsumer[endereco] = newprosumer;
            prosumer.push(endereco);
            prosumerCount++;
        } else {
            addressToProsumer[endereco].prosumerAddress = endereco;
            addressToProsumer[endereco].uc = unidadeConsumidora;
            addressToProsumer[endereco].energiaConsumida = consumida;
            addressToProsumer[endereco].energiaInjetada = injetada;
        }
    }

    function getProsumerArr() public view returns (Prosumer[] memory) {
        Prosumer[] memory result = new Prosumer[](prosumerCount);
        for (uint256 i = 0; i < prosumerCount; i++) {
            result[i] = addressToProsumer[prosumer[i]];
        }

        return result;
    }

    function payProsumerOwner(address endereco) public isOwner {
        require(
            addressToProsumer[endereco].energiaInjetada >
                addressToProsumer[endereco].energiaConsumida,
            "Energia consumida maior que a injetada"
        );
        address from = msg.sender;

        uint256 value = addressToProsumer[endereco].energiaInjetada -
            addressToProsumer[endereco].energiaConsumida;

        _token.transferFrom(from, endereco, value);
    }

    function info() public view returns (uint256) {
        return _token.totalSupply();
    }
}
