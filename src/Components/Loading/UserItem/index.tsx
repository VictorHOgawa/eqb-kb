import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native';
import themes from '../../../global/themes';

import {
    Category,
    Container
} from './styles';

interface Props {
    loading: boolean,
    children: any
}

export function UserItemLoading({ loading, children }: Props):any {

    const opacity = useRef(new Animated.Value(0.3))

    useEffect(() => {
        if(loading){
            Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        opacity.current, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 700
                    }),
                    Animated.timing(
                        opacity.current, {
                        toValue: 0.3,
                        useNativeDriver: true,
                        duration: 1000
                    })
                ])
            ).start()
        }

        if(!loading){
            Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        opacity.current, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 500
                    }),
                    Animated.timing(
                        opacity.current, {
                        toValue: 0.3,
                        useNativeDriver: true,
                        duration: 800
                    })
                ])
            ).stop()
        }
        

    }, [opacity, loading])


    if(loading){
    return (
        <Container>
            <Category>
                <Animated.View
                    style={[{
                        width: '100%',
                        height: '100%',
                        opacity: opacity.current,
                        backgroundColor: themes.colors.secondaryFade
                    }]}
                />
            </Category>
            <Category>
                <Animated.View
                    style={[{
                        width: '100%',
                        height: '100%',
                        opacity: opacity.current,
                        backgroundColor: themes.colors.secondaryFade
                    }]}
                />
            </Category>
        </Container>
    )}

     if (!loading) {
         return (
             <>{children}</>
         )
     }
}