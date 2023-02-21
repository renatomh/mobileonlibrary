import styled from 'styled-components/native';
import { Text } from 'react-native-paper';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const AvatarContainer = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
  margin: 24px;
  align-self: center;
`;

export const DataContainer = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
  margin: 8px;
`;

export const RowTitle = styled(Text)`
  margin: 4px;
  font-size: 14px;
  text-align: left;
`;

export const RowText = styled(Text)`
  margin: 4px 4px 4px 10px;
  font-size: 16px;
  padding: 2px;
  text-align: justify;
`;
