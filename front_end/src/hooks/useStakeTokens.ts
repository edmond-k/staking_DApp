import { useState, useEffect } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"


export const useStakeTokens = (tokenAddress: string) => {
    //items needed to approve
    //address
    //abi
    //chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[chainId]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    //approve
    //stake tokens
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve", { transactionName: "Approve ERC20 transfer" })

    const approveandstake = (amount: string) => {
        setAmounttoStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }

    const {send: stakeSend, state: stakeState} = 
    useContractFunction(tokenFarmContract, "stakeTokens", {transactionName: "Stake Tokens", })

    const [amountToStake, setAmounttoStake] = useState("0")

    useEffect(() => {
        if (approveAndStakeErc20State.status == "Success") {
            stakeSend(amountToStake, tokenAddress)
        }

    }, [approveAndStakeErc20State, amountToStake, tokenAddress])

    /*const [state, setState] = useState(approveAndStakeErc20State)

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            setState(stakeState)
        } else {
            setState(approveAndStakeErc20State)
        }

    }, [approveAndStakeErc20State, stakeState]) */
   
    return { approveandstake, approveAndStakeErc20State, stakeState }

}