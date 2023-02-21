import styled from 'styled-components/native';
import { CoolGreenTheme as theme } from '../../themes';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const HeaderContainer = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
  padding: 4px 12px;
`;

export const HeaderTitleContainer = styled.SafeAreaView`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  margin: 6px 8px;
`;

export const HeaderTitleText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  align-self: center;
  padding: 12px 12px;
`;

export const HeaderContentText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${theme.colors.text};
  padding: 4px 4px;
`;

export const TitleText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.backdrop};
  align-self: center;
  padding: 12px 12px;
`;
