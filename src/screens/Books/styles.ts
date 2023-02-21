import styled from 'styled-components/native';
import { Text } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

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

export const ServiceOrderListContainer = styled.SafeAreaView`
  padding: 8px;
`;

export const DialogText = styled(Text)`
  font-size: 16px;
  margin: 8px;
`;

export const DialogRow = styled.SafeAreaView`
  flex-direction: row;
`;

export const DialogSelectText = styled(Text)`
  font-size: 16px;
  border-radius: 4px;
  border-color: ${theme.colors.placeholder};
  border-width: 1px;
  padding: 12px;
  min-height: 58px;
  text-align-vertical: center;
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
