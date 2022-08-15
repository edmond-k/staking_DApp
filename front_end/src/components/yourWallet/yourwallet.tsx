import { Box } from "@material-ui/core"
import {Token} from "../Main"
import React, {useState} from "react"
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {Tab, makeStyles} from "@material-ui/core"
import {WalletBalance} from "./WalletBalance"
import { StakeForm } from "./StakeForm"
import { ThemeContext } from "@emotion/react";

interface YourWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabcontent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))

export const YourWallet = ({supportedTokens}: YourWalletProps) => {

    const classes = useStyles()

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
    <Box>
        <h1 className={classes.header}>Your Wallet!</h1>
        <Box className={classes.box}>
            <TabContext value={selectedTokenIndex.toString()}>
                <TabList onChange={handleChange} aria-label="stake form tabs">
                    {supportedTokens.map((token, index) => {
                        return (
                            <Tab label={token.name}
                            value={index.toString()}
                            key={index}/>
                        )
                    })}
                </TabList>
                {supportedTokens.map((token, index) => {
                    return (
                        <TabPanel value={index.toString()} key={index}>
                            <div className={classes.tabcontent}>
                                <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                <StakeForm token={supportedTokens[selectedTokenIndex]}/>
                            </div>
                        </TabPanel>
                    )
                })}
            </TabContext>
        </Box>
    </Box>
    )
}