import styled from 'styled-components/native';
import { Text } from 'react-native-paper';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const LoadingIcon = styled.ActivityIndicator`
  flex: 1;
  justify-content: center;
  padding: 10px;
`;

export const TabTitle = styled(Text)`
  font-size: 22px;
  margin: 10px;
`;

export const ItemDocumentListContainer = styled.View`
  flex: 1;
  padding: 8px;
`;

export const DialogText = styled(Text)`
  font-size: 16px;
  margin: 8px;
`;
