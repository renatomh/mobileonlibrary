import styled from 'styled-components/native';
import { Text } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

export const CardContainer = styled.SafeAreaView`
  flex-direction: row;
  padding: 4px;
  margin: 8px 4px;
  border-radius: 4px;
  background-color: ${theme.colors.notificationBackdrop};
`;

export const ImageArea = styled.TouchableOpacity`
  margin: 2px;
  align-self: center;
  padding: 4px;
`;

export const ThumbnailContainer = styled.SafeAreaView`
  height: 82px;
  width: 82px;
  border-radius: 4px;
  background-color: ${theme.colors.notification};
  align-items: center;
  justify-content: center;
`;

export const MainArea = styled.SafeAreaView`
  flex: 1;
  margin: 2px;
  padding: 2px;
`;

export const IconsArea = styled.SafeAreaView`
  margin: 6px 6px 0px 2px;
`;

export const RowContainer = styled.SafeAreaView`
  flex-direction: row;
`;

export const RowsText = styled(Text)`
  flex: 1;
  margin: 2px;
  font-size: 14px;
  text-align: left;
  line-height: 18px;
`;
