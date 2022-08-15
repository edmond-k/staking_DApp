from lib2to3.pgen2 import token
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS


from brownie import network, exceptions
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    INITIAL_PRICE_FEED_VALUE,
    get_account,
    get_contract,
)
from scripts.deploy import deploy_token_farm_and_dapp_token
import pytest


def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )
    # Assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )

def test_stake_tokens(amount_staked):
        # Arrange
        if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
            pytest.skip("Only for local testing!")
        account = get_account()
        token_farm, dapp_token = deploy_token_farm_and_dapp_token()
        # Act
        dapp_token.approve(token_farm.address, amount_staked, {"from": account})
        token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
        # Assert
        assert token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
        assert token_farm.uniqueTokensStaked(account.address) == 1
        assert token_farm.stakers(0) == account.address
        return token_farm, dapp_token
        
        

def test_issue_tokens(amount_staked):
     # Arrange
        if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
            pytest.skip("Only for local testing!")
        account = get_account()
        token_farm, dapp_token = test_stake_tokens(amount_staked)
        starting_balance = dapp_token.balanceOf(account.address)
        #Act
        #we are staking 1 dapp_token == in price to 1ETH
        #soo... reward issued should be 2000 dapp tokens
        #since the price of eth is $2,000
        token_farm.issueTokens({"from": account})
        assert dapp_token.balanceOf(account.address) == starting_balance + INITIAL_PRICE_FEED_VALUE
        balance_b4_unstake = starting_balance + INITIAL_PRICE_FEED_VALUE
        return token_farm, dapp_token, balance_b4_unstake

def test_unstake_tokens(amount_staked):
        # Arrange
        if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
            pytest.skip("Only for local testing!")
        account = get_account()
        token_farm, dapp_token, balance_b4_unstake = test_issue_tokens(amount_staked)
        b4_unstake = dapp_token.balanceOf(account.address)
        #Act
        token_farm.unstakeTokens(dapp_token.address, {"from": account})
        assert token_farm.stakingBalance(dapp_token.address, account.address) == 0
        assert dapp_token.balanceOf(account.address) == balance_b4_unstake + amount_staked
        assert dapp_token.balanceOf(account.address) == b4_unstake + amount_staked



