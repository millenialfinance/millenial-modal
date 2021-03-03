import React, { FC } from 'react';
import { utils } from 'ethers';
import CSS from 'csstype';
import {
  Header,
  Footer,
  NetworkBar,
  ModalContent,
  ModalBody,
  Text,
  Stack,
  Box,
  Button,
} from '../static';
import { CHAIN_DETAIL } from '../../constants';
import { lightGraphic } from '../../public';
import { getExplorerLinkForTx } from '../../utils';

export interface SuccessProps {
  amount: string;
  transactionId: string;
  senderChainInfo?: CHAIN_DETAIL;
  receiverChainInfo: CHAIN_DETAIL;
  receiverAddress: string;
  onClose: () => void;
  options: () => void;
}

const styleModalContent: CSS.Properties = {
  backgroundImage: `url(${lightGraphic})`,
  backgroundPosition: 'right top',
};

const Success: FC<SuccessProps> = props => {
  const {
    amount,
    transactionId,
    senderChainInfo,
    receiverChainInfo,
    receiverAddress,
    onClose,
    options,
  } = props;
  return (
    <>
      <ModalContent id="modalContent" style={styleModalContent}>
        <Header
          title="Success"
          successIcon={true}
          options={options}
          onClose={onClose}
        />
        <ModalBody>
          <Stack column={true} spacing={7}>
            <Box>
              <Stack column={true} spacing={2}>
                <Stack spacing={2}>
                  <Text
                    fontSize="1.5rem"
                    fontFamily="Cooper Hewitt"
                    fontWeight="700"
                    lineHeight="30px"
                    // flex="auto"
                  >
                    {utils.formatUnits(amount, receiverChainInfo.assetDecimals)}{' '}
                    {receiverChainInfo.assetName}
                  </Text>
                  <Button
                    size="sm"
                    borderRadius="5px"
                    colorScheme="purple"
                    border="none"
                    color="white!important"
                    casing="uppercase!important"
                    onClick={() =>
                      window.open(
                        getExplorerLinkForTx(
                          receiverChainInfo.chainId,
                          transactionId
                        ),
                        '_blank'
                      )
                    }
                  >
                    view tx
                  </Button>
                </Stack>
                <Box>
                  <Text fontSize="1rem">
                    {`Now available on ${receiverChainInfo.name}.`}
                  </Text>
                </Box>
              </Stack>
            </Box>

            {senderChainInfo && receiverChainInfo && (
              <NetworkBar
                senderChainInfo={senderChainInfo}
                receiverChainInfo={receiverChainInfo}
                receiverAddress={receiverAddress}
              />
            )}
          </Stack>
        </ModalBody>
        <Footer />
      </ModalContent>
    </>
  );
};

export default Success;
