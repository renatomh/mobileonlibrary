import styled from 'styled-components/native';
import { Text, IconButton } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

export const CardContainer = styled.SafeAreaView`
  flex-direction: column;
  padding: 8px 8px;
  margin: 4px 0px;
  border-radius: 8px;
  background: ${theme.colors.notificationBackdrop};
`;

export const CardRow = styled.SafeAreaView`
  padding: 4px 4px;
  flex-direction: row;
  align-items: center;
`;

export const CardTitle = styled(Text)`
  flex: 1;
  font-family: 'RobotoSlab-Medium';
  color: ${theme.colors.onSurface};
  font-size: 20px;
  font-weight: bold;
`;

export const CardText = styled(Text)`
  flex: 1;
  margin: 2px;
  font-size: 14px;
  text-align: left;
  line-height: 18px;
`;

export const CardViewButton = styled(IconButton)`
  margin: 0px 4px 0px 4px;
`;
