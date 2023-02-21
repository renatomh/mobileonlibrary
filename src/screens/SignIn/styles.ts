import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Headline } from 'react-native-paper';

/* Container styling */
export const Container = styled.View`
  flex: 1;
  justify-content: center;
  /* Spacing when keyboard opens */
  padding: 0 30px ${Platform.OS === 'android' ? 0 : 40}px;
`;

export const Banner = styled.View`
  align-items: center;
`;

/* Title styling */
export const Title = styled(Headline)`
  margin: 24px 0 24px;
`;

export const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
