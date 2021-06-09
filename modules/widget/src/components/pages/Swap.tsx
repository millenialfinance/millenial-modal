import React, { FC, useEffect, useState } from "react";
import { ChainDetail, TransferQuote, truncate } from "@connext/vector-sdk";
import { getConfirmationsForChain } from "@connext/vector-types";

import { ModalContent, ModalBody, Text, Stack, Button, InputGroup, Input } from "../common";
import { Header, Footer, NetworkBar } from "../static";

export interface TransferProps {
  onUserInput: (_input: string | undefined, receiveExactAmount: boolean) => Promise<TransferQuote | undefined>;
  swapRequest: () => void;
  options: () => void;
  isLoad: boolean;
  inputReadOnly: boolean;
  senderChainInfo: ChainDetail;
  receiverChainInfo: ChainDetail;
  receiverAddress: string;
  senderAmount: string | undefined;
  vaultName: string;
  recipientAmount: string | undefined;
  feeQuote: string | undefined;
  swapRate: string | undefined;
  existingChannelBalance?: string;
  amountError?: string;
  userAddress?: string;
  userBalance?: string;
}

const Swap: FC<TransferProps> = props => {
  const {
    amountError,
    vaultName,
    userBalance,
    userAddress,
    senderChainInfo,
    receiverChainInfo,
    receiverAddress,
    senderAmount,
    recipientAmount,
    existingChannelBalance,
    feeQuote,
    swapRate,
    isLoad,
    inputReadOnly,
    onUserInput,
    swapRequest,
    options,
  } = props;

  const [check, setCheck] = useState<boolean>(userAddress ? (receiverAddress !== userAddress ? false : true) : true);

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

  const enforcer = (currentInput: string, receiveExactAmount: boolean) => {
    if (currentInput === "" || inputRegex.test(escapeRegExp(currentInput))) {
      onUserInput(currentInput, receiveExactAmount);
    }
  };

  const handleSubmit = () => {
    if (senderAmount) {
      swapRequest();
    }
  };

  useEffect(() => {
    const effect = async () => {
      if (senderAmount) {
        enforcer(senderAmount, false);
      }
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderAmount]);

  return (
    <>
      <ModalContent id="modalContent">
        <Header title="Send Amount" options={options} />
        <ModalBody>
          <Stack column={true} spacing={5}>
            <Stack column={true} spacing={4}>
              <Stack column={true} spacing={3}>
                {existingChannelBalance && (
                  <Text flex="auto" fontSize="0.875rem" fontStyle="italic" textTransform="none" color="#333333">
                    You are adding more funds for Swap, your existing channel currently holds{" "}
                    {truncate(existingChannelBalance!, 4)} {senderChainInfo.assetName}
                  </Text>
                )}
                <Stack column={true}>
                  <Stack column={true} spacing={1}>
                    <Stack>
                      <Text flex="auto" fontSize="0.75rem">
                        You send
                      </Text>
                      {userBalance && (
                        <Text
                          fontSize="0.75rem"
                          fontFamily="Roboto Mono"
                          textTransform="uppercase"
                          textAlign="end"
                          color="#757575"
                        >
                          Balance: {truncate(userBalance, 4)} {senderChainInfo.assetName}
                        </Text>
                      )}
                    </Stack>
                    <Stack colorScheme="white" alignItems="center" borderRadius="5px">
                      <InputGroup flex="auto" colorScheme="white">
                        <Input
                          body="lg"
                          title="Token Amount"
                          aria-describedby="amount"
                          // styling
                          fontSize="1rem"
                          // universal input options
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          // text-specific options
                          type="text"
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          placeholder={"0.0"}
                          minLength={1}
                          maxLength={79}
                          spellCheck="false"
                          // value
                          value={senderAmount}
                          onChange={event => {
                            enforcer(event.target.value.replace(/,/g, "."), false);
                          }}
                          readOnly={inputReadOnly ? true : false}
                        />
                      </InputGroup>
                      {existingChannelBalance && (
                        <Stack>
                          <Text
                            margin="0 10px 0 0"
                            fontFamily="Roboto Mono"
                            textTransform="uppercase"
                            fontSize="1rem"
                            color="#333333"
                          >
                            +
                          </Text>

                          <Text
                            margin="0 20px 0 0"
                            fontFamily="Roboto Mono"
                            textTransform="uppercase"
                            fontSize="1rem"
                            color="#333333"
                          >
                            {truncate(existingChannelBalance!, 4)}
                          </Text>
                        </Stack>
                      )}

                      {userBalance && (
                        <Button
                          size="xs"
                          colorScheme="#DEDEDE"
                          color="#737373"
                          borderRadius="5px"
                          border="none"
                          borderStyle="none"
                          casing="uppercase"
                          marginRight="10px!important"
                          height="1.5rem"
                          disabled={inputReadOnly ? true : false}
                          onClick={() => {
                            enforcer(userBalance, false);
                          }}
                        >
                          max
                        </Button>
                      )}

                      <Text
                        margin="0 10px 0 0"
                        fontFamily="Roboto Mono"
                        textTransform="uppercase"
                        fontSize="1rem"
                        color="#333333"
                      >
                        {senderChainInfo.assetName}
                      </Text>
                    </Stack>
                  </Stack>

                  <Stack justifyContent="center" margin="10px 0px 0px 0px!important">
                    <img
                      src="https://cdn.connext.network/arrow_downward.svg"
                      width="24px"
                      height="24px"
                      alt="arrow_downward"
                    />
                  </Stack>

                  <Stack column={true} spacing={1}>
                    <Text fontSize="0.75rem">Recipient gets</Text>
                    <Stack colorScheme="white" alignItems="center" borderRadius="5px">
                      <InputGroup flex="auto" colorScheme="white">
                        <Input
                          body="lg"
                          title="Token Amount"
                          aria-describedby="amount"
                          // styling
                          fontSize="1rem"
                          // universal input options
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          // text-specific options
                          type="text"
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          placeholder={"0.0"}
                          minLength={1}
                          maxLength={79}
                          spellCheck="false"
                          // value
                          value={recipientAmount}
                          onChange={event => {
                            enforcer(event.target.value.replace(/,/g, "."), true);
                          }}
                          // readOnly={inputReadOnly ? true : false}
                          readOnly={true}
                        />
                      </InputGroup>
                      <Text
                        margin="0 10px 0 0"
                        fontFamily="Roboto Mono"
                        textTransform="uppercase"
                        fontSize="1rem"
                        color="#333333"
                      >
                        {receiverChainInfo.assetName}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack column={true} spacing={2}>
                  {swapRate && (
                    <Stack>
                      <Text fontSize="0.875rem" fontWeight="700" flex="auto" color="#666666">
                        Price:
                      </Text>
                      <Text
                        textTransform="none"
                        fontSize="0.875rem"
                        fontFamily="Roboto Mono"
                        color="#666666"
                        fontWeight="700"
                      >
                        {truncate(swapRate, 6)} <span style={{ color: "#26B1D6" }}>{senderChainInfo.assetName}</span>{" "}
                        per 1 <span style={{ color: "#2964C5" }}>{receiverChainInfo.assetName}</span>
                      </Text>
                    </Stack>
                  )}

                  {feeQuote && (
                    <Stack>
                      <Text fontSize="0.875rem" fontWeight="700" flex="auto" color="#666666">
                        Estimated Fees:
                      </Text>
                      <Text fontSize="0.875rem" fontFamily="Roboto Mono" color="#666666" fontWeight="700">
                        {truncate(feeQuote, 6)} {senderChainInfo.assetName}
                      </Text>
                    </Stack>
                  )}
                </Stack>
              </Stack>
              {!!amountError && (
                <Text flex="auto" fontSize="0.75rem" textAlign="center" color="crimson">
                  {amountError}
                </Text>
              )}

              {userAddress && receiverAddress !== userAddress && (
                <Stack spacing={1}>
                  <input type="checkbox" name="confirmation" checked={check} onChange={() => setCheck(!check)} />
                  <Text flex="auto" fontSize="0.875rem">
                    Please confirm the receiver address on {receiverChainInfo.name}
                  </Text>
                </Stack>
              )}

              {vaultName && (
                <Stack spacing={1}>
                  <Text flex="auto" fontSize="0.875rem">
                  Destination Vault: {vaultName}
                  </Text>
                </Stack>
              )}

              <Button
                size="lg"
                type="submit"
                disabled={!!amountError || !senderAmount || isLoad || !check ? true : false}
                onClick={handleSubmit}
              >
            {isLoad
                  ? `Waiting for tx + ${getConfirmationsForChain(senderChainInfo.chainId)} confirmations`
                  : "Swap"}
              </Button>
            </Stack>

            <NetworkBar
              senderChainInfo={senderChainInfo}
              receiverChainInfo={receiverChainInfo}
              receiverAddress={receiverAddress}
            />
          </Stack>
        </ModalBody>

        <Footer />
      </ModalContent>
    </>
  );
};

export default Swap;
