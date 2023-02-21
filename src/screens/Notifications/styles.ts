import styled from 'styled-components/native';
import { Text } from 'react-native-paper';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const HeaderContainer = styled.SafeAreaView`
  padding: 12px;
`;

export const LoadingIcon = styled.ActivityIndicator`
  flex: 1;
  justify-content: center;
  padding: 10px;
`;

export const NotificationListContainer = styled.SafeAreaView`
  padding: 8px;
`;

export const DialogItemsList = styled.TouchableOpacity`
  padding: 4px 8px 4px 12px;
  margin: 4px;
  border-radius: 6px;
`;

export const DialogItemsText = styled(Text)`
  font-size: 16px;
  margin: 8px;
`;
