import React, { FC } from 'react';
import styled from 'styled-components';
import { success } from '../../public';
import { Text, Stack, WarningIcon, Box } from './Theme';
import Loader from './Loader';

interface HeaderProps {
  title: string;
  onClose?: () => void;
  options?: () => void;
  handleBack?: () => void;
  subTitle?: React.ReactNode;
  warningIcon?: boolean;
  successIcon?: boolean;
  spinner?: boolean;
}

const Header: FC<HeaderProps> = props => {
  const {
    title,
    subTitle,
    warningIcon,
    successIcon,
    spinner,
    onClose,
    options,
    handleBack,
  } = props;
  return (
    <>
      <ModalHeader>
        <Stack justifyContent="space-between">
          <Stack alignItems="center" spacing={2}>
            {warningIcon && <WarningIcon />}
            {successIcon && <img src={success} />}
            {spinner && <Loader color="blue" />}
            <Text
              fontWeight="700"
              fontFamily="Cooper Hewitt"
              textTransform="uppercase"
              fontSize="1.5rem"
              lineHeight="30px"
            >
              {title}
            </Text>
          </Stack>
          <Stack>
            {handleBack && handleBack()}
            {options && options()}
            {onClose && onClose()}
          </Stack>
        </Stack>
        {subTitle && <div>{subTitle}</div>}
      </ModalHeader>
    </>
  );
};

export default Header;

const ModalHeader = styled.header`
  padding: 1rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-width: 0px;
  border-style: solid;
  box-sizing: border-box;
`;

// const Text = styled.p`
//   margin-top: 0px;
//   flex: 1 1 auto;
// `;
