import styled from 'styled-components/native';
import { Text } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../../themes';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const PhotoContainer = styled.SafeAreaView`
  margin: 16px;
  align-self: center;
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

export const HorizontalRule = styled.View`
  border-bottom-color: ${theme.colors.onSurface};
  border-bottom-width: 1px;
  margin-horizontal: 4px;
  margin-vertical: 12px;
`;
