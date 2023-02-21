import styled from 'styled-components/native';
import { Text } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 4px;
  margin: 12px;
  align-items: center;
`;

export const DisplayText = styled(Text)`
  margin: 12px;
  font-size: 18px;
  color: ${theme.colors.text};
`;
