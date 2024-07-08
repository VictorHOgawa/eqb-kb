import styled from 'styled-components/native'
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize'
import themes from '../../../global/themes'
export const Container = styled.View`
width: 100%;
padding: 10px;
`

export const Category = styled.View`
justify-content: center;
align-items: center;
width: 100%;
height: ${RFValue(100)}px;
border-radius: 15px;
margin-top: 20px;
overflow: hidden;
background-color: ${themes.colors.background};
`