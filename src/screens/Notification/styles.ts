import styled from 'styled-components/native';
import { Text } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const AreaContainer = styled.ScrollView`
  padding: 4px;
  margin-bottom: 8px;
`;

export const LoadingIcon = styled.ActivityIndicator`
  flex: 1;
  justify-content: center;
  padding: 10px;
`;

export const Title = styled(Text)`
  font-size: 22px;
  margin: 18px 10px;
`;

export const Description = styled(Text)`
  margin: 12px 4px;
  font-size: 20px;
  text-align: left;
`;

export const DeliveryTime = styled(Text)`
  margin: 12px;
  font-size: 16px;
  text-align: left;
  color: ${theme.colors.placeholder};
`;
