import styled from 'styled-components/native';
import { Paragraph, Title, Caption, Drawer } from 'react-native-paper';
import { CoolGreenTheme as theme } from '../../themes';

export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.surface};
`;

export const DrawerContent = styled.View`
  flex: 1;
`;

export const UserInfoSection = styled.View`
  padding-left: 20px;
`;

export const DrawerTitle = styled(Title)`
  font-size: 16px;
  margin-top: 3px;
  font-weight: bold;
`;

export const DrawerCaption = styled(Caption)`
  font-size: 14px;
  line-height: 14px;
`;

export const Row = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
`;

export const Section = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
`;

export const DrawerParagraph = styled(Paragraph)`
  font-weight: bold;
  margin-right: 3px;
  font-size: 14px;
  line-height: 14px;
`;

export const BottomDrawerSection = styled(Drawer.Section)`
  margin-bottom: 6px;
  border-top-color: ${theme.colors.placeholder};
  border-top-width: 1px;
`;
